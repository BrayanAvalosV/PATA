// frontend/src/services/session.js
const KEY = "pata_token";
const USER = "pata_user";

export function saveSession(token, user) {
  localStorage.setItem(KEY, token);
  localStorage.setItem(USER, JSON.stringify(user || null));
}
export function getToken() {
  return localStorage.getItem(KEY) || "";
}
export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER) || "null"); }
  catch { return null; }
}
export function clearSession() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(USER);
}
