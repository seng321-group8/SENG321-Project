import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { getSession } from "./auth/session.js";
import Layout from "./components/Layout.jsx";
import RequireRole from "./components/RequireRole.jsx";
import { HOME, NAV, ROLE_PREFIX, homePathFor } from "./navigation.js";
import LoginPage from "./pages/LoginPage.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";

function PublicShell() {
  return (
    <main className="public">
      <Outlet />
    </main>
  );
}

function RootRedirect() {
  const session = getSession();
  return <Navigate to={session ? homePathFor(session.role) : "/login"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route element={<PublicShell />}>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/register"
          element={<PlaceholderPage title="Register" note="Name, school e-mail and password (issue #94)." />}
        />
        <Route path="*" element={<PlaceholderPage title="Page not found" note="This address does not exist." />} />
      </Route>

      {Object.keys(NAV).map((role) => (
        <Route key={role} path={ROLE_PREFIX[role]} element={<RequireRole role={role} />}>
          <Route element={<Layout role={role} />}>
            <Route index element={<Navigate to={HOME[role]} replace />} />
            {NAV[role].map((item) => (
              <Route
                key={item.path}
                path={item.path}
                element={<PlaceholderPage title={item.label} note={item.note} />}
              />
            ))}
          </Route>
        </Route>
      ))}
    </Routes>
  );
}