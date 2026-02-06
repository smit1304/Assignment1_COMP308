import { apiFetch } from "./http";

export async function register(username, password) {
  return apiFetch("/api/register", {
    method: "POST",
    body: { username, password },
  });
}

export async function login(username, password) {
  return apiFetch("/api/login", {
    method: "POST",
    body: { username, password },
  });
}

export async function logout() {
  return apiFetch("/api/logout", { method: "POST" });
}
