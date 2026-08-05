import { loadDashboard } from "./index.js";

import {

    nextFrame,

    runIdle

} from "../../utils/performance.js";

/**
 * Dashboard Polling
 * Mission 8
 */

let pollingId = null;

/**
 * Start Polling
 */
export function startDashboardPolling(interval = 10000) {

    if (pollingId) {

        return;

    }

    pollingId = setInterval(() => {

        /*
        |--------------------------------------------------------------------------
        | Only Poll While Dashboard Is Active
        |--------------------------------------------------------------------------
        */

        if (

            window.location.pathname !== "/" &&

            window.location.pathname !== "/dashboard"

        ) {

            return;

        }

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

                    await loadDashboard();

                    console.log(

                        "Dashboard Updated"

                    );

                }

                catch (error) {

                    console.error(

                        "Dashboard Polling Failed:",

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
export function stopDashboardPolling() {

    if (!pollingId) {

        return;

    }

    clearInterval(pollingId);

    pollingId = null;

}

/**
 * Restart Polling
 */
export function restartDashboardPolling(interval = 10000) {

    stopDashboardPolling();

    startDashboardPolling(interval);

}

/**
 * Cleanup
 */
window.addEventListener(

    "beforeunload",

    stopDashboardPolling

);