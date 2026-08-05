import { get } from "../../core/store.js";

import {

    required,
    minLength,
    maxLength,
    safeText,
    oneOf,
    validate

} from "../../core/validators.js";

/**
 * ---------------------------------------------------------
 * SQL Injection Pattern
 * ---------------------------------------------------------
 */

function noSqlInjection(value) {

    const sqlPattern =

        /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|UNION|EXEC|EXECUTE)\b|(--|;|'|"|\/\*|\*\/)/i;

    return !sqlPattern.test(

        String(value)

    );

}

/**
 * ---------------------------------------------------------
 * Ticket Validation Rules
 * ---------------------------------------------------------
 */

const rules = {

    title: [

        value =>

            required(value)

                ||

                "Title is required.",

        value =>

            minLength(

                value,

                3

            )

                ||

                "Title must contain at least 3 characters.",

        value =>

            maxLength(

                value,

                100

            )

                ||

                "Title cannot exceed 100 characters.",

        value =>

            safeText(value)

                ||

                "Title contains HTML.",

        value =>

            noSqlInjection(value)

                ||

                "Title contains invalid characters."

    ],

    customer: [

        value =>

            required(value)

                ||

                "Customer is required.",

        value =>

            maxLength(

                value,

                60

            )

                ||

                "Customer name is too long.",

        value =>

            safeText(value)

                ||

                "Customer contains HTML.",

        value =>

            noSqlInjection(value)

                ||

                "Customer contains invalid characters."

    ],

    category: [

        value =>

            required(value)

                ||

                "Category is required.",

        value =>

            maxLength(

                value,

                40

            )

                ||

                "Category is too long.",

        value =>

            safeText(value)

                ||

                "Category contains HTML.",

        value =>

            noSqlInjection(value)

                ||

                "Category contains invalid characters."

    ],

    assignee: [

        value =>

            required(value)

                ||

                "Assignee is required.",

        value =>

            maxLength(

                value,

                60

            )

                ||

                "Assignee name is too long.",

        value =>

            safeText(value)

                ||

                "Assignee contains HTML.",

        value =>

            noSqlInjection(value)

                ||

                "Assignee contains invalid characters."

    ],

    status: [

        value =>

            required(value)

                ||

                "Status is required.",

        value =>

            oneOf(

                value,

                [

                    "Open",

                    "Pending",

                    "Closed"

                ]

            )

                ||

                "Invalid status."

    ],

    priority: [

        value =>

            required(value)

                ||

                "Priority is required.",

        value =>

            oneOf(

                value,

                [

                    "High",

                    "Medium",

                    "Low"

                ]

            )

                ||

                "Invalid priority."

    ]

};

/**
 * ---------------------------------------------------------
 * Validate Ticket
 * ---------------------------------------------------------
 */

export function validateTicket(ticket) {

    return validate(

        ticket,

        rules

    );

}

/**
 * ---------------------------------------------------------
 * Check Duplicate Title
 * ---------------------------------------------------------
 */

export async function isUniqueTitle(title) {

    await delay(300);

    const tickets =

        get("tickets") || [];

    return !tickets.some(ticket =>

        ticket.title

            .trim()

            .toLowerCase()

        ===

        title

            .trim()

            .toLowerCase()

    );

}

/**
 * ---------------------------------------------------------
 * Delay
 * ---------------------------------------------------------
 */

function delay(milliseconds) {

    return new Promise(resolve => {

        setTimeout(

            resolve,

            milliseconds

        );

    });

}