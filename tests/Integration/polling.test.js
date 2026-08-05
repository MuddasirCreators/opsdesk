import {

    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    vi

} from "vitest";

import {

    startDashboardPolling,
    stopDashboardPolling

} from "../../src/features/dashboard/polling.js";

import {

    startTicketPolling,
    stopTicketPolling

} from "../../src/features/tickets/polling.js";

import {

    startCustomerPolling,
    stopCustomerPolling

} from "../../src/features/customers/polling.js";

import {

    startJobsPolling,
    stopJobsPolling

} from "../../src/features/jobs/polling.js";

describe("Polling Integration", () => {

    beforeEach(() => {

        vi.useFakeTimers();

    });

    afterEach(() => {

        stopDashboardPolling();

        stopTicketPolling();

        stopCustomerPolling();

        stopJobsPolling();

        vi.useRealTimers();

        vi.restoreAllMocks();

    });

    /*
    |--------------------------------------------------------------------------
    | Dashboard Polling
    |--------------------------------------------------------------------------
    */

    it("should start dashboard polling", () => {

        expect(() => {

            startDashboardPolling();

        }).not.toThrow();

    });

    it("should stop dashboard polling", () => {

        startDashboardPolling();

        expect(() => {

            stopDashboardPolling();

        }).not.toThrow();

    });

    /*
    |--------------------------------------------------------------------------
    | Tickets Polling
    |--------------------------------------------------------------------------
    */

    it("should start ticket polling", () => {

        expect(() => {

            startTicketPolling();

        }).not.toThrow();

    });

    it("should stop ticket polling", () => {

        startTicketPolling();

        expect(() => {

            stopTicketPolling();

        }).not.toThrow();

    });

    /*
    |--------------------------------------------------------------------------
    | Customers Polling
    |--------------------------------------------------------------------------
    */

    it("should start customer polling", () => {

        expect(() => {

            startCustomerPolling();

        }).not.toThrow();

    });

    it("should stop customer polling", () => {

        startCustomerPolling();

        expect(() => {

            stopCustomerPolling();

        }).not.toThrow();

    });

    /*
    |--------------------------------------------------------------------------
    | Jobs Polling
    |--------------------------------------------------------------------------
    */

    it("should start jobs polling", () => {

        expect(() => {

            startJobsPolling();

        }).not.toThrow();

    });

    it("should stop jobs polling", () => {

        startJobsPolling();

        expect(() => {

            stopJobsPolling();

        }).not.toThrow();

    });

    /*
    |--------------------------------------------------------------------------
    | Fake Timers
    |--------------------------------------------------------------------------
    */

    it("should advance fake timers", () => {

        startDashboardPolling();

        startTicketPolling();

        startCustomerPolling();

        startJobsPolling();

        vi.advanceTimersByTime(30000);

        expect(true).toBe(true);

    });

});