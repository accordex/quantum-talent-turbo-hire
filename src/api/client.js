/**
 * TalentTurbo — API client
 *
 * Configure your backend URL via VITE_API_BASE_URL in .env (defaults to /api).
 * Auth tokens are stored in localStorage under "tt_token".
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

function getToken() {
  return localStorage.getItem("tt_token") || null;
}

function setToken(token) {
  if (token) localStorage.setItem("tt_token", token);
  else localStorage.removeItem("tt_token");
}

async function request(method, path, body) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    const error = new Error(err.message || "Request failed");
    error.status = res.status;
    error.data = err;
    throw error;
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ─── Entity CRUD ──────────────────────────────────────────────────────────────

function makeEntityClient(entityName) {
  const base = `/entities/${entityName}`;

  return {
    list: (sort = "-created_date", limit = 100) =>
      request("GET", `${base}?sort=${encodeURIComponent(sort)}&limit=${limit}`),

    filter: (query = {}, sort = "-created_date", limit = 100) => {
      const qs = new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(query).map(([k, v]) => [k, String(v)])
        ),
        sort,
        limit,
      }).toString();
      return request("GET", `${base}?${qs}`);
    },

    get: (id) => request("GET", `${base}/${id}`),

    create: (data) => request("POST", base, data),

    bulkCreate: (items) => request("POST", `${base}/bulk`, items),

    update: (id, data) => request("PATCH", `${base}/${id}`, data),

    delete: (id) => request("DELETE", `${base}/${id}`),

    schema: () => request("GET", `${base}/schema`),

    subscribe: (callback) => {
      const token = getToken();
      const url = `${API_BASE}/events/${entityName}${token ? `?token=${token}` : ""}`;
      const es = new EventSource(url);
      es.onmessage = (e) => {
        try { callback(JSON.parse(e.data)); } catch (_) {}
      };
      return () => es.close();
    },
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

const auth = {
  isAuthenticated: async () => {
    if (!getToken()) return false;
    try { await request("GET", "/auth/me"); return true; } catch { return false; }
  },

  me: () => request("GET", "/auth/me"),

  updateMe: (updates) => request("PATCH", "/auth/me", updates),

  login: async (email, password) => {
    const data = await request("POST", "/auth/login", { email, password });
    if (data?.token) setToken(data.token);
    return data;
  },

  logout: (redirectUrl) => {
    setToken(null);
    window.location.href = redirectUrl || "/";
  },

  redirectToLogin: (nextUrl) => {
    const next = nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : "";
    window.location.href = `/login${next}`;
  },
};

// ─── Integrations ─────────────────────────────────────────────────────────────

const integrations = {
  Core: {
    InvokeLLM: (params) => request("POST", "/integrations/llm", params),
    SendEmail: (params) => request("POST", "/integrations/email", params),
    UploadFile: async ({ file }) => {
      const token = getToken();
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/integrations/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    GenerateImage: (params) => request("POST", "/integrations/generate-image", params),
    GenerateSpeech: (params) => request("POST", "/integrations/generate-speech", params),
  },
};

// ─── Backend Functions ────────────────────────────────────────────────────────

const functions = {
  invoke: (name, payload = {}) => request("POST", `/functions/${name}`, payload),
};

// ─── Users ────────────────────────────────────────────────────────────────────

const users = {
  inviteUser: (email, role) => request("POST", "/users/invite", { email, role }),
};

// ─── Analytics ───────────────────────────────────────────────────────────────

const analytics = {
  track: ({ eventName, properties }) => {
    // Wire up Plausible, PostHog, etc. here if desired
    console.debug("[analytics]", eventName, properties);
  },
};

// ─── Entity proxy ─────────────────────────────────────────────────────────────

const entities = new Proxy({}, {
  get(_, entityName) { return makeEntityClient(entityName); },
});

// ─── Export ───────────────────────────────────────────────────────────────────

export const base44 = { auth, entities, integrations, functions, users, analytics };
export default base44;