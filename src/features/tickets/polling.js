import { renderTickets } from "./index.js";

import {

    nextFrame,

    runIdle

} from "../../utils/performance.js";

/**
 * Ticket Polling
 * Mission 8
 */

let pollingId = null;

/**
 * Start Polling
 */
export function startTicketPolling(interval = 15000) {

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

        runIdle(() => {

            nextFrame(() => {

                try {

                    renderTickets();

                    console.log(

                        "Tickets Updated"

                    );

                }

                catch (error) {

                    console.error(

                        "Ticket Polling Failed:",

                        error

                    );

                }

            });

        });

    }, interval);

}

/**
 * Stop Polling
 */
export function stopTicketPolling() {

    if (!pollingId) {

        return;

    }

    clearInterval(pollingId);

    pollingId = null;

}

/**
 * Restart Polling
 */
export function restartTicketPolling(interval = 15000) {

    stopTicketPolling();

    startTicketPolling(interval);

}

/**
 * Cleanup
 */
window.addEventListener(

    "beforeunload",

    stopTicketPolling

);