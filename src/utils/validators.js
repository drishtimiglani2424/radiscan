/**
 * Form Validation Utilities
 * Syllabus: Form handling in React, Validation strategies (Lectures 55-60)
 */

/**
 * Validates institutional or academic email address.
 * @param {string} email
 * @returns {string} Error message, or empty string if valid.
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email address is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim().toLowerCase())) {
    return 'Please enter a valid email address (e.g. name@institution.edu).';
  }
  return '';
};

/**
 * Validates password with minimum length requirement.
 * @param {string} password
 * @param {number} minLength Defaults to 8 characters as per requirements.
 * @returns {string} Error message, or empty string if valid.
 */
export const validatePassword = (password, minLength = 8) => {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters.`;
  }
  return '';
};

/**
 * Validates user's full name.
 * @param {string} name
 * @returns {string} Error message, or empty string if valid.
 */
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return 'Full name is required.';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters.';
  }
  return '';
};

/**
 * Validates confirm password matches original password.
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {string} Error message, or empty string if valid.
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return '';
};

/**
 * Helper to validate entire registration form.
 * Register checks: name required, valid email, password of at least 8 characters, confirm password matches.
 */
export const validateRegistration = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password, 8);
  if (passwordError) errors.password = passwordError;

  const confirmError = validateConfirmPassword(password, confirmPassword);
  if (confirmError) errors.confirmPassword = confirmError;

  return errors;
};

/**
 * Helper to validate login credentials.
 */
export const validateLogin = ({ email, password }) => {
  const errors = {};
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password, 6);
  if (passwordError) errors.password = passwordError;

  return errors;
};

// =========================================================================
// CASE FORM VALIDATORS (Syllabus: Form handling in React, Validation strategies)
// Fields: title, region, difficulty, description, findings, and image URL
// =========================================================================

/**
 * Validates clinical case title.
 * @param {string} title
 * @returns {string} Error message or empty string.
 */
export const validateCaseTitle = (title) => {
  if (!title || !title.trim()) {
    return 'Case title is required.';
  }
  if (title.trim().length < 3) {
    return 'Case title must be at least 3 characters.';
  }
  if (title.trim().length > 120) {
    return 'Case title must be 120 characters or fewer.';
  }
  return '';
};

/**
 * Validates anatomical region.
 * @param {string} region
 * @returns {string} Error message or empty string.
 */
export const validateRegion = (region) => {
  if (!region || !region.trim()) {
    return 'Anatomical region is required.';
  }
  return '';
};

/**
 * Validates clinical difficulty rating.
 * @param {string} difficulty
 * @returns {string} Error message or empty string.
 */
export const validateDifficulty = (difficulty) => {
  if (!difficulty || !difficulty.trim()) {
    return 'Difficulty level is required.';
  }
  const validLevels = ['Introductory', 'Intermediate', 'Advanced'];
  if (!validLevels.includes(difficulty.trim())) {
    return 'Please select a valid difficulty (Introductory, Intermediate, Advanced).';
  }
  return '';
};

/**
 * Validates clinical case description.
 * @param {string} description
 * @returns {string} Error message or empty string.
 */
export const validateDescription = (description) => {
  if (!description || !description.trim()) {
    return 'Clinical description is required.';
  }
  if (description.trim().length < 10) {
    return 'Description must be at least 10 characters long.';
  }
  return '';
};

/**
 * Validates radiological findings.
 * @param {string} findings
 * @returns {string} Error message or empty string.
 */
export const validateFindings = (findings) => {
  if (!findings || !findings.trim()) {
    return 'Radiological findings are required.';
  }
  if (findings.trim().length < 5) {
    return 'Findings must be at least 5 characters long.';
  }
  return '';
};

/**
 * Validates image URL format.
 * @param {string} url
 * @returns {string} Error message or empty string.
 */
export const validateImageUrl = (url) => {
  if (!url || !url.trim()) {
    return 'Radiograph image URL is required.';
  }
  const trimmed = url.trim();

  // Allow relative local asset paths or data image URIs
  if (trimmed.startsWith('/') || trimmed.startsWith('data:image/')) {
    return '';
  }

  // Validate absolute URL structure
  try {
    const parsed = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return 'Image URL must use http:// or https:// protocol.';
    }
  } catch {
    return 'Please enter a valid image web URL (e.g., https://... or /assets/...).';
  }
  return '';
};

/**
 * Validates all fields of a clinical case form.
 * @param {object} caseData - { title, region, difficulty, description, findings, imageUrl }
 * @returns {object} Map of field errors
 */
export const validateCaseForm = ({
  title,
  region,
  difficulty,
  description,
  findings,
  imageUrl,
}) => {
  const errors = {};

  const titleError = validateCaseTitle(title);
  if (titleError) errors.title = titleError;

  const regionError = validateRegion(region);
  if (regionError) errors.region = regionError;

  const difficultyError = validateDifficulty(difficulty);
  if (difficultyError) errors.difficulty = difficultyError;

  const descriptionError = validateDescription(description);
  if (descriptionError) errors.description = descriptionError;

  const findingsError = validateFindings(findings);
  if (findingsError) errors.findings = findingsError;

  const imageUrlError = validateImageUrl(imageUrl);
  if (imageUrlError) errors.imageUrl = imageUrlError;

  return errors;
};

