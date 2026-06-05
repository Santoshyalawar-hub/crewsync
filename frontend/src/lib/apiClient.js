// ─────────────────────────────────────────────────────────────────────────────
//  src/lib/apiClient.js
//  Centralised HTTP client for SamayaHR
//
//  Usage anywhere in the app:
//    import api, { API_BASE_URL } from "@/lib/apiClient";
//    const res = await api.get("/api/users/tenant");
//    const res = await api.post("/api/leaves/apply", payload);
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";

/* ── 1. Resolve base URL ─────────────────────────────────────────────────── */
const getApiBaseUrl = () => {
  const envUrl = import.meta.env?.VITE_API_BASE_URL?.trim();
  if (envUrl) return envUrl;

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8080";
    }
    return `http://${host}:8080`;
  }
  return "";
};

export const API_BASE_URL = getApiBaseUrl();

/* ── 2. Auth & tenant helpers ────────────────────────────────────────────── */
export function getAuthToken() {
  const t = (localStorage.getItem("token") || sessionStorage.getItem("token") || "").trim();
  if (!t) return null;
  return /^Bearer\s+/i.test(t) ? t : `Bearer ${t}`;
}

export function getTenantCode() {
  return localStorage.getItem("tenantCode") || "";
}

export function getCompanyId() {
  return localStorage.getItem("companyId") || "";
}

export function getUserId() {
  return localStorage.getItem("userId") || "";
}

export function getRole() {
  return (localStorage.getItem("role") || "").toUpperCase().trim();
}

/** Build standard auth + tenant headers for fetch() calls */
export function buildHeaders(extra = {}) {
  const token     = getAuthToken();
  const tenant    = getTenantCode();
  const companyId = getCompanyId();
  return {
    "Content-Type": "application/json",
    ...(token     ? { Authorization: token }      : {}),
    ...(tenant    ? { "X-Tenant-Code": tenant }   : {}),
    ...(companyId ? { "X-Company-Id": companyId } : {}),
    ...extra,
  };
}

/** Build multipart auth + tenant headers (no Content-Type — browser sets it) */
export function buildMultipartHeaders(extra = {}) {
  const token     = getAuthToken();
  const tenant    = getTenantCode();
  const companyId = getCompanyId();
  return {
    ...(token     ? { Authorization: token }      : {}),
    ...(tenant    ? { "X-Tenant-Code": tenant }   : {}),
    ...(companyId ? { "X-Company-Id": companyId } : {}),
    ...extra,
  };
}

/* ── 3. Axios instance ───────────────────────────────────────────────────── */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/* ── 4. Request interceptor — inject auth + tenant on every request ─────── */
api.interceptors.request.use(
  (config) => {
    const token     = getAuthToken();
    const tenant    = getTenantCode();
    const companyId = getCompanyId();

    if (token)     config.headers["Authorization"]  = token;
    if (tenant)    config.headers["X-Tenant-Code"]  = tenant;
    if (companyId) config.headers["X-Company-Id"]   = companyId;

    return config;
  },
  (error) => Promise.reject(error)
);

/* ── 5. Response interceptor — handle 401 globally ──────────────────────── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear session and redirect to login
      [
        "token", "role", "userRole", "userId",
        "employeeName", "employeeId",
        "tenantCode", "companyId", "companyName",
      ].forEach((k) => localStorage.removeItem(k));
      sessionStorage.removeItem("currentPage");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/* ── 6. Convenience URL builder ─────────────────────────────────────────── */
/** Safely join base URL with a path segment */
export const apiUrl = (path) =>
  `${(API_BASE_URL || "").replace(/\/+$/, "")}/${(path || "").replace(/^\/+/, "")}`;

/* ── 7. Default export ───────────────────────────────────────────────────── */
export default api;
