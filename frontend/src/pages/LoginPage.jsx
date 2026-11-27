import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ApiError } from "../api/client.js";
import { login, resendVerification } from "../api/endpoints.js";
import { startSession } from "../auth/session.js";
import { homePathFor } from "../navigation.js";
import { normalizeEmail, validateLoginForm } from "../validation/studentValidation.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setResendMessage("");
    setUnverifiedEmail("");

    const errors = validateLoginForm({ email, password });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const cleanEmail = normalizeEmail(email);
    setSubmitting(true);
    try {
      const response = await login({ email: cleanEmail, password });
      const session = startSession(response);
      navigate(homePathFor(session.role), { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "EMAIL_NOT_VERIFIED") {
          setUnverifiedEmail(cleanEmail);
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
    if (!unverifiedEmail) return;
    setResending(true);
    setResendMessage("");
    try {
      await resendVerification({ email: unverifiedEmail });
      setResendMessage("Verification e-mail sent. Please check your university inbox.");
    } catch (err) {
      setResendMessage(err instanceof ApiError ? err.message : "Could not resend verification e-mail.");
    } finally {
      setResending(false);
    }
  }

  return (
    <section className="card auth-card">
      <h1 className="auth-card__title">Career Advisor Matching</h1>

      <nav className="auth-tabs" aria-label="Authentication mode">
        <span className="auth-tab auth-tab--active">Log In</span>
        <Link to="/register" className="auth-tab">
          Register
        </Link>
      </nav>

      {formError && (
        <div className="alert alert--error" role="alert">
          <p>{formError}</p>
          {unverifiedEmail && (
            <button
              type="button"
              className="button button--small"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? "Sending..." : "Resend verification e-mail"}
            </button>
          )}
        </div>
      )}

      {resendMessage && (
        <div className="alert alert--info" role="status">
          {resendMessage}
        </div>
      )}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="login-email">
            School Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="s123456789@ankarabilim.edu.tr"
            className={`field__input ${fieldErrors.email ? "field__input--error" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email && <span className="field__error">{fieldErrors.email}</span>}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={`field__input ${fieldErrors.password ? "field__input--error" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(fieldErrors.password)}
          />
          {fieldErrors.password && <span className="field__error">{fieldErrors.password}</span>}
        </div>

        <div className="auth-card__submit">
          <button type="submit" className="button button--primary button--auth" disabled={submitting}>
            {submitting ? "Signing in..." : "Log In"}
          </button>
        </div>
      </form>

      <p className="auth-card__note">
        New students: Switch to Register with your s+9 email and click the verification link sent to
        your inbox.
      </p>
    </section>
  );
}