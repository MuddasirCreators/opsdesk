import {

    getCache,

    setCache,

    removeCache

} from "../utils/cache.js";

/**
 * ---------------------------------------------------------
 * Simulate Network Delay
 * ---------------------------------------------------------
 */

function delay(milliseconds, signal) {

    /*
    |--------------------------------------------------------------------------
    | Skip Delay During Tests
    |--------------------------------------------------------------------------
    */

    if (

        typeof import.meta !== "undefined" &&

        import.meta.env?.MODE === "test"

    ) {

        return Promise.resolve();

    }

    return new Promise((resolve, reject) => {

        const timer = setTimeout(

            resolve,

            milliseconds

        );

        if (signal) {

            signal.addEventListener(

                "abort",

                () => {

                    clearTimeout(timer);

                    reject(

                        new DOMException(

                            "Request cancelled",

                            "AbortError"

                        )

                    );

                },

                {

                    once: true

                }

            );

        }

    });

}

/**
 * ---------------------------------------------------------
 * Simulate Failure
 * ---------------------------------------------------------
 */

function shouldFail() {

    /*
    |--------------------------------------------------------------------------
    | Never Fail During Unit Tests
    |--------------------------------------------------------------------------
    */

    if (

        typeof import.meta !== "undefined" &&

        import.meta.env?.MODE === "test"

    ) {

        return false;

    }

    /*
    |--------------------------------------------------------------------------
    | Random Failure (20%)
    |--------------------------------------------------------------------------
    */

    return Math.random() < 0.2;

}

/**
 * ---------------------------------------------------------
 * Validate URL
 * ---------------------------------------------------------
 */

function validateUrl(url) {

    if (

        typeof url !== "string" ||

        url.trim() === ""

    ) {

        throw new Error(

            "Invalid request URL."

        );

    }

}

/**
 * ---------------------------------------------------------
 * Create Response
 * ---------------------------------------------------------
 */

function createResponse(

    status,

    url,

    data = null

) {

    return Object.freeze({

        success: true,

        status,

        url,

        data

    });

}

/**
 * ---------------------------------------------------------
 * HTTP Client
 * ---------------------------------------------------------
 */

export const httpClient = {

    /**
     * -----------------------------------------------------
     * GET
     * -----------------------------------------------------
     */

    async get(

        url,

        options = {}

    ) {

        validateUrl(url);

        const cached =

            getCache(url);

        if (cached) {

            return cached;

        }

        const start =

            performance.now();

        const {

            signal

        } = options;

        await delay(

            700,

            signal

        );

        const response =

            createResponse(

                200,

                url,

                []

            );

        setCache(

            url,

            response,

            10000

        );

        console.log(

            `GET ${url} ${(performance.now() - start).toFixed(2)} ms`

        );

        return response;

    },
        /**
     * -----------------------------------------------------
     * POST
     * -----------------------------------------------------
     */

    async post(url, data, options = {}) {

        validateUrl(url);

        if (data === undefined) {

            throw new Error(

                "POST data is required."

            );

        }

        const start = performance.now();

        const {

            signal

        } = options;

        await delay(

            1000,

            signal

        );

        if (shouldFail()) {

            throw new Error(

                "Server rejected the request."

            );

        }

        removeCache(url);

        const response = createResponse(

            201,

            url,

            data

        );

        console.log(

            `POST ${url} ${(performance.now() - start).toFixed(2)} ms`

        );

        return response;

    },

    /**
     * -----------------------------------------------------
     * PUT
     * -----------------------------------------------------
     */

    async put(url, data, options = {}) {

        validateUrl(url);

        if (data === undefined) {

            throw new Error(

                "PUT data is required."

            );

        }

        const start = performance.now();

        const {

            signal

        } = options;

        await delay(

            1000,

            signal

        );

        if (shouldFail()) {

            throw new Error(

                "Unable to update resource."

            );

        }

        removeCache(url);

        const response = createResponse(

            200,

            url,

            data

        );

        console.log(

            `PUT ${url} ${(performance.now() - start).toFixed(2)} ms`

        );

        return response;

    },

    /**
     * -----------------------------------------------------
     * DELETE
     * -----------------------------------------------------
     */

    async delete(url, options = {}) {

        validateUrl(url);

        const start = performance.now();

        const {

            signal

        } = options;

        await delay(

            800,

            signal

        );

        if (shouldFail()) {

            throw new Error(

                "Unable to delete resource."

            );

        }

        removeCache(url);

        const response = createResponse(

            200,

            url

        );

        console.log(

            `DELETE ${url} ${(performance.now() - start).toFixed(2)} ms`

        );

        return response;

    }

};