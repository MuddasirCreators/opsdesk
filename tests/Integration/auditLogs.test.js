import {

    describe,
    it,
    expect,
    beforeEach

} from "vitest";

import {

    addAuditLog,
    getAuditLogs,
    clearAuditLogs

} from "../../src/features/auditLogs/index.js";

import {

    reset

} from "../../src/core/store.js";

describe("Audit Logs Integration", () => {

    beforeEach(() => {

        reset();

        clearAuditLogs();

    });

    /*
    |--------------------------------------------------------------------------
    | Add Audit Log
    |--------------------------------------------------------------------------
    */

    it("should add a new audit log", () => {

        addAuditLog({

            user: "Admin",

            action: "Created Ticket",

            module: "Tickets",

            details: "Ticket #1 created."

        });

        const logs = getAuditLogs();

        expect(logs.length).toBe(1);

        expect(logs[0].user).toBe("Admin");

        expect(logs[0].module).toBe("Tickets");

    });

    /*
    |--------------------------------------------------------------------------
    | Multiple Logs
    |--------------------------------------------------------------------------
    */

    it("should store multiple logs", () => {

        addAuditLog({

            user: "System",

            action: "Job Started",

            module: "Jobs",

            details: "Job #1"

        });

        addAuditLog({

            user: "System",

            action: "Job Completed",

            module: "Jobs",

            details: "Job #1"

        });

        expect(

            getAuditLogs()

        ).toHaveLength(2);

    });

    /*
    |--------------------------------------------------------------------------
    | Clear Logs
    |--------------------------------------------------------------------------
    */

    it("should clear audit logs", () => {

        addAuditLog({

            user: "Admin",

            action: "Delete",

            module: "Customers",

            details: "Customer removed"

        });

        clearAuditLogs();

        expect(

            getAuditLogs()

        ).toHaveLength(0);

    });

    /*
    |--------------------------------------------------------------------------
    | Auto Timestamp
    |--------------------------------------------------------------------------
    */

    it("should automatically assign timestamp", () => {

        addAuditLog({

            user: "Admin",

            action: "Login",

            module: "System",

            details: "Successful login"

        });

        const log = getAuditLogs()[0];

        expect(log.timestamp).toBeDefined();

    });

    /*
    |--------------------------------------------------------------------------
    | Auto ID
    |--------------------------------------------------------------------------
    */

    it("should automatically assign id", () => {

        addAuditLog({

            user: "Admin",

            action: "Logout",

            module: "System",

            details: "Logout successful"

        });

        const log = getAuditLogs()[0];

        expect(log.id).toBeDefined();

    });

});