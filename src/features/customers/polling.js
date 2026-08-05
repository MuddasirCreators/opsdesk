import { renderCustomers } from "./index.js";

/**
 * ---------------------------------------------------------
 * Customer Polling
 * ---------------------------------------------------------
 */

let pollingId = null;

/**
 * ---------------------------------------------------------
 * Start Polling
 * ---------------------------------------------------------
 */
export function startCustomerPolling(interval = 15000) {

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

            renderCustomers();

            console.log(

                "Customers Updated"

            );

        }

        catch (error) {

            console.error(

                "Customer Polling Failed:",

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
export function stopCustomerPolling() {

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
export function restartCustomerPolling(interval = 15000) {

    stopCustomerPolling();

    startCustomerPolling(

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

    stopCustomerPolling

);