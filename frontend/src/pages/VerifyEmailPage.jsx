import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { ApiError } from "../api/client.js";
import { verifyEmail } from "../api/endpoints.js";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get("token") || "";
  const [token, setToken] = useState(initialToken);
  const [status, setStatus] = useState(initialToken ? "verifying" : "idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!initialToken) return;
    let active = true;

    async function runVerification() {
      setStatus("verifying");
      try {
        await verifyEmail({ token: initialToken });
        if (!active) return;
        setStatus("success");
        setMessage("Your e-mail address has been verified. You can now log in.");
      } catch (err) {
        if (!active) return;
        setStatus("error");
        setMessage(
          err instanceof ApiError
            ? err.message
            : "The verification link is invalid or has expired.",
        );
      }
    }

    runVerification();
    return () => {
      active = false;
    };
  }, [initialToken]);

  async function handleManualSubmit(event) {
    event.preventDefault();
    const cleanToken = token.trim();
    if (!cleanToken) {
      setStatus("error");
      setMessage("Enter the verification token from your e-mail.");
      return;
    }

    setStatus("verifying");
    setMessage("");
    try {
      await verifyEmail({ token: cleanToken });
      setStatus("success");
      setMessage("Your e-mail address has been verified. You can now log in.");
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof ApiError
          ? err.message
          : "The verification link is invalid or has expired.",
      );
    }
  }

  return (
    <section className="card auth-card">
      <div className="auth-card__header">
        <span className="eyebrow">Account Activation</span>
        <h1>Verify e-mail</h1>
      </div>

      {status === "verifying" && <p className="muted">Verifying your e-mail address...</p>}

      {status === "success" && (
        <>
          <div className="alert alert--success" role="status">
            {message}
          </div>
          <Link to="/login" className="button button--primary button--full">
            Continue to Log in
          </Link>
        </>
      )}

      {status === "error" && (
        <div className="alert alert--error" role="alert">
          {message}
        </div>
      )}

      {status !== "success" && status !== "verifying" && (
        <form className="form" onSubmit={handleManualSubmit}>
          <div className="field">
            <label className="field__label" htmlFor="verify-token">
              Verification token
            </label>
            <input
              id="verify-token"
              type="text"
              placeholder="Paste token from your e-mail"
              className="field__input"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <button type="submit" className="button button--primary button--full">
            Verify e-mail
          </button>
        </form>
      )}

      <p className="auth-card__footer muted">
        <Link to="/login">Back to Log in</Link>
      </p>
    </section>
  );
}