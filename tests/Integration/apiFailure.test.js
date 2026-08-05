import {

    describe,
    it,
    expect,
    beforeEach,
    vi

} from "vitest";

import {

    requestManager

} from "../../src/core/requestManager.js";

import {

    httpClient

} from "../../src/api/httpClient.js";

describe("API Failure Recovery", () => {

    beforeEach(() => {

        vi.restoreAllMocks();

    });

    /*
    |--------------------------------------------------------------------------
    | GET Failure
    |--------------------------------------------------------------------------
    */

    it("should handle GET request failure", async () => {

        vi.spyOn(

            httpClient,

            "get"

        ).mockRejectedValue(

            new Error("Network Error")

        );

        await expect(

            requestManager.enqueue(() =>

                httpClient.get("/tickets")

            )

        ).rejects.toThrow(

            "Network Error"

        );

    });

    /*
    |--------------------------------------------------------------------------
    | POST Failure
    |--------------------------------------------------------------------------
    */

    it("should handle POST request failure", async () => {

        vi.spyOn(

            httpClient,

            "post"

        ).mockRejectedValue(

            new Error("Server Error")

        );

        await expect(

            requestManager.enqueue(() =>

                httpClient.post(

                    "/tickets",

                    {}

                )

            )

        ).rejects.toThrow(

            "Server Error"

        );

    });

    /*
    |--------------------------------------------------------------------------
    | DELETE Failure
    |--------------------------------------------------------------------------
    */

    it("should handle DELETE request failure", async () => {

        vi.spyOn(

            httpClient,

            "delete"

        ).mockRejectedValue(

            new Error("Delete Failed")

        );

        await expect(

            requestManager.enqueue(() =>

                httpClient.delete(

                    "/tickets/1"

                )

            )

        ).rejects.toThrow(

            "Delete Failed"

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Request Queue Continues
    |--------------------------------------------------------------------------
    */

    it("should continue processing after a failed request", async () => {

        vi.spyOn(

            httpClient,

            "get"

        )

        .mockRejectedValueOnce(

            new Error("Failed")

        )

        .mockResolvedValueOnce({

            success: true

        });

        await expect(

            requestManager.enqueue(() =>

                httpClient.get("/tickets")

            )

        ).rejects.toThrow();

        const result = await requestManager.enqueue(() =>

            httpClient.get("/tickets")

        );

        expect(result.success).toBe(true);

    });

    /*
    |--------------------------------------------------------------------------
    | Queue Status
    |--------------------------------------------------------------------------
    */

    it("should keep request manager operational after failure", () => {

        const status = requestManager.status();

        expect(status).toHaveProperty(

            "running"

        );

        expect(status).toHaveProperty(

            "waiting"

        );

        expect(status).toHaveProperty(

            "completed"

        );

        expect(status).toHaveProperty(

            "averageTime"

        );

    });

});