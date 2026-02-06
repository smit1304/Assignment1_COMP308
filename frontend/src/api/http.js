const DEFAULT_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000"; // change if your backend uses a different port

export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${DEFAULT_BASE}${path}`;
  const { method = "GET", body, headers } = options;

  const res = await fetch(url, {
    method,
    credentials: "include", // cookie auth
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const message =
      (payload && (payload.error || payload.message)) ||
      (typeof payload === "string" && payload) ||
      `Request failed: ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}
