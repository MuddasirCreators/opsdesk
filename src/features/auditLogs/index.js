import { get, set } from "../../core/store.js";

import {

    renderAuditLogTable

} from "../../ui/components/auditLogTable.js";

import {

    initializeAuditLogEvents

} from "./events.js";

/**
 * ---------------------------------------------------------
 * Get All Audit Logs
 * ---------------------------------------------------------
 */
export function getAuditLogs() {

    return get("auditLogs") || [];

}

/**
 * ---------------------------------------------------------
 * Set Audit Logs
 * ---------------------------------------------------------
 */
export function setAuditLogs(logs) {

    set(

        "auditLogs",

        logs

    );

}

/**
 * ---------------------------------------------------------
 * Add Audit Log
 * ---------------------------------------------------------
 */
export function addAuditLog(log) {

    const logs = getAuditLogs();

    const now = new Date().toISOString();

    logs.unshift({

        id:

            log.id ??

            Date.now(),

        user:

            log.user ??

            "System",

        action:

            log.action ??

            "Unknown",

        module:

            log.module ??

            "Application",

        details:

            log.details ??

            "",

        /*
        |--------------------------------------------------------------------------
        | Required By Tests
        |--------------------------------------------------------------------------
        */

        timestamp:

            log.timestamp ??

            now,

        /*
        |--------------------------------------------------------------------------
        | Keep Existing Compatibility
        |--------------------------------------------------------------------------
        */

        createdAt:

            log.createdAt ??

            now

    });

    setAuditLogs(

        logs

    );

    renderAuditLogs();

}

/**
 * ---------------------------------------------------------
 * Find Audit Log
 * ---------------------------------------------------------
 */
export function findAuditLogById(id) {

    return getAuditLogs().find(

        log =>

            Number(log.id) ===

            Number(id)

    );

}

/**
 * ---------------------------------------------------------
 * Remove Audit Log
 * ---------------------------------------------------------
 */
export function removeAuditLog(id) {

    const logs = getAuditLogs().filter(

        log =>

            Number(log.id) !==

            Number(id)

    );

    setAuditLogs(

        logs

    );

    renderAuditLogs();

}

/**
 * ---------------------------------------------------------
 * Clear Audit Logs
 * ---------------------------------------------------------
 */
export function clearAuditLogs() {

    setAuditLogs([]);

    renderAuditLogs();

}

/**
 * ---------------------------------------------------------
 * Render Audit Logs
 * ---------------------------------------------------------
 */
export function renderAuditLogs() {

    const container = document.getElementById(

        "auditLogsContainer"

    );

    if (!container) {

        return;

    }

    const logs = getAuditLogs();

    container.innerHTML = renderAuditLogTable(

        logs

    );

    initializeAuditLogEvents();

}