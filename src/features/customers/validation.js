import {

    required,

    minLength,

    maxLength,

    email,

    safeText,

    validate

} from "../../core/validators.js";

/**
 * Customer Validation Rules
 */
const rules = {

    name: [

        value =>

            required(value) ||

            "Customer name is required.",

        value =>

            minLength(value, 3) ||

            "Customer name must be at least 3 characters.",

        value =>

            maxLength(value, 50) ||

            "Customer name cannot exceed 50 characters.",

        value =>

            safeText(value) ||

            "Customer name contains invalid characters."

    ],

    email: [

        value =>

            !value ||

            email(value) ||

            "Please enter a valid email address."

    ]

};

/**
 * Validate Customer
 */
export function validateCustomer(customer) {

    return validate(

        customer,

        rules

    );

}