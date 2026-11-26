import { ROLE_PREFIX } from "../navigation.js";

const STORAGE_KEY = "career-advisor-session";

// The API sends STUDENT, ADVISOR or ADMIN; the app uses the names of ROLE_PREFIX.
const ROLE_FROM_API = {
  STUDENT: "student",
  ADVISOR: "advisor",
  ADMIN: "administrator",
};

export function getSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session && Object.hasOwn(ROLE_PREFIX, session.role) ? session : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

// Call this with the response of the login operation (token and user).
export function startSession(loginResponse) {
  const role = ROLE_FROM_API[loginResponse?.user?.role];
  if (!role) throw new Error("Unknown role in the login response");
  const session = {
    role,
    token: loginResponse.token,
    name: loginResponse.user.fullName,
    userId: loginResponse.user.id,
  };
  saveSession(session);
  return session;
}

export function clearSession() {
  window.localStorage.removeItem(STORAGE_KEY);
}