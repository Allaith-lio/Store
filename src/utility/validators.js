export const validators = {
  // ---------- Accounts ----------
  username: {
    regex: /^[\p{L}][\p{L}\s'-]{1,29}$/u,
    message: "Name must be 2–30 letters (spaces, - and ' allowed).",
  },
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    message: "Enter a valid email like you@example.com.",
  },
  password: {
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/,
    message: "Password needs 8+ characters with upper, lower case and a number.",
  },
  // For Syrian Number
  phone: {
    regex: /^09\d{8}$/,
    message: "Enter a valid Syrian number: 09XXXXXXXX (10 digits).",
  },

  // ---------- Address ----------
  label: {
    regex: /^[\p{L}\p{N}\s'-]{2,20}$/u,
    message: "Label must be 2–20 characters (e.g. Home, Work).",
  },
  fullName: {
    regex: /^[\p{L}][\p{L}\s'-]{1,49}$/u,
    message: "Enter a valid name (2–50 letters).",
  },
  address: {
    regex: /^[\p{L}\p{N}\s,.'/#&،-]{5,100}$/u,
    message: "Enter a valid street address (5–100 characters).",
  },
  city: {
    regex: /^[\p{L}][\p{L}\s.'-]{1,49}$/u,
    message: "Enter a valid city name (letters only).",
  },
  region: {
    regex: /^[\p{L}][\p{L}\s.'-]{1,49}$/u,
    message: "Enter a valid state or region name (letters only).",
  },
  country: {
    regex: /^[\p{L}][\p{L}\s.'-]{1,49}$/u,
    message: "Enter a valid country name (letters only).",
  },
  // ---------- Contact ----------
  subject: {
    regex: /^[\p{L}\p{N}\s.,!?'"():&/-]{3,100}$/u,
    message: "Subject must be 3–100 characters.",
  },
  message: {
    regex: /^[\s\S]{10,1000}$/,
    message: "Message must be between 10 and 1000 characters.",
  },
};

// ----------clean input during writing----------
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function sanitizePhone(value) {
  let digits = String(value ?? "")
    .replace(/[٠-٩]/g, (d) => ARABIC_DIGITS.indexOf(d)) // Arabic Number to English
    .replace(/\D/g, ""); // Remove Everything is not a Number

  if (digits.startsWith("00963")) digits = "0" + digits.slice(5);
  else if (digits.startsWith("963")) digits = "0" + digits.slice(3);

  return digits.slice(0, 10); 
}


export function sanitize(rule, value) {
  return rule === "phone" ? sanitizePhone(value) : value;
}

export function validateField(name, value, { optional = false } = {}) {
  const text = (value ?? "").trim();

  if (!text) return optional ? "" : "This field is required.";

  const rule = validators[name];
  if (!rule) return "";

  return rule.regex.test(text) ? "" : rule.message;
}
// fields = object متل profileFields / addressFields / checkoutFields
export function checkField(fields, name, value) {
  const { rule = name, optional = false } = fields[name];
  return validateField(rule, value, { optional });
}

export function checkForm(fields, values) {
  const errors = {};
  Object.keys(fields).forEach((name) => {
    const error = checkField(fields, name, values[name]);
    if (error) errors[name] = error;
  });
  return errors;
}