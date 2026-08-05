import { renderLayout } from "./ui/components/layout.js";

import { renderDashboard } from "./features/dashboard/index.js";
import { renderTicketsPage } from "./features/tickets/page.js";
import { renderCustomersPage } from "./features/customers/page.js";
import { renderJobsPage } from "./features/jobs/page.js";
import { renderAuditLogsPage } from "./features/auditLogs/page.js";
import { renderSettingsPage } from "./features/settings/page.js";
import { renderUsersPage } from "./features/users/page.js";
import { renderLoginPage } from "./features/users/login.js";

import {

    isAuthenticated,

    hasPermission

} from "./features/users/index.js";

import {

    registerGlobalErrors

} from "./core/errors.js";

import Swal from "sweetalert2";

import {

    startDashboardPolling,

    stopDashboardPolling

} from "./features/dashboard/polling.js";

import {

    startTicketPolling,

    stopTicketPolling

} from "./features/tickets/polling.js";

import {

    startCustomerPolling,

    stopCustomerPolling

} from "./features/customers/polling.js";

import {

    startJobsPolling,

    stopJobsPolling

} from "./features/jobs/polling.js";

import {

    registerQueueProcessor

} from "./storage/offlineQueue.js";

import {

    httpClient

} from "./api/httpClient.js";

/*
|--------------------------------------------------------------------------
| Offline Queue
|--------------------------------------------------------------------------
*/

registerQueueProcessor(

    async item => {

        switch (item.type) {

            case "CREATE_TICKET":

                await httpClient.post(

                    item.endpoint,

                    item.payload

                );

                break;

            default:

                console.warn(

                    "Unknown Offline Queue Item",

                    item

                );

        }

    }

);

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

const routes = {

    "/login": renderLoginPage,

    "/": renderDashboard,

    "/dashboard": renderDashboard,

    "/tickets": renderTicketsPage,

    "/customers": renderCustomersPage,

    "/jobs": renderJobsPage,

    "/auditLogs": renderAuditLogsPage,

    "/users": renderUsersPage,

    "/settings": renderSettingsPage

};

let currentRoute = "";

/*
|--------------------------------------------------------------------------
| Stop Polling
|--------------------------------------------------------------------------
*/

function stopPolling() {

    stopDashboardPolling();

    stopTicketPolling();

    stopCustomerPolling();

    stopJobsPolling();

}

/*
|--------------------------------------------------------------------------
| Start Polling
|--------------------------------------------------------------------------
*/

function startPolling(pathname) {

    switch (pathname) {

        case "/":

        case "/dashboard":

            startDashboardPolling();

            break;

        case "/tickets":

            startTicketPolling();

            break;

        case "/customers":

            startCustomerPolling();

            break;

        case "/jobs":

            startJobsPolling();

            break;

        default:

            break;

    }

}
/*
|--------------------------------------------------------------------------
| Render Route
|--------------------------------------------------------------------------
*/

function renderRoute(pathname) {

    /*
    |--------------------------------------------------------------------------
    | Login Required
    |--------------------------------------------------------------------------
    */

    if (

        !isAuthenticated() &&

        pathname !== "/login"

    ) {

        pathname = "/login";

    }

    /*
    |--------------------------------------------------------------------------
    | Already Logged In
    |--------------------------------------------------------------------------
    */

    if (

        isAuthenticated() &&

        pathname === "/login"

    ) {

        pathname = "/dashboard";

    }

    /*
    |--------------------------------------------------------------------------
    | Permission Check
    |--------------------------------------------------------------------------
    */

    if (

        pathname !== "/login"

    ) {

        const permission =

            pathname === "/"

                ? "dashboard"

                : pathname.replace("/", "");

        if (

            !hasPermission(permission)

        ) {

            Swal.fire({

                icon: "warning",

                title: "Access Denied",

                html: `

                    <div style="line-height:1.8;">

                        <strong>Sorry!</strong>

                        <br><br>

                        You don't have permission to access this page.

                        <br><br>

                        Please contact your Administrator if you think this is a mistake.

                    </div>

                `,

                confirmButtonText: "OK",

                confirmButtonColor: "#2563eb"

            }).then(() => {

                navigate("/dashboard");

            });

            return;

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Prevent Duplicate Rendering
    |--------------------------------------------------------------------------
    */

    if (

        pathname === currentRoute

    ) {

        return;

    }

    currentRoute = pathname;

    stopPolling();

   const page =
    routes[pathname] ||
    renderDashboard;

renderLayout(page, pathname);

if (pathname !== "/login") {
    bindNavigation();
}

startPolling(pathname);

}

/*
|--------------------------------------------------------------------------
| Navigate
|--------------------------------------------------------------------------
*/

export function navigate(path) {

    history.pushState(

        {},

        "",

        path

    );

    renderRoute(path);

}

/*
|--------------------------------------------------------------------------
| Navigation
|--------------------------------------------------------------------------
*/

function bindNavigation() {

    document

        .querySelectorAll(".nav-link")

        .forEach(link => {

            link.onclick = event => {

                event.preventDefault();

                navigate(

                    `/${link.dataset.page}`

                );

            };

        });

    const viewAll =

        document.getElementById(

            "viewAllTickets"

        );

    if (viewAll) {

        viewAll.onclick = event => {

            event.preventDefault();

            navigate(

                "/tickets"

            );

        };

    }

}

/*
|--------------------------------------------------------------------------
| Browser Navigation
|--------------------------------------------------------------------------
*/

window.addEventListener(

    "popstate",

    () => {

        renderRoute(

            window.location.pathname

        );

    }

);

/*
|--------------------------------------------------------------------------
| Online / Offline
|--------------------------------------------------------------------------
*/

window.addEventListener(

    "online",

    () => {

        console.log(

            "Connection Restored."

        );

    }

);

window.addEventListener(

    "offline",

    () => {

        console.warn(

            "Application Offline."

        );

    }

);

/*
|--------------------------------------------------------------------------
| Cleanup
|--------------------------------------------------------------------------
*/

window.addEventListener(

    "beforeunload",

    () => {

        stopPolling();

    }

);

/*
|--------------------------------------------------------------------------
| Initial Load
|--------------------------------------------------------------------------
*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        registerGlobalErrors();

        const path =

            isAuthenticated()

                ? (

                    window.location.pathname === "/login"

                        ? "/dashboard"

                        : window.location.pathname

                )

                : "/login";

        renderRoute(path);

        console.log(

            "OpsDesk Started"

        );

    }

);