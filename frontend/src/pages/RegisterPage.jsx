import { useState } from "react";
import { Link } from "react-router-dom";

import { ApiError } from "../api/client.js";
import { registerStudent, resendVerification } from "../api/endpoints.js";
import { normalizeEmail, validateRegisterForm } from "../validation/studentValidation.js";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendStatus, setResendStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const errors = validateRegisterForm({ fullName, email, password });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const cleanEmail = normalizeEmail(email);
    setSubmitting(true);
    try {
      const response = await registerStudent({
        fullName: fullName.trim(),
        email: cleanEmail,
        password,
      });
      setRegisteredEmail(response?.email || cleanEmail);
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
        setFormError(err.message);
      } else {
        setFormError("Unable to reach the server. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (!registeredEmail) return;
    setResending(true);
    setResendStatus("");
    try {
      await resendVerification({ email: registeredEmail });
      setResendStatus("A new verification link has been sent to your inbox.");
    } catch (err) {
      setResendStatus(err instanceof ApiError ? err.message : "Could not resend verification e-mail.");
    } finally {
      setResending(false);
    }
  }

  if (registeredEmail) {
    return (
      <section className="card auth-card">
        <div className="auth-card__header">
          <span className="badge badge--matched">Verification required</span>
          <h1>Check your inbox</h1>
          <p className="muted">
            We sent a verification link to <strong>{registeredEmail}</strong>. Click the link in that
            e-mail to activate your account before logging in.
          </p>
        </div>

        {resendStatus && (
          <div className="alert alert--info" role="status">
            {resendStatus}
          </div>
        )}

        <div className="button-row">
          <Link to="/login" className="button button--primary">
            Back to Log in
          </Link>
          <button
            type="button"
            className="button"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? "Sending..." : "Resend link"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="card auth-card">
      <div className="auth-card__header">
        <span className="eyebrow">Student Registration</span>
        <h1>Create account</h1>
        <p className="muted">
          Register with your Ankara Bilim University student e-mail (<code>s</code> + 9 digits).
        </p>
      </div>

      {formError && (
        <div className="alert alert--error" role="alert">
          {formError}
        </div>
      )}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="reg-name">
            Full name
          </label>
          <input
            id="reg-name"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            className={`field__input ${fieldErrors.fullName ? "field__input--error" : ""}`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            aria-invalid={Boolean(fieldErrors.fullName)}
          />
          {fieldErrors.fullName && <span className="field__error">{fieldErrors.fullName}</span>}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="reg-email">
            School e-mail
          </label>
          <input
            id="reg-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="s230205030@ankarabilim.edu.tr"
            className={`field__input ${fieldErrors.email ? "field__input--error" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          <span className="field__hint">Format: s + 9-digit student number + @ankarabilim.edu.tr</span>
          {fieldErrors.email && <span className="field__error">{fieldErrors.email}</span>}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="reg-password">
            Password
          </label>
          <div className="password-wrap">
            <input
              id="reg-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className={`field__input ${fieldErrors.password ? "field__input--error" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <span className="field__hint">Minimum 8 characters.</span>
          {fieldErrors.password && <span className="field__error">{fieldErrors.password}</span>}
        </div>

        <button type="submit" className="button button--primary button--full" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="auth-card__footer muted">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </section>
  );
}