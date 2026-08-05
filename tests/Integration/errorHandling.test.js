import {

    describe,
    it,
    expect,
    vi

} from "vitest";

import {

    AppError,
    ValidationError,
    NetworkError,
    NotFoundError,
    DuplicateError,
    AuthorizationError,
    SecurityError,
    handleError

} from "../../src/core/errors.js";

describe("Error Handling", () => {

    beforeEach(() => {

        vi.spyOn(

            window,

            "alert"

        ).mockImplementation(() => {});

    });

    afterEach(() => {

        vi.restoreAllMocks();

    });

    /*
    |--------------------------------------------------------------------------
    | Validation Error
    |--------------------------------------------------------------------------
    */

    it("should handle ValidationError", () => {

        const error = new ValidationError(

            "Validation failed."

        );

        expect(() =>

            handleError(error)

        ).not.toThrow();

    });

    /*
    |--------------------------------------------------------------------------
    | Network Error
    |--------------------------------------------------------------------------
    */

    it("should handle NetworkError", () => {

        const error = new NetworkError();

        expect(() =>

            handleError(error)

        ).not.toThrow();

    });

    /*
    |--------------------------------------------------------------------------
    | Not Found Error
    |--------------------------------------------------------------------------
    */

    it("should handle NotFoundError", () => {

        const error = new NotFoundError();

        expect(() =>

            handleError(error)

        ).not.toThrow();

    });

    /*
    |--------------------------------------------------------------------------
    | Duplicate Error
    |--------------------------------------------------------------------------
    */

    it("should handle DuplicateError", () => {

        const error = new DuplicateError();

        expect(() =>

            handleError(error)

        ).not.toThrow();

    });

    /*
    |--------------------------------------------------------------------------
    | Authorization Error
    |--------------------------------------------------------------------------
    */

    it("should handle AuthorizationError", () => {

        const error = new AuthorizationError();

        expect(() =>

            handleError(error)

        ).not.toThrow();

    });

    /*
    |--------------------------------------------------------------------------
    | Security Error
    |--------------------------------------------------------------------------
    */

    it("should handle SecurityError", () => {

        const error = new SecurityError();

        expect(() =>

            handleError(error)

        ).not.toThrow();

    });

    /*
    |--------------------------------------------------------------------------
    | Generic Error
    |--------------------------------------------------------------------------
    */

    it("should handle generic Error", () => {

        const error = new Error(

            "Unknown Error"

        );

        expect(() =>

            handleError(error)

        ).not.toThrow();

    });

    /*
    |--------------------------------------------------------------------------
    | App Error
    |--------------------------------------------------------------------------
    */

    it("should handle AppError", () => {

        const error = new AppError(

            "Application Error"

        );

        expect(() =>

            handleError(error)

        ).not.toThrow();

    });

});