import { renderSidebar } from "./sidebar.js";
import { renderNavbar } from "./navbar.js";

export function renderLayout(page, pathname) {

    const isLoginPage = pathname === "/login";

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

        } else {

            sidebar.style.display = "";
            renderSidebar();

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Navbar
    |--------------------------------------------------------------------------
    */

    // Always render the navbar
    renderNavbar();

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    const container = document.getElementById("page");

    if (!container) return;

    container.innerHTML = "";

    if (typeof page === "function") {

        page(container);

    }

    if (!isLoginPage) {

        initializeNavigation(pathname);

    }

}

function initializeNavigation(pathname) {

    const currentPage =
        pathname === "/"
            ? "dashboard"
            : pathname.replace("/", "");

    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {

        link.classList.remove("active");

        if (link.dataset.page === currentPage) {

            link.classList.add("active");

        }

    });

}