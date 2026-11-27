export const ROLE_PREFIX = {
  student: "/student",
  advisor: "/advisor",
  administrator: "/admin",
};

export const ROLE_LABEL = {
  student: "Student",
  advisor: "Advisor",
  administrator: "Administrator",
};

// The page a user lands on after login.
export const HOME = {
  student: "advisor",
  advisor: "requests",
  administrator: "matching",
};

export const NAV = {
  student: [
    { path: "profile", label: "Profile", note: "Year, department, GPA and interests (issue #94)." },
    { path: "advisor", label: "My Advisor", note: "Assigned advisor and the reason for the match (issue #95)." },
    { path: "appointments", label: "Appointments", note: "Request and list appointments (issue #95)." },
    { path: "advisor-change", label: "Advisor Change", note: "Reason, explanation and pending request (issue #95)." },
  ],
  advisor: [
    { path: "profile", label: "Profile", note: "Bio, interests, years served, online preference and office hours (issue #96)." },
    { path: "requests", label: "Requests", note: "Approve or reject requests and mark COMPLETED or NO_SHOW (issue #96)." },
    { path: "advisees", label: "Advisees", note: "Students assigned to this advisor (issue #96)." },
  ],
  administrator: [
    { path: "matching", label: "Matching", note: "Students waiting for a match, run now and run history." },
    { path: "advisors", label: "Advisors", note: "Advisor accounts and quota." },
    { path: "change-requests", label: "Change requests", note: "Approve or reject advisor change requests." },
    { path: "interests", label: "Interests", note: "Rename or deactivate interests." },
  ],
};

export function homePathFor(role) {
  return `${ROLE_PREFIX[role]}/${HOME[role]}`;
}