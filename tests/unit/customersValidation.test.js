import {

    describe,
    it,
    expect

} from "vitest";

import {

    validateCustomer

} from "../../src/features/customers/validation.js";

describe("Customer Validation", () => {

    /*
    |--------------------------------------------------------------------------
    | Valid Customer
    |--------------------------------------------------------------------------
    */

    it("should validate a correct customer", () => {

        const result = validateCustomer({

            name: "John Smith",

            email: "john@example.com"

        });

        expect(result.valid).toBe(true);

        expect(result.errors).toEqual({});

    });

    /*
    |--------------------------------------------------------------------------
    | Required Name
    |--------------------------------------------------------------------------
    */

    it("should require customer name", () => {

        const result = validateCustomer({

            name: "",

            email: "john@example.com"

        });

        expect(result.valid).toBe(false);

        expect(result.errors.name).toBe(

            "Customer name is required."

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Minimum Length
    |--------------------------------------------------------------------------
    */

    it("should reject short customer name", () => {

        const result = validateCustomer({

            name: "Jo",

            email: "john@example.com"

        });

        expect(result.valid).toBe(false);

        expect(result.errors.name).toBe(

            "Customer name must be at least 3 characters."

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Maximum Length
    |--------------------------------------------------------------------------
    */

    it("should reject long customer name", () => {

        const result = validateCustomer({

            name: "A".repeat(51),

            email: "john@example.com"

        });

        expect(result.valid).toBe(false);

        expect(result.errors.name).toBe(

            "Customer name cannot exceed 50 characters."

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Invalid Email
    |--------------------------------------------------------------------------
    */

    it("should reject invalid email", () => {

        const result = validateCustomer({

            name: "John Smith",

            email: "invalid-email"

        });

        expect(result.valid).toBe(false);

        expect(result.errors.email).toBe(

            "Please enter a valid email address."

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Empty Email Allowed
    |--------------------------------------------------------------------------
    */

    it("should allow empty email", () => {

        const result = validateCustomer({

            name: "John Smith",

            email: ""

        });

        expect(result.valid).toBe(true);

    });

    /*
    |--------------------------------------------------------------------------
    | Safe Text Validation
    |--------------------------------------------------------------------------
    */

    it("should reject unsafe customer name", () => {

        const result = validateCustomer({

            name: "<script>alert(1)</script>",

            email: "john@example.com"

        });

        expect(result.valid).toBe(false);

        expect(result.errors.name).toBe(

            "Customer name contains invalid characters."

        );

    });

});