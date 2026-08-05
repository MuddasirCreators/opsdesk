/**
 * ---------------------------------------------------------
 * Base Application Error
 * ---------------------------------------------------------
 */
export class AppError extends Error {

    constructor(message = "Application error.") {

        super(message);

        this.name = "AppError";

    }

}

/**
 * ---------------------------------------------------------
 * Validation Error
 * ---------------------------------------------------------
 */
export class ValidationError extends AppError {

    constructor(message) {

        super(message);

        this.name = "ValidationError";

    }

}

/**
 * ---------------------------------------------------------
 * Network Error
 * ---------------------------------------------------------
 */
export class NetworkError extends AppError {

    constructor(message = "Network request failed.") {

        super(message);

        this.name = "NetworkError";

    }

}

/**
 * ---------------------------------------------------------
 * Not Found Error
 * ---------------------------------------------------------
 */
export class NotFoundError extends AppError {

    constructor(message = "Requested resource was not found.") {

        super(message);

        this.name = "NotFoundError";

    }

}

/**
 * ---------------------------------------------------------
 * Duplicate Error
 * ---------------------------------------------------------
 */
export class DuplicateError extends AppError {

    constructor(message = "Duplicate record found.") {

        super(message);

        this.name = "DuplicateError";

    }

}

/**
 * ---------------------------------------------------------
 * Authorization Error
 * ---------------------------------------------------------
 */
export class AuthorizationError extends AppError {

    constructor(message = "You are not authorized.") {

        super(message);

        this.name = "AuthorizationError";

    }

}

/**
 * ---------------------------------------------------------
 * Security Error
 * ---------------------------------------------------------
 */
export class SecurityError extends AppError {

    constructor(message = "Security validation failed.") {

        super(message);

        this.name = "SecurityError";

    }

}

/**
 * ---------------------------------------------------------
 * Log Error
 * ---------------------------------------------------------
 */
export function logError(error, module = "Application") {

    console.group(`[${module}]`);

    console.error(error);

    console.groupEnd();

}

/**
 * ---------------------------------------------------------
 * Handle Error
 * ---------------------------------------------------------
 */
export function handleError(error) {

    logError(error);

    if (error instanceof ValidationError) {

        alert(error.message);

        return;

    }

    if (error instanceof DuplicateError) {

        alert(error.message);

        return;

    }

    if (error instanceof NetworkError) {

        alert(error.message);

        return;

    }

    if (error instanceof NotFoundError) {

        alert(error.message);

        return;

    }

    if (error instanceof AuthorizationError) {

        alert(error.message);

        return;

    }

    if (error instanceof SecurityError) {

        alert(error.message);

        return;

    }

    if (error?.name === "AbortError") {

        alert("Request cancelled.");

        return;

    }

    if (error instanceof Error) {

        alert(error.message);

        return;

    }

    alert("Something went wrong.");

}

/**
 * ---------------------------------------------------------
 * Register Global Errors
 * Mission 9
 * ---------------------------------------------------------
 */
export function registerGlobalErrors() {

    window.addEventListener(

        "error",

        event => {

            const error =

                event.error ||

                new AppError(

                    event.message ||

                    "Unknown JavaScript Error"

                );

            handleError(error);

        }

    );

    window.addEventListener(

        "unhandledrejection",

        event => {

            const error =

                event.reason instanceof Error

                    ? event.reason

                    : new AppError(

                        String(event.reason)

                    );

            handleError(error);

        }

    );

}