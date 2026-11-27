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
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="auth-card__header">
        <span className="eyebrow">Career Advisor System</span>
        <h1>Log in</h1>
        <p className="muted">Sign in with your Ankara Bilim University e-mail address.</p>
      </div>

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
            University e-mail
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
          <div className="password-wrap">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
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
          {fieldErrors.password && <span className="field__error">{fieldErrors.password}</span>}
        </div>

        <button type="submit" className="button button--primary button--full" disabled={submitting}>
          {submitting ? "Signing in..." : "Log in"}
        </button>
      </form>

      <p className="auth-card__footer muted">
        New student? <Link to="/register">Register</Link>
      </p>
    </section>
  );
}