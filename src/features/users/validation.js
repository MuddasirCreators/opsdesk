import {

    required,
    minLength,
    maxLength,
    email,
    safeText,
    validate

} from "../../core/validators.js";

/**
 * ---------------------------------------------------------
 * User Roles
 * ---------------------------------------------------------
 */

export const USER_ROLES = [

    "Administrator",

    "Operations Lead",

    "Engineer",

    "Support Agent"

];

/**
 * ---------------------------------------------------------
 * Validation Rules
 * ---------------------------------------------------------
 */

const rules = {

    fullName: [

        value =>

            required(value) ||

            "Full name is required.",

        value =>

            minLength(value, 3) ||

            "Full name must be at least 3 characters.",

        value =>

            maxLength(value, 50) ||

            "Full name cannot exceed 50 characters.",

        value =>

            safeText(value) ||

            "Invalid full name."

    ],

    username: [

        value =>

            required(value) ||

            "Username is required.",

        value =>

            minLength(value, 3) ||

            "Username must be at least 3 characters.",

        value =>

            maxLength(value, 30) ||

            "Username cannot exceed 30 characters.",

        value =>

            /^[a-zA-Z0-9._-]+$/.test(value) ||

            "Username contains invalid characters."

    ],

    password: [

        value =>

            required(value) ||

            "Password is required.",

        value =>

            minLength(value, 6) ||

            "Password must be at least 6 characters."

    ],

    email: [

        value =>

            required(value) ||

            "Email is required.",

        value =>

            email(value) ||

            "Invalid email address."

    ],

    role: [

        value =>

            required(value) ||

            "Role is required.",

        value =>

            USER_ROLES.includes(value) ||

            "Invalid user role."

    ]

};

/**
 * ---------------------------------------------------------
 * Validate User
 * ---------------------------------------------------------
 */

export function validateUser(user) {

    return validate(

        user,

        rules

    );

}