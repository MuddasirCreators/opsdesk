import {

    describe,
    it,
    expect,
    beforeEach

} from "vitest";

import {

    requestManager

} from "../../src/core/requestManager.js";

describe("Request Manager", () => {

    beforeEach(() => {

        requestManager.clearQueue();

    });

    /*
    |--------------------------------------------------------------------------
    | Queue Request
    |--------------------------------------------------------------------------
    */

    it("should execute queued request", async () => {

        const result = await requestManager.enqueue(

            async () => "Success"

        );

        expect(result).toBe(

            "Success"

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Invalid Task
    |--------------------------------------------------------------------------
    */

    it("should reject invalid task", async () => {

        await expect(

            requestManager.enqueue(null)

        ).rejects.toThrow(

            "Task must be a function."

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Multiple Requests
    |--------------------------------------------------------------------------
    */

    it("should execute multiple requests", async () => {

        const requests = [

            requestManager.enqueue(

                async () => 1

            ),

            requestManager.enqueue(

                async () => 2

            ),

            requestManager.enqueue(

                async () => 3

            )

        ];

        const result = await Promise.all(

            requests

        );

        expect(result).toEqual([

            1,

            2,

            3

        ]);

    });

    /*
    |--------------------------------------------------------------------------
    | Promise.all()
    |--------------------------------------------------------------------------
    */

    it("should resolve all()", async () => {

        const result = await requestManager.all([

            Promise.resolve(1),

            Promise.resolve(2)

        ]);

        expect(result).toEqual([

            1,

            2

        ]);

    });

    /*
    |--------------------------------------------------------------------------
    | Promise.allSettled()
    |--------------------------------------------------------------------------
    */

    it("should resolve allSettled()", async () => {

        const result = await requestManager.allSettled([

            Promise.resolve("OK"),

            Promise.reject("Error")

        ]);

        expect(

            result

        ).toHaveLength(2);

        expect(

            result[0].status

        ).toBe("fulfilled");

        expect(

            result[1].status

        ).toBe("rejected");

    });

    /*
    |--------------------------------------------------------------------------
    | Queue Size
    |--------------------------------------------------------------------------
    */

    it("should report queue size", () => {

        expect(

            requestManager.size()

        ).toBeGreaterThanOrEqual(0);

    });

    /*
    |--------------------------------------------------------------------------
    | Active Requests
    |--------------------------------------------------------------------------
    */

    it("should report active requests", () => {

        expect(

            requestManager.active()

        ).toBeGreaterThanOrEqual(0);

    });

    /*
    |--------------------------------------------------------------------------
    | Status Object
    |--------------------------------------------------------------------------
    */

    it("should return status", () => {

        const status =

            requestManager.status();

        expect(status).toHaveProperty(

            "running"

        );

        expect(status).toHaveProperty(

            "waiting"

        );

        expect(status).toHaveProperty(

            "concurrency"

        );

        expect(status).toHaveProperty(

            "completed"

        );

        expect(status).toHaveProperty(

            "averageTime"

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Clear Queue
    |--------------------------------------------------------------------------
    */

    it("should clear waiting queue", () => {

        requestManager.clearQueue();

        expect(

            requestManager.size()

        ).toBe(0);

    });

});