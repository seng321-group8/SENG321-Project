import { Link, Navigate, Outlet } from "react-router-dom";

import { getSession } from "../auth/session.js";
import { homePathFor } from "../navigation.js";

export default function RequireRole({ role }) {
  const session = getSession();

  if (!session) return <Navigate to="/login" replace />;

  if (session.role !== role) {
    return (
      <main className="public">
        <section className="card" role="alert">
          <h1>Access denied (403)</h1>
          <p className="muted">Your account cannot open this page.</p>
          <Link className="button button--primary" to={homePathFor(session.role)}>
            Go to my home page
          </Link>
        </section>
      </main>
    );
  }

  return <Outlet />;
}