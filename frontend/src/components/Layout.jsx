import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { clearSession, getSession } from "../auth/session.js";
import { NAV, ROLE_LABEL, ROLE_PREFIX } from "../navigation.js";
import ApiStatus from "./ApiStatus.jsx";

export default function Layout({ role }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const session = getSession();

  function signOut() {
    clearSession();
    navigate("/login");
  }

  return (
    <>
      <header className="topbar">
        <span className="brand">Career Advisor Matching</span>
        <button
          type="button"
          className="menu-button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          ☰
        </button>
        <nav className={menuOpen ? "nav nav--open" : "nav"} aria-label="Main">
          {NAV[role].map((item) => (
            <NavLink
              key={item.path}
              to={`${ROLE_PREFIX[role]}/${item.path}`}
              className={({ isActive }) => (isActive ? "nav__link nav__link--active" : "nav__link")}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <button type="button" className="nav__link nav__signout" onClick={signOut}>
            Sign out
          </button>
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">
        <span className="muted">
          {ROLE_LABEL[role]}: {session?.name}
        </span>
        <ApiStatus />
      </footer>
    </>
  );
}