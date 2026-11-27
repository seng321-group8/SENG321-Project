import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

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
import { getSession } from "../auth/session.js";
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

function formatDateTime(isoString) {
  if (!isoString) return "Sunday at 22:00";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function StudentProfilePage() {
  const session = getSession();
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

  // Merge active interests with any deactivated interest already stored on the student's profile.
  const availableInterests = (() => {
    const byId = new Map(interests.map((item) => [item.id, item]));
    if (Array.isArray(profileMeta?.interests)) {
      profileMeta.interests.forEach((item) => {
        if (!byId.has(item.id)) byId.set(item.id, item);
      });
    }
    return [...byId.values()];
  })();

  function toggleInterest(id) {
    setFieldErrors((prev) => ({ ...prev, interestIds: undefined }));
    setInterestIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= MAX_INTERESTS) return prev;
      return [...prev, id];
    });
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
          ? "Profile updated. Your current advisor assignment stays unchanged."
          : `Profile saved. You are queued for the next matching run (${formatDateTime(updated.nextAssignmentAt)}).`,
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
      <section className="card">
        <h1>Student profile</h1>
        <p className="muted">Loading your profile...</p>
      </section>
    );
  }

  const displayName = profileMeta?.fullName || session?.name || "Student";
  const matchStatus = profileMeta?.matchStatus || "waiting";

  return (
    <div className="profile-layout">
      <section className="card">
        <div className="profile-header">
          <div>
            <span className="eyebrow">Student Profile</span>
            <h1>{displayName}</h1>
            {profileMeta?.studentNo && (
              <p className="muted">
                Student ID: <strong>{profileMeta.studentNo}</strong>
              </p>
            )}
          </div>
          <span className={`badge ${matchStatus === "matched" ? "badge--matched" : "badge--waiting"}`}>
            {matchStatus === "matched" ? "Advisor assigned" : "Waiting for match"}
          </span>
        </div>

        <p className="muted">
          Complete your academic details and select 1 to {MAX_INTERESTS} career interests. Matching
          runs every Sunday at 22:00.
        </p>

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
          <div className="form-row">
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
              <label className="field__label" htmlFor="profile-gpa">
                GPA (0.00 – 4.00)
              </label>
              <input
                id="profile-gpa"
                name="gpa"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                max="4"
                placeholder="3.25"
                className={`field__input ${fieldErrors.gpa ? "field__input--error" : ""}`}
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                aria-invalid={Boolean(fieldErrors.gpa)}
              />
              {fieldErrors.gpa && <span className="field__error">{fieldErrors.gpa}</span>}
            </div>
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
            <div className="field__label-row">
              <span className="field__label">Career interests</span>
              <span className="field__hint">
                {interestIds.length} / {MAX_INTERESTS} selected
              </span>
            </div>

            {availableInterests.length === 0 ? (
              <p className="muted">No interest areas available.</p>
            ) : (
              <div className="chip-grid" role="group" aria-label="Career interests">
                {availableInterests.map((interest) => {
                  const selected = interestIds.includes(interest.id);
                  const disabled =
                    (!selected && interestIds.length >= MAX_INTERESTS) ||
                    (!selected && interest.active === false);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      className={`chip ${selected ? "chip--selected" : ""}`}
                      onClick={() => toggleInterest(interest.id)}
                      disabled={disabled}
                      aria-pressed={selected}
                    >
                      {interest.name}
                      {interest.active === false ? " (inactive)" : ""}
                    </button>
                  );
                })}
              </div>
            )}
            {fieldErrors.interestIds && (
              <span className="field__error">{fieldErrors.interestIds}</span>
            )}
          </div>

          <button type="submit" className="button button--primary" disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>

      <aside className="profile-side">
        <section className="card">
          <h2>CV (Optional)</h2>
          <p className="muted">
            Upload your CV in PDF format (max 2 MB). Only you and your assigned advisor can view it.
          </p>

          {cvError && (
            <div className="alert alert--error" role="alert">
              {cvError}
            </div>
          )}

          {cvSuccess && (
            <div className="alert alert--success" role="status">
              {cvSuccess}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={handleCvSelect}
          />

          {hasCv ? (
            <div className="cv-box">
              <div className="cv-box__meta">
                <strong>{cvInfo?.fileName || "Uploaded CV (PDF)"}</strong>
                {cvInfo?.sizeBytes != null && (
                  <span className="muted">
                    {formatBytes(cvInfo.sizeBytes)} • Uploaded {formatDateTime(cvInfo.uploadedAt)}
                  </span>
                )}
              </div>
              <div className="button-row">
                <button
                  type="button"
                  className="button button--primary button--small"
                  onClick={handleCvDownload}
                  disabled={cvBusy}
                >
                  Download PDF
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
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="button button--full"
              onClick={() => fileInputRef.current?.click()}
              disabled={cvBusy}
            >
              {cvBusy ? "Uploading..." : "Upload CV (PDF, max 2 MB)"}
            </button>
          )}
        </section>

        <section className="card">
          <h2>Matching status</h2>
          {matchStatus === "matched" ? (
            <>
              <p className="muted">You have an assigned career advisor.</p>
              <Link to="/student/advisor" className="button button--full">
                View my advisor
              </Link>
            </>
          ) : (
            <p className="muted">
              Next weekly assignment run:{" "}
              <strong>{formatDateTime(profileMeta?.nextAssignmentAt)}</strong>
            </p>
          )}
        </section>
      </aside>
    </div>
  );
}