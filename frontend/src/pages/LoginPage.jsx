import { Link, useNavigate } from "react-router-dom";

import { saveSession } from "../auth/session.js";
import { ROLE_LABEL, ROLE_PREFIX, homePathFor } from "../navigation.js";

export default function LoginPage() {
  const navigate = useNavigate();

  function signInAs(role) {
    saveSession({ role, token: null, name: `Demo ${ROLE_LABEL[role].toLowerCase()}` });
    navigate(homePathFor(role));
  }

  return (
    <section className="card">
      <h1>Log in</h1>
      <p className="muted">
        The real login form is built in issue #94. Until then, sign in as a demo user to try the routes.
      </p>
      <div className="button-row">
        {Object.keys(ROLE_PREFIX).map((role) => (
          <button key={role} type="button" className="button button--primary" onClick={() => signInAs(role)}>
            {ROLE_LABEL[role]}
          </button>
        ))}
      </div>
      <p className="muted">
        New student? <Link to="/register">Register</Link>
      </p>
    </section>
  );
}