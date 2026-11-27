import { apiRequest } from "./client.js";

export function checkHealth(signal) {
  return apiRequest("/health/", { baseUrl: "/api", signal });
}

// Auth
export function registerStudent(body, signal) {
  return apiRequest("/auth/register", { method: "POST", body, signal });
}

export function verifyEmail(body, signal) {
  return apiRequest("/auth/verify-email", { method: "POST", body, signal });
}

export function resendVerification(body, signal) {
  return apiRequest("/auth/resend-verification", { method: "POST", body, signal });
}

export function login(body, signal) {
  return apiRequest("/auth/login", { method: "POST", body, signal });
}

// Reference
export function listDepartments(signal) {
  return apiRequest("/departments", { signal });
}

export function listInterests(query, signal) {
  return apiRequest("/interests", { query, signal });
}

// Student
export function getMyStudentProfile(signal) {
  return apiRequest("/students/me/profile", { signal });
}

export function saveMyStudentProfile(body, signal) {
  return apiRequest("/students/me/profile", { method: "PUT", body, signal });
}

export function getMyAdvisor(signal) {
  return apiRequest("/students/me/advisor", { signal });
}

export function uploadMyCv(file, signal) {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest("/students/me/cv", { method: "PUT", body: formData, signal });
}

export function downloadMyCv(signal) {
  return apiRequest("/students/me/cv", { signal });
}

export function deleteMyCv(signal) {
  return apiRequest("/students/me/cv", { method: "DELETE", signal });
}

export function downloadStudentCv(studentId, signal) {
  return apiRequest(`/students/${studentId}/cv`, { signal });
}

// Advisor
export function getMyAdvisorProfile(signal) {
  return apiRequest("/advisors/me/profile", { signal });
}

export function saveMyAdvisorProfile(body, signal) {
  return apiRequest("/advisors/me/profile", { method: "PUT", body, signal });
}

export function listMyStudents(signal) {
  return apiRequest("/advisors/me/students", { signal });
}

export function getGoogleCalendarStatus(signal) {
  return apiRequest("/advisors/me/google-calendar", { signal });
}

export function disconnectGoogleCalendar(signal) {
  return apiRequest("/advisors/me/google-calendar", { method: "DELETE", signal });
}

export function startGoogleCalendarConnect(signal) {
  return apiRequest("/advisors/me/google-calendar/connect", { method: "POST", signal });
}

export function completeGoogleCalendarConnect(query, signal) {
  return apiRequest("/advisors/me/google-calendar/callback", { query, signal });
}

export function listMyOfficeHours(signal) {
  return apiRequest("/advisors/me/office-hours", { signal });
}

export function createOfficeHour(body, signal) {
  return apiRequest("/advisors/me/office-hours", { method: "POST", body, signal });
}

export function deleteOfficeHour(officeHourId, signal) {
  return apiRequest(`/advisors/me/office-hours/${officeHourId}`, { method: "DELETE", signal });
}

export function listAvailableSlots(advisorId, query, signal) {
  return apiRequest(`/advisors/${advisorId}/available-slots`, { query, signal });
}

// Appointments
export function listAppointments(query, signal) {
  return apiRequest("/appointments", { query, signal });
}

export function requestAppointment(body, signal) {
  return apiRequest("/appointments", { method: "POST", body, signal });
}

export function getAppointment(appointmentId, signal) {
  return apiRequest(`/appointments/${appointmentId}`, { signal });
}

export function markAppointmentOutcome(appointmentId, status, signal) {
  return apiRequest(`/appointments/${appointmentId}`, {
    method: "PATCH",
    body: { status },
    signal,
  });
}

export function confirmAppointment(appointmentId, meetingLink, signal) {
  return apiRequest(`/appointments/${appointmentId}/confirm`, {
    method: "POST",
    body: meetingLink ? { meetingLink } : undefined,
    signal,
  });
}

export function rejectAppointment(appointmentId, reason, signal) {
  return apiRequest(`/appointments/${appointmentId}/reject`, {
    method: "POST",
    body: { reason },
    signal,
  });
}

export function cancelAppointment(appointmentId, reason, signal) {
  return apiRequest(`/appointments/${appointmentId}/cancel`, {
    method: "POST",
    body: { reason },
    signal,
  });
}

export function downloadAppointmentCalendar(appointmentId, signal) {
  return apiRequest(`/appointments/${appointmentId}/calendar.ics`, { signal });
}

// Change Requests
export function listAdvisorChangeRequests(query, signal) {
  return apiRequest("/advisor-change-requests", { query, signal });
}

export function createAdvisorChangeRequest(body, signal) {
  return apiRequest("/advisor-change-requests", { method: "POST", body, signal });
}

// Admin
export function decideAdvisorChangeRequest(requestId, body, signal) {
  return apiRequest(`/admin/advisor-change-requests/${requestId}/decision`, {
    method: "POST",
    body,
    signal,
  });
}

export function listWaitingStudents(signal) {
  return apiRequest("/admin/students/waiting", { signal });
}

export function listMatchingRuns(query, signal) {
  return apiRequest("/admin/matching-runs", { query, signal });
}

export function runMatchingNow(signal) {
  return apiRequest("/admin/matching-runs", { method: "POST", signal });
}

export function createInterest(name, signal) {
  return apiRequest("/admin/interests", { method: "POST", body: { name }, signal });
}

export function updateInterest(interestId, body, signal) {
  return apiRequest(`/admin/interests/${interestId}`, { method: "PATCH", body, signal });
}

export function listAdvisors(signal) {
  return apiRequest("/admin/advisors", { signal });
}

export function createAdvisorAccount(body, signal) {
  return apiRequest("/admin/advisors", { method: "POST", body, signal });
}

export function updateAdvisorQuota(advisorId, quota, signal) {
  return apiRequest(`/admin/advisors/${advisorId}/quota`, {
    method: "PATCH",
    body: { quota },
    signal,
  });
}