/**
 * ---------------------------------------------------------
 * Check Required
 * ---------------------------------------------------------
 */
export function required(value) {

    if (value === null || value === undefined) {

        return false;

    }

    if (typeof value === "string") {

        return value.trim().length > 0;

    }

    return true;

}

/**
 * ---------------------------------------------------------
 * Minimum Length
 * ---------------------------------------------------------
 */
export function minLength(value, length) {

    if (!required(value)) {

        return false;

    }

    return String(value).trim().length >= length;

}

/**
 * ---------------------------------------------------------
 * Maximum Length
 * ---------------------------------------------------------
 */
export function maxLength(value, length) {

    if (!required(value)) {

        return false;

    }

    return String(value).trim().length <= length;

}

/**
 * ---------------------------------------------------------
 * Email Validation
 * ---------------------------------------------------------
 */
export function email(value) {

    if (!required(value)) {

        return false;

    }

    const pattern =

        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(

        String(value).trim()

    );

}

/**
 * ---------------------------------------------------------
 * Number Validation
 * ---------------------------------------------------------
 */
export function number(value) {

    if (!required(value)) {

        return false;

    }

    return !Number.isNaN(

        Number(value)

    );

}

/**
 * ---------------------------------------------------------
 * Positive Number
 * ---------------------------------------------------------
 */
export function positive(value) {

    return number(value) && Number(value) > 0;

}

/**
 * ---------------------------------------------------------
 * Regular Expression Validation
 * ---------------------------------------------------------
 */
export function pattern(value, regex) {

    if (!required(value)) {

        return false;

    }

    return regex.test(

        String(value)

    );

}

/**
 * ---------------------------------------------------------
 * One Of Validation
 * ---------------------------------------------------------
 */
export function oneOf(value, allowedValues) {

    if (!Array.isArray(allowedValues)) {

        return false;

    }

    return allowedValues.includes(value);

}

/**
 * ---------------------------------------------------------
 * URL Validation
 * ---------------------------------------------------------
 */
export function url(value) {

    if (!required(value)) {

        return false;

    }

    try {

        new URL(

            String(value)

        );

        return true;

    }

    catch {

        return false;

    }

}

/**
 * ---------------------------------------------------------
 * Safe Text (Basic XSS Protection)
 * ---------------------------------------------------------
 */
export function safeText(value) {

    if (!required(value)) {

        return false;

    }

    const pattern =

        /<script|<\/script>|javascript:|on\w+=/i;

    return !pattern.test(

        String(value)

    );

}

/**
 * ---------------------------------------------------------
 * Safe SQL (Basic SQL Injection Detection)
 * ---------------------------------------------------------
 */
export function safeSql(value) {

    if (!required(value)) {

        return false;

    }

    const pattern =

        /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|UNION|EXEC|EXECUTE)\b|(--|;|'|"|\/\*|\*\/)/i;

    return !pattern.test(

        String(value)

    );

}

/**
 * ---------------------------------------------------------
 * Validate Object
 * ---------------------------------------------------------
 */
export function validate(data, rules) {

    const errors = {};

    for (const field in rules) {

        const validators = rules[field];

        const value = data[field];

        for (const validator of validators) {

            const result = validator(value);

            if (result !== true) {

                errors[field] = result;

                break;

            }

        }

    }

    return {

        valid:

            Object.keys(errors).length === 0,

        errors

    };

}