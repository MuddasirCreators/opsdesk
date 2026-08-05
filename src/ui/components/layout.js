import { renderSidebar } from "./sidebar.js";
import { renderNavbar } from "./navbar.js";

export function renderLayout(page) {

    const isLoginPage =

        window.location.pathname === "/login";

    /*
    |--------------------------------------------------------------------------
    | Sidebar
    |--------------------------------------------------------------------------
    */

    const sidebar = document.getElementById("sidebar");

    if (sidebar) {

        if (isLoginPage) {

            sidebar.innerHTML = "";

            sidebar.style.display = "none";

        }

        else {

            sidebar.style.display = "";

            renderSidebar();

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Navbar
    |--------------------------------------------------------------------------
    */

    renderNavbar();

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    const container = document.getElementById("page");

    if (!container) {

        return;

    }

    container.innerHTML = "";

    if (typeof page === "function") {

        page(container);

    }

    if (!isLoginPage) {

        initializeNavigation();

    }

}

function initializeNavigation() {

    const currentPage =

        window.location.pathname.replace("/", "") ||

        "dashboard";

    const links =

        document.querySelectorAll(".nav-link");

    links.forEach(link => {

        link.classList.remove("active");

        if (

            link.dataset.page === currentPage

        ) {

            link.classList.add("active");

        }

    });

}