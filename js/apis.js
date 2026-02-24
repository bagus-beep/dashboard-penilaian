const API_URL = "https://script.google.com/macros/s/AKfycbz--KXVT14udPAiAHSDJlKXdfWD196WBfI-GOl6M4mXHcI5I7yPDvRka27dILi4GM2T/exec";

const ORIGIN_KEY = "VERCEL_FRONTEND_2026";

let JWT_TOKEN = null;

/* ========================================
   DEVICE ID (persistent binding)
======================================== */

function getDeviceId() {
  let id = localStorage.getItem("device_id");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }

  return id;
}

/* ========================================
   BASE64 URL ENCODE
======================================== */

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/* ========================================
   SHA256 HELPER
======================================== */

async function sha256Base64Url(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(hash);
}

/* ========================================
   SIGNED REQUEST BUILDER
======================================== */

async function buildSecurityParams() {
  const ts = Date.now().toString();
  const deviceId = getDeviceId();

  const raw = ts + deviceId + ORIGIN_KEY;
  const signature = await sha256Base64Url(raw);

  return {
    ts,
    device_id: deviceId,
    origin_key: ORIGIN_KEY,
    signature
  };
}

/* ========================================
   AUTH REQUEST
======================================== */

async function getToken() {

  const security = await buildSecurityParams();

  const q = new URLSearchParams({
    mode: "auth",
    ...security
  });

  const res = await fetch(`${API_URL}?${q}`);
  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error);
  }

  JWT_TOKEN = json.token;
}

/* ========================================
   MAIN API FETCH
======================================== */

async function apiFetch(mode, params = {}) {

  if (!JWT_TOKEN) {
    await getToken();
  }

  const security = await buildSecurityParams();

  const q = new URLSearchParams({
    token: JWT_TOKEN,
    mode,
    ...security,
    ...params
  });

  const res = await fetch(`${API_URL}?${q}`);
  const json = await res.json();

  if (!json.success) {

    // token expired → refresh
    if (json.error?.toLowerCase().includes("expired")) {
      await getToken();
      return apiFetch(mode, params);
    }

    throw new Error(json.error);
  }

  return json.data;
}