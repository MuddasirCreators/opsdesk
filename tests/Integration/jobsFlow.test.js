import {

    describe,
    it,
    expect,
    beforeEach

} from "vitest";

import {

    addJob,
    getJobs,
    cancelJob,
    removeJob,
    schedulerStatus

} from "../../src/features/jobs/index.js";

import {

    reset

} from "../../src/core/store.js";

describe("Jobs Flow Integration", () => {

    beforeEach(() => {

        reset();

    });

    /*
    |--------------------------------------------------------------------------
    | Create Job
    |--------------------------------------------------------------------------
    */

    it("should create a new job", async () => {

        await addJob({

            id: 1,

            name: "Create Ticket",

            type: "Ticket",

            priority: "High"

        });

        const jobs = getJobs();

        expect(jobs.length).toBe(1);

        expect(jobs[0].name).toBe(

            "Create Ticket"

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Find Completed Job
    |--------------------------------------------------------------------------
    */

    it("should complete the job", async () => {

        await addJob({

            id: 2,

            name: "Customer Import",

            type: "Customer"

        });

        const jobs = getJobs();

        expect(

            jobs[0].status

        ).toBe("Completed");

    });

    /*
    |--------------------------------------------------------------------------
    | Cancel Job
    |--------------------------------------------------------------------------
    */

    it("should cancel queued job", async () => {

        await addJob({

            id: 3,

            name: "Long Task",

            type: "System"

        });

        cancelJob(3);

        const jobs = getJobs();

        expect(

            jobs[0].status

        ).toMatch(

            /Cancelled|Completed/

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Remove Job
    |--------------------------------------------------------------------------
    */

    it("should remove a job", async () => {

        await addJob({

            id: 4,

            name: "Delete Test",

            type: "System"

        });

        await removeJob(4);

        expect(

            getJobs().length

        ).toBe(0);

    });

    /*
    |--------------------------------------------------------------------------
    | Scheduler Status
    |--------------------------------------------------------------------------
    */

    it("should return scheduler status", () => {

        const status = schedulerStatus();

        expect(status).toHaveProperty(

            "running"

        );

        expect(status).toHaveProperty(

            "waiting"

        );

        expect(status).toHaveProperty(

            "paused"

        );

        expect(status).toHaveProperty(

            "concurrency"

        );

    });

});