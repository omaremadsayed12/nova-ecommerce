import AppError from "../utils/AppError.js";

export class ValidationError extends AppError {
  constructor(details = null) {
    super("Invalid input data", 400, "VALIDATION_ERROR", details);
  }
}

export class AuthorizationError extends AppError {
  constructor(details = null) {
    super("Authorization failed", 403, "AUTHORIZATION_FAILED", details);
  }
}

export class AuthenticationError extends AppError {
  constructor(details = null) {
    super("Authentication failed", 401, "AUTHENTICATION_FAILED", details);
  }
}

export class NotFoundError extends AppError {
  constructor(details = null) {
    super("Resource not found", 404, "NOT_FOUND", details);
  }
}