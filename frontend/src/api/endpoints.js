import { apiRequest } from "./client.js";

export function checkHealth(signal) {
  return apiRequest("/health/", { baseUrl: "/api", signal });
}

// Add one function per operationId of openapi.yaml, for example:
// export function exampleOperation(id) {
//   return apiRequest(`/examples/${id}`);
// }