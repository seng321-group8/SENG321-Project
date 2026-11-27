import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { getSession } from "./auth/session.js";
import Layout from "./components/Layout.jsx";
import RequireRole from "./components/RequireRole.jsx";
import { HOME, NAV, ROLE_PREFIX, homePathFor } from "./navigation.js";
import LoginPage from "./pages/LoginPage.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import StudentProfilePage from "./pages/StudentProfilePage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";

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

function elementForRoute(role, item) {
  if (role === "student" && item.path === "profile") {
    return <StudentProfilePage />;
  }
  return <PlaceholderPage title={item.label} note={item.note} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route element={<PublicShell />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
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
                element={elementForRoute(role, item)}
              />
            ))}
          </Route>
        </Route>
      ))}
    </Routes>
  );
}