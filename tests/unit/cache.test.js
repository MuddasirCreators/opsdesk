import {

    describe,
    it,
    expect,
    beforeEach

} from "vitest";

import {

    setCache,
    getCache,
    hasCache,
    removeCache,
    clearCache,
    cacheSize

} from "../../src/utils/cache.js";

describe("Cache Utility", () => {

    beforeEach(() => {

        clearCache();

    });

    /*
    |--------------------------------------------------------------------------
    | Save & Get Cache
    |--------------------------------------------------------------------------
    */

    it("should save and retrieve cached data", () => {

        const data = {

            id: 1,

            name: "OpsDesk"

        };

        setCache(

            "user",

            data,

            5000

        );

        expect(

            getCache("user")

        ).toEqual(data);

    });

    /*
    |--------------------------------------------------------------------------
    | Missing Cache
    |--------------------------------------------------------------------------
    */

    it("should return null for missing cache", () => {

        expect(

            getCache("missing")

        ).toBeNull();

    });

    /*
    |--------------------------------------------------------------------------
    | Cache Exists
    |--------------------------------------------------------------------------
    */

    it("should detect existing cache", () => {

        setCache(

            "token",

            "abc123",

            5000

        );

        expect(

            hasCache("token")

        ).toBe(true);

    });

    /*
    |--------------------------------------------------------------------------
    | Remove Cache
    |--------------------------------------------------------------------------
    */

    it("should remove cache", () => {

        setCache(

            "temp",

            "value",

            5000

        );

        removeCache("temp");

        expect(

            getCache("temp")

        ).toBeNull();

    });

    /*
    |--------------------------------------------------------------------------
    | Clear Cache
    |--------------------------------------------------------------------------
    */

    it("should clear all cache", () => {

        setCache(

            "one",

            1,

            5000

        );

        setCache(

            "two",

            2,

            5000

        );

        clearCache();

        expect(

            cacheSize()

        ).toBe(0);

    });

    /*
    |--------------------------------------------------------------------------
    | Cache Size
    |--------------------------------------------------------------------------
    */

    it("should report cache size", () => {

        setCache(

            "a",

            1,

            5000

        );

        setCache(

            "b",

            2,

            5000

        );

        expect(

            cacheSize()

        ).toBe(2);

    });

    /*
    |--------------------------------------------------------------------------
    | Cache Expiration
    |--------------------------------------------------------------------------
    */

    it("should expire cache after ttl", async () => {

        setCache(

            "expire",

            "value",

            5

        );

        await new Promise(resolve =>

            setTimeout(resolve, 10)

        );

        expect(

            getCache("expire")

        ).toBeNull();

    });

});