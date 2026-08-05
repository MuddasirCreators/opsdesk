import {

    describe,
    it,
    expect,
    beforeEach

} from "vitest";

import {

    createTicket

} from "../../src/features/tickets/index.js";

import {

    get

} from "../../src/core/store.js";

describe("Ticket Form Integration", () => {

    beforeEach(() => {

        localStorage.clear();

        document.body.innerHTML = "";

    });

    it("should create a new ticket", async () => {

        const ticket = {

            title: "Printer Not Working",

            description: "Printer is offline.",

            customer: "ABC Company",

            priority: "High",

            status: "Open",

            assignee: "John"

        };

        const created = await createTicket(ticket);

        expect(created).toBeTruthy();

        const tickets = get("tickets");

        expect(tickets.length).toBe(1);

        expect(tickets[0].title).toBe(

            "Printer Not Working"

        );

    });

    it("should assign an id", async () => {

        const ticket = {

            title: "Email Issue",

            description: "Cannot send email.",

            customer: "ABC Company",

            priority: "Medium",

            status: "Open"

        };

        const created = await createTicket(ticket);

        expect(created.id).toBeDefined();

    });

    it("should set creation date", async () => {

        const ticket = {

            title: "Network",

            description: "Internet unavailable.",

            customer: "ABC Company",

            priority: "Low",

            status: "Open"

        };

        const created = await createTicket(ticket);

        expect(created.createdAt).toBeDefined();

    });

    it("should store ticket in application store", async () => {

        await createTicket({

            title: "Monitor",

            description: "Blank screen",

            customer: "ABC Company",

            priority: "High",

            status: "Open"

        });

        const tickets = get("tickets");

        expect(

            tickets.length

        ).toBeGreaterThan(0);

    });

    it("should reject invalid ticket", async () => {

        await expect(

            createTicket({

                title: ""

            })

        ).rejects.toThrow();

    });

});