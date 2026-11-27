import { useEffect, useRef, useState } from "react";

import { ApiError } from "../api/client.js";
import {
  deleteMyCv,
  downloadMyCv,
  getMyStudentProfile,
  listDepartments,
  listInterests,
  saveMyStudentProfile,
  uploadMyCv,
} from "../api/endpoints.js";
import {
  MAX_INTERESTS,
  validateCvFile,
  validateStudentProfileForm,
} from "../validation/studentValidation.js";

const YEAR_OPTIONS = [
  { value: 1, label: "1st Year" },
  { value: 2, label: "2nd Year" },
  { value: 3, label: "3rd Year" },
  { value: 4, label: "4th Year" },
];

export default function StudentProfilePage() {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [departments, setDepartments] = useState([]);
  const [interests, setInterests] = useState([]);
  const [profileMeta, setProfileMeta] = useState(null);

  const [year, setYear] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [gpa, setGpa] = useState("");
  const [interestIds, setInterestIds] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const [hasCv, setHasCv] = useState(false);
  const [cvInfo, setCvInfo] = useState(null);
  const [cvError, setCvError] = useState("");
  const [cvSuccess, setCvSuccess] = useState("");
  const [cvBusy, setCvBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadInitialData() {
      setLoading(true);
      setLoadError("");

      const [profileRes, deptRes, interestRes] = await Promise.allSettled([
        getMyStudentProfile(controller.signal),
        listDepartments(controller.signal),
        listInterests(undefined, controller.signal),
      ]);

      if (controller.signal.aborted) return;

      if (deptRes.status === "fulfilled" && Array.isArray(deptRes.value)) {
        setDepartments(deptRes.value);
      }
      if (interestRes.status === "fulfilled" && Array.isArray(interestRes.value)) {
        setInterests(interestRes.value);
      }

      if (profileRes.status === "fulfilled" && profileRes.value) {
        const p = profileRes.value;
        setProfileMeta(p);
        setYear(p.year ? String(p.year) : "");
        setDepartmentId(p.department?.id || "");
        setGpa(typeof p.gpa === "number" ? p.gpa.toFixed(2) : "");
        setInterestIds(Array.isArray(p.interests) ? p.interests.map((item) => item.id) : []);
        setHasCv(Boolean(p.hasCv));
      } else if (
        profileRes.status === "rejected" &&
        !(profileRes.reason instanceof ApiError && profileRes.reason.status === 404)
      ) {
        setLoadError(
          profileRes.reason instanceof ApiError
            ? profileRes.reason.message
            : "Could not load your profile details.",
        );
      }

      if (deptRes.status === "rejected" || interestRes.status === "rejected") {
        setLoadError((prev) => prev || "Could not load departments or interest areas.");
      }

      setLoading(false);
    }

    loadInitialData();
    return () => controller.abort();
  }, []);

  const allInterests = (() => {
    const byId = new Map(interests.map((item) => [item.id, item]));
    if (Array.isArray(profileMeta?.interests)) {
      profileMeta.interests.forEach((item) => {
        if (!byId.has(item.id)) byId.set(item.id, item);
      });
    }
    return [...byId.values()];
  })();

  const selectedInterests = interestIds
    .map((id) => allInterests.find((item) => item.id === id))
    .filter(Boolean);

  const unselectedInterests = allInterests.filter(
    (item) => !interestIds.includes(item.id) && item.active !== false,
  );

  function addInterest(id) {
    setFieldErrors((prev) => ({ ...prev, interestIds: undefined }));
    setInterestIds((prev) => {
      if (prev.includes(id) || prev.length >= MAX_INTERESTS) return prev;
      const next = [...prev, id];
      if (next.length >= MAX_INTERESTS) setPickerOpen(false);
      return next;
    });
  }

  function removeInterest(id) {
    setFieldErrors((prev) => ({ ...prev, interestIds: undefined }));
    setInterestIds((prev) => prev.filter((item) => item !== id));
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setSaveError("");
    setSaveSuccess("");

    const errors = validateStudentProfileForm({ year, departmentId, gpa, interestIds });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const cleanGpa = Number(String(gpa).trim().replace(",", "."));
    setSaving(true);
    try {
      const updated = await saveMyStudentProfile({
        year: Number(year),
        departmentId,
        gpa: cleanGpa,
        interestIds,
      });
      setProfileMeta(updated);
      setHasCv(Boolean(updated.hasCv));
      setGpa(typeof updated.gpa === "number" ? updated.gpa.toFixed(2) : cleanGpa.toFixed(2));
      setSaveSuccess(
        updated.matchStatus === "matched"
          ? "Profile saved. Your current advisor assignment remains unchanged."
          : "Profile saved. You are queued for the next weekly matching run (Sunday 22:00).",
      );
    } catch (err) {
      if (err instanceof ApiError) {
        if (Array.isArray(err.details)) {
          const apiFieldErrors = {};
          err.details.forEach((item) => {
            if (item?.field && item?.message) apiFieldErrors[item.field] = item.message;
          });
          if (Object.keys(apiFieldErrors).length > 0) {
            setFieldErrors((prev) => ({ ...prev, ...apiFieldErrors }));
          }
        }
        setSaveError(err.message);
      } else {
        setSaveError("Could not save your profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleCvSelect(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setCvError("");
    setCvSuccess("");

    const validationError = validateCvFile(file);
    if (validationError) {
      setCvError(validationError);
      return;
    }

    setCvBusy(true);
    try {
      const info = await uploadMyCv(file);
      setHasCv(true);
      setCvInfo(info);
      setCvSuccess(`Uploaded ${info?.fileName || file.name}.`);
    } catch (err) {
      setCvError(err instanceof ApiError ? err.message : "Could not upload CV.");
    } finally {
      setCvBusy(false);
    }
  }

  async function handleCvDownload() {
    setCvError("");
    setCvBusy(true);
    try {
      const blob = await downloadMyCv();
      if (!blob) {
        setCvError("CV file could not be downloaded.");
        return;
      }
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = cvInfo?.fileName || `cv-${profileMeta?.studentNo || "student"}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setCvError(err instanceof ApiError ? err.message : "Could not download CV.");
    } finally {
      setCvBusy(false);
    }
  }

  async function handleCvDelete() {
    setCvError("");
    setCvSuccess("");
    setCvBusy(true);
    try {
      await deleteMyCv();
      setHasCv(false);
      setCvInfo(null);
      setCvSuccess("CV deleted.");
    } catch (err) {
      setCvError(err instanceof ApiError ? err.message : "Could not delete CV.");
    } finally {
      setCvBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="profile-center">
        <section className="card profile-card">
          <h1 className="profile-card__title">Student Profile</h1>
          <p className="muted" style={{ textAlign: "center" }}>
            Loading your profile...
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="profile-center">
      <section className="card profile-card">
        <h1 className="profile-card__title">Student Profile</h1>

        {loadError && (
          <div className="alert alert--error" role="alert">
            {loadError}
          </div>
        )}

        {saveError && (
          <div className="alert alert--error" role="alert">
            {saveError}
          </div>
        )}

        {saveSuccess && (
          <div className="alert alert--success" role="status">
            {saveSuccess}
          </div>
        )}

        <form className="form" onSubmit={handleProfileSubmit} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="profile-year">
              Year
            </label>
            <select
              id="profile-year"
              name="year"
              className={`field__input ${fieldErrors.year ? "field__input--error" : ""}`}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              aria-invalid={Boolean(fieldErrors.year)}
            >
              <option value="">Select year</option>
              {YEAR_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldErrors.year && <span className="field__error">{fieldErrors.year}</span>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="profile-department">
              Department
            </label>
            <select
              id="profile-department"
              name="departmentId"
              className={`field__input ${fieldErrors.departmentId ? "field__input--error" : ""}`}
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              aria-invalid={Boolean(fieldErrors.departmentId)}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {fieldErrors.departmentId && (
              <span className="field__error">{fieldErrors.departmentId}</span>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="profile-gpa">
              GPA
            </label>
            <input
              id="profile-gpa"
              name="gpa"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              max="4"
              placeholder="3.45"
              className={`field__input ${fieldErrors.gpa ? "field__input--error" : ""}`}
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              aria-invalid={Boolean(fieldErrors.gpa)}
            />
            {fieldErrors.gpa && <span className="field__error">{fieldErrors.gpa}</span>}
          </div>

          <div className="field">
            <span className="field__label">Interests</span>
            <div className="interest-row">
              {selectedInterests.map((interest) => (
                <button
                  key={interest.id}
                  type="button"
                  className="interest-pill"
                  onClick={() => removeInterest(interest.id)}
                  aria-label={`Remove ${interest.name}`}
                >
                  <span>{interest.name}</span>
                  <span aria-hidden="true">×</span>
                </button>
              ))}

              {interestIds.length < MAX_INTERESTS && (
                <button
                  type="button"
                  className="interest-add-btn"
                  onClick={() => setPickerOpen((prev) => !prev)}
                  aria-expanded={pickerOpen}
                >
                  + Add Interest
                </button>
              )}
            </div>

            {pickerOpen && (
              <div className="interest-picker" role="listbox" aria-label="Available interests">
                {unselectedInterests.length === 0 ? (
                  <span className="field__hint">No more interest areas available.</span>
                ) : (
                  unselectedInterests.map((interest) => (
                    <button
                      key={interest.id}
                      type="button"
                      className="interest-picker__item"
                      onClick={() => addInterest(interest.id)}
                    >
                      {interest.name}
                    </button>
                  ))
                )}
              </div>
            )}

            <span className="field__hint">
              Select at least 1 interest ({interestIds.length}/{MAX_INTERESTS})
            </span>
            {fieldErrors.interestIds && (
              <span className="field__error">{fieldErrors.interestIds}</span>
            )}
          </div>

          <div className="field">
            <span className="field__label">CV (Optional)</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={handleCvSelect}
            />

            {!hasCv ? (
              <button
                type="button"
                className="cv-picker"
                onClick={() => fileInputRef.current?.click()}
                disabled={cvBusy}
              >
                {cvBusy ? "Uploading PDF..." : "Upload PDF (max 2 MB, optional)"}
              </button>
            ) : (
              <div className="cv-uploaded">
                <span className="cv-uploaded__name">
                  {cvInfo?.fileName || "Uploaded CV (PDF)"}
                </span>
                <div className="cv-uploaded__actions">
                  <button
                    type="button"
                    className="button button--small"
                    onClick={handleCvDownload}
                    disabled={cvBusy}
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    className="button button--small"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={cvBusy}
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    className="button button--danger button--small"
                    onClick={handleCvDelete}
                    disabled={cvBusy}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {cvError && <span className="field__error">{cvError}</span>}
            {cvSuccess && <span className="field__success">{cvSuccess}</span>}
          </div>

          <button type="submit" className="button button--primary button--full" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </section>
    </div>
  );
}