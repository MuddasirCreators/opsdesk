import { loadJobs } from "./index.js";

import {

    nextFrame,

    runIdle

} from "../../utils/performance.js";

/**
 * Jobs Polling
 * Mission 8
 */

let pollingId = null;

/**
 * Start Polling
 */
export function startJobsPolling(interval = 5000) {

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

            nextFrame(async () => {

                try {

                    await loadJobs();

                    console.log(

                        "Jobs Updated"

                    );

                }

                catch (error) {

                    console.error(

                        "Jobs Polling Failed:",

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
export function stopJobsPolling() {

    if (!pollingId) {

        return;

    }

    clearInterval(pollingId);

    pollingId = null;

}

/**
 * Restart Polling
 */
export function restartJobsPolling(interval = 5000) {

    stopJobsPolling();

    startJobsPolling(interval);

}

/**
 * Cleanup
 */
window.addEventListener(

    "beforeunload",

    stopJobsPolling

);