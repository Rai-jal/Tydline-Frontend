export const API_BASE = "https://tydline-core-194522079688.europe-west1.run.app";

const defaults: RequestInit = { credentials: "include" };

export function apiGet(path: string) {
  return fetch(`${API_BASE}${path}`, defaults);
}

export function apiPost(path: string, body?: unknown) {
  return fetch(`${API_BASE}${path}`, {
    ...defaults,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function apiPostForm(path: string, form: FormData) {
  return fetch(`${API_BASE}${path}`, {
    ...defaults,
    method: "POST",
    body: form,
  });
}

export function apiDelete(path: string) {
  return fetch(`${API_BASE}${path}`, { ...defaults, method: "DELETE" });
}
