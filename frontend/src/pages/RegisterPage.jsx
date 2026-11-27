import { useState } from "react";
import { Link } from "react-router-dom";

import { ApiError } from "../api/client.js";
import { registerStudent, resendVerification } from "../api/endpoints.js";
import { normalizeEmail, validateRegisterForm } from "../validation/studentValidation.js";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendStatus, setResendStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setResendStatus("");

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
      setResendStatus("A new verification link has been sent to your e-mail.");
    } catch (err) {
      setResendStatus(err instanceof ApiError ? err.message : "Could not resend verification e-mail.");
    } finally {
      setResending(false);
    }
  }

  return (
    <section className="card auth-card">
      <h1 className="auth-card__title">Career Advisor Matching</h1>

      <nav className="auth-tabs" aria-label="Authentication mode">
        <Link to="/login" className="auth-tab">
          Log In
        </Link>
        <span className="auth-tab auth-tab--active">Register</span>
      </nav>

      {formError && (
        <div className="alert alert--error" role="alert">
          {formError}
        </div>
      )}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="reg-name">
            Full Name
          </label>
          <input
            id="reg-name"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Kenan Arslan"
            className={`field__input ${fieldErrors.fullName ? "field__input--error" : ""}`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            aria-invalid={Boolean(fieldErrors.fullName)}
          />
          {fieldErrors.fullName && <span className="field__error">{fieldErrors.fullName}</span>}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="reg-email">
            School Email
          </label>
          <input
            id="reg-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="s012345678@ankarabilim.edu.tr"
            className={`field__input ${fieldErrors.email ? "field__input--error" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email && <span className="field__error">{fieldErrors.email}</span>}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="reg-password">
            Password
          </label>
          <input
            id="reg-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className={`field__input ${fieldErrors.password ? "field__input--error" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(fieldErrors.password)}
          />
          <span className="field__hint field__hint--right">Minimum 8 characters</span>
          {fieldErrors.password && <span className="field__error">{fieldErrors.password}</span>}
        </div>

        <div className="auth-card__submit">
          <button type="submit" className="button button--primary button--auth" disabled={submitting}>
            {submitting ? "Creating account..." : "Register"}
          </button>
        </div>
      </form>

      {registeredEmail && (
        <div className="auth-card__sent">
          <p className="auth-card__sent-text">We sent a verification link to your e-mail.</p>
          <button
            type="button"
            className="link-button"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? "Sending..." : "Resend verification link"}
          </button>
          {resendStatus && <p className="auth-card__note">{resendStatus}</p>}
        </div>
      )}
    </section>
  );
}