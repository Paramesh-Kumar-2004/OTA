export class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.userMessage = message;

    this.success = false;
    this.erros = errors;

    if (stack) {
      this.stack = stack;
    }
    {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

 