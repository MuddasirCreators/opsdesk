import { renderAuditLogs } from "./index.js";

/**
 * ---------------------------------------------------------
 * Audit Logs Polling
 * ---------------------------------------------------------
 */

let pollingId = null;

/**
 * ---------------------------------------------------------
 * Start Polling
 * ---------------------------------------------------------
 */
export function startAuditLogPolling(interval = 15000) {

    if (pollingId) {

        return;

    }

    pollingId = setInterval(() => {

        /*
        |--------------------------------------------------------------------------
        | Skip When Offline
        |--------------------------------------------------------------------------
        */

        if (!navigator.onLine) {

            return;

        }

        /*
        |--------------------------------------------------------------------------
        | Skip When Tab Hidden
        |--------------------------------------------------------------------------
        */

        if (document.hidden) {

            return;

        }

        try {

            renderAuditLogs();

            console.log(

                "Audit Logs Updated"

            );

        }

        catch (error) {

            console.error(

                "Audit Log Polling Failed:",

                error

            );

        }

    }, interval);

}

/**
 * ---------------------------------------------------------
 * Stop Polling
 * ---------------------------------------------------------
 */
export function stopAuditLogPolling() {

    if (!pollingId) {

        return;

    }

    clearInterval(

        pollingId

    );

    pollingId = null;

}

/**
 * ---------------------------------------------------------
 * Restart Polling
 * ---------------------------------------------------------
 */
export function restartAuditLogPolling(interval = 15000) {

    stopAuditLogPolling();

    startAuditLogPolling(

        interval

    );

}

/**
 * ---------------------------------------------------------
 * Cleanup
 * ---------------------------------------------------------
 */
window.addEventListener(

    "beforeunload",

    stopAuditLogPolling

);