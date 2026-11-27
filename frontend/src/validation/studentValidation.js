const STUDENT_EMAIL_REGEX = /^s[0-9]{9}@ankarabilim\.edu\.tr$/;
const ADVISOR_EMAIL_REGEX = /^[a-z]+(\.[a-z]+)+@ankarabilim\.edu\.tr$/;
const BASIC_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MAX_CV_BYTES = 2 * 1024 * 1024; // 2 MB (2,097,152 bytes)
export const MAX_INTERESTS = 5;

export function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  const cleanEmail = normalizeEmail(email);

  if (!cleanEmail) {
    errors.email = "Enter your university e-mail address.";
  } else if (!BASIC_EMAIL_REGEX.test(cleanEmail)) {
    errors.email = "Enter a valid e-mail address.";
  }

  if (!password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export function validateRegisterForm({ fullName, email, password }) {
  const errors = {};
  const cleanName = String(fullName ?? "").trim();
  const cleanEmail = normalizeEmail(email);

  if (!cleanName) {
    errors.fullName = "Enter your full name.";
  } else if (cleanName.length < 2 || cleanName.length > 100) {
    errors.fullName = "Full name must be between 2 and 100 characters.";
  }

  if (!cleanEmail) {
    errors.email = "Enter your student e-mail address.";
  } else if (!BASIC_EMAIL_REGEX.test(cleanEmail)) {
    errors.email = "Enter a valid e-mail address.";
  } else if (!cleanEmail.endsWith("@ankarabilim.edu.tr")) {
    errors.email = "Only @ankarabilim.edu.tr e-mail addresses can register.";
  } else if (ADVISOR_EMAIL_REGEX.test(cleanEmail)) {
    errors.email = "Advisor accounts are created by an administrator.";
  } else if (!STUDENT_EMAIL_REGEX.test(cleanEmail)) {
    errors.email = "A student e-mail must look like s230205030@ankarabilim.edu.tr (s + 9 digits).";
  }

  if (!password) {
    errors.password = "Enter a password.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (password.length > 128) {
    errors.password = "Password must be at most 128 characters.";
  }

  return errors;
}

export function validateStudentProfileForm({ year, departmentId, gpa, interestIds }) {
  const errors = {};
  const parsedYear = Number(year);

  if (!Number.isInteger(parsedYear) || parsedYear < 1 || parsedYear > 4) {
    errors.year = "Select your current year (1–4).";
  }

  if (!departmentId) {
    errors.departmentId = "Select your department.";
  }

  const normalizedGpaText = String(gpa ?? "").trim().replace(",", ".");
  const parsedGpa = Number(normalizedGpaText);
  if (normalizedGpaText === "" || Number.isNaN(parsedGpa) || parsedGpa < 0 || parsedGpa > 4) {
    errors.gpa = "GPA must be between 0.00 and 4.00.";
  } else if (!/^\d+(\.\d{1,2})?$/.test(normalizedGpaText)) {
    errors.gpa = "GPA can have at most 2 decimal places.";
  }

  if (!Array.isArray(interestIds) || interestIds.length < 1) {
    errors.interestIds = "Select at least 1 interest.";
  } else if (interestIds.length > MAX_INTERESTS) {
    errors.interestIds = `You can select at most ${MAX_INTERESTS} interests.`;
  }

  return errors;
}

export function validateCvFile(file) {
  if (!file) return "Choose a PDF file to upload.";
  const isPdfType = file.type === "application/pdf";
  const hasPdfExt = file.name.toLowerCase().endsWith(".pdf");
  if (!isPdfType && !hasPdfExt) {
    return "Only PDF files can be uploaded.";
  }
  if (file.size > MAX_CV_BYTES) {
    return "A CV can be at most 2 MB.";
  }
  return null;
}