import { ROLE_PREFIX } from "../navigation.js";

const STORAGE_KEY = "career-advisor-session";

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

export function clearSession() {
  window.localStorage.removeItem(STORAGE_KEY);
}