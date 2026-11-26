import { getSession } from "../auth/session.js";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

// Errors follow the Error schema of openapi.yaml (code, message, details).
export class ApiError extends Error {
  constructor(status, problem) {
    super(problem?.message || problem?.title || `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = problem?.code ?? null;
    this.details = problem?.details ?? problem?.detail ?? null;
  }
}

function buildUrl(baseUrl, path, query) {
  const url = `${baseUrl}${path}`;
  if (!query) return url;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.append(key, value);
  });
  const text = params.toString();
  return text ? `${url}?${text}` : url;
}

export async function apiRequest(
  path,
  { method = "GET", body, query, signal, baseUrl = API_BASE_URL } = {},
) {
  const headers = { Accept: "application/json" };
  const session = getSession();
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(buildUrl(baseUrl, path, query), {
    method,
    headers,
    signal,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) throw new ApiError(response.status, data);
  if (!isJson) return response.blob();
  return data;
}