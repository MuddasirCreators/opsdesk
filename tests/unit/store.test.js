import {

    describe,
    it,
    expect,
    beforeEach

} from "vitest";

import {

    get,
    set,
    getState,
    update,
    reset

} from "../../src/core/store.js";

describe("Store", () => {

    beforeEach(() => {

        reset();

    });

    it("should return default tickets array", () => {

        expect(get("tickets")).toEqual([]);

    });

    it("should save tickets", () => {

        const tickets = [

            {

                id: 1,

                title: "Test Ticket"

            }

        ];

        set(

            "tickets",

            tickets

        );

        expect(

            get("tickets")

        ).toEqual(

            tickets

        );

    });

    it("should update tickets", () => {

        set(

            "tickets",

            []

        );

        update(

            "tickets",

            tickets => [

                ...tickets,

                {

                    id: 2,

                    title: "Updated Ticket"

                }

            ]

        );

        expect(

            get("tickets")

        ).toHaveLength(1);

    });

    it("should reset store", () => {

        set(

            "tickets",

            [

                {

                    id: 1

                }

            ]

        );

        reset();

        expect(

            get("tickets")

        ).toEqual([]);

    });

    it("should throw on invalid key", () => {

        expect(() =>

            set(

                "invalid",

                []

            )

        ).toThrow();

    });

    it("should return full state", () => {

        const state = getState();

        expect(state).toHaveProperty(

            "tickets"

        );

        expect(state).toHaveProperty(

            "customers"

        );

        expect(state).toHaveProperty(

            "jobs"

        );

        expect(state).toHaveProperty(

            "auditLogs"

        );

    });

});