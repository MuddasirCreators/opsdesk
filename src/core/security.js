/**
 * ---------------------------------------------------------
 * Security Helpers
 * Mission 7
 * ---------------------------------------------------------
 */

/**
 * Escape HTML
 * Prevents XSS attacks when rendering user input.
 */
export function escapeHtml(value) {

    if (value === null || value === undefined) {

        return "";

    }

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#39;")

        .replace(/\//g, "&#47;");

}

/**
 * Safe Text
 * Always returns escaped text.
 */
export function safeText(value) {

    return escapeHtml(value);

}

/**
 * Remove HTML Tags
 */
export function stripHtml(value) {

    if (!value) {

        return "";

    }

    return String(value)

        .replace(/<[^>]*>/g, "")

        .trim();

}

/**
 * Safe URL
 * Only allow http/https URLs.
 */
export function safeUrl(url) {

    if (!url) {

        return "";

    }

    try {

        const parsed = new URL(

            url,

            window.location.origin

        );

        if (

            parsed.protocol === "http:" ||

            parsed.protocol === "https:"

        ) {

            return parsed.href;

        }

    }

    catch {

        return "";

    }

    return "";

}

/**
 * Safe Clone
 * Removes prototype pollution.
 */
export function safeClone(object) {

    if (

        object === null ||

        typeof object !== "object"

    ) {

        return object;

    }

    return JSON.parse(

        JSON.stringify(object)

    );

}

/**
 * Freeze Object
 */
export function freezeObject(object) {

    return Object.freeze(

        safeClone(object)

    );

}

/**
 * Safe Merge
 * Prevents Prototype Pollution.
 */
export function safeMerge(target = {}, source = {}) {

    const result = safeClone(target);

    for (const key of Object.keys(source)) {

        if (

            key === "__proto__" ||

            key === "constructor" ||

            key === "prototype"

        ) {

            continue;

        }

        result[key] = source[key];

    }

    return result;

}

/**
 * Remove Sensitive Information
 */
export function redactSecrets(data) {

    const secretKeys = [

        "password",

        "token",

        "accessToken",

        "refreshToken",

        "secret",

        "authorization",

        "cookie",

        "apiKey"

    ];

    const clone = safeClone(data);

    function walk(object) {

        if (

            !object ||

            typeof object !== "object"

        ) {

            return;

        }

        for (const key in object) {

            if (

                secretKeys.includes(

                    key.toLowerCase()

                )

            ) {

                object[key] = "********";

            }

            else {

                walk(object[key]);

            }

        }

    }

    walk(clone);

    return clone;

}

/**
 * Safe Console Log
 */
export function secureLog(...values) {

    const cleaned = values.map(value =>

        typeof value === "object"

            ? redactSecrets(value)

            : value

    );

    console.log(...cleaned);

}

/**
 * Safe Console Error
 */
export function secureError(...values) {

    const cleaned = values.map(value =>

        typeof value === "object"

            ? redactSecrets(value)

            : value

    );

    console.error(...cleaned);

}

/**
 * Validate Email
 */
export function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        .test(email);

}

/**
 * Validate Integer
 */
export function isPositiveInteger(value) {

    return Number.isInteger(

        Number(value)

    ) && Number(value) >= 0;

}

/**
 * Safe JSON Parse
 */
export function safeJsonParse(text, fallback = null) {

    try {

        return JSON.parse(text);

    }

    catch {

        return fallback;

    }

}

/**
 * Safe JSON Stringify
 */
export function safeJsonStringify(value) {

    try {

        return JSON.stringify(value);

    }

    catch {

        return "{}";

    }

}

/**
 * Create Safe DOM Text Node
 */
export function createSafeText(text) {

    return document.createTextNode(

        String(text)

    );

}

/**
 * Check Trusted Origin
 */
export function isTrustedOrigin(origin) {

    return origin === window.location.origin;

}

/**
 * Generate Secure Random ID
 */
export function generateSecureId() {

    return crypto.randomUUID();

}