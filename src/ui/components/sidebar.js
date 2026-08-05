import Swal from "sweetalert2";

export function renderSidebar() {

    const sidebar = document.getElementById("sidebar");

    if (!sidebar) {

        return;

    }

    /*
    |--------------------------------------------------------------------------
    | Logged In User
    |--------------------------------------------------------------------------
    */

    const session = JSON.parse(

        localStorage.getItem("opsdesk-session") || "null"

    );

    const userName =

        session?.fullName ||

        "Guest";

    const userRole =

        session?.role ||

        "Offline";

    const initials = userName

        .split(" ")

        .map(word => word.charAt(0))

        .join("")

        .substring(0, 2)

        .toUpperCase();

    /*
    |--------------------------------------------------------------------------
    | Logo
    |--------------------------------------------------------------------------
    */

    const logoSvg = `
        <svg class="logo-mark" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="36" height="36" rx="10" fill="url(#odGrad)"/>
            <path d="M10 18.5L15.5 24L26 12" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
                <linearGradient id="odGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2563eb"/>
                    <stop offset="1" stop-color="#7c3aed"/>
                </linearGradient>
            </defs>
        </svg>
    `;

    /*
    |--------------------------------------------------------------------------
    | Navigation Items
    |--------------------------------------------------------------------------
    */

 const navItems = [
    {
        page: "dashboard",
        label: "Dashboard",
        icon: `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
        `
    },
    {
        page: "tickets",
        label: "Tickets",
        icon: `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 5v2"></path>
                <path d="M15 11v2"></path>
                <path d="M15 17v2"></path>
                <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"></path>
            </svg>
        `
    },
    {
        page: "customers",
        label: "Customers",
        icon: `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
        `
    },
    {
        page: "jobs",
        label: "Jobs",
        icon: `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
        `
    },
    {
        page: "auditLogs",
        label: "Audit Logs",
        icon: `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
        `
    },
    {
        page: "users",
        label: "Users",
        icon: `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        `
    },
    {
        page: "settings",
        label: "Settings",
        icon: `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
        `
    }
];

    const linksHtml = navItems

        .map(

            (item, index) => `

                <button

                    type="button"

                    class="nav-link${index === 0 ? " active" : ""}"

                    data-page="${item.page}"

                >

                    <span class="nav-icon">

                        ${item.icon}

                    </span>

                    <span class="nav-label">

                        ${item.label}

                    </span>

                </button>

            `

        )

        .join("");

    /*
    |--------------------------------------------------------------------------
    | Sidebar HTML
    |--------------------------------------------------------------------------
    */

    sidebar.innerHTML = `

        <div class="logo">

            <div class="logo-image">

                ${logoSvg}

            </div>

            <div class="logo-text">

                <h2>

                    OpsDesk

                </h2>

                <p>

                    API Operations & Support

                </p>

            </div>

        </div>

        <nav class="menu">

            ${linksHtml}

        </nav>

        <div class="sidebar-footer">

            <div class="sidebar-user">

                <div class="sidebar-avatar">

                    ${initials}

                </div>

                <div class="sidebar-user-meta">

                    <div class="sidebar-user-name">

                        ${userName}

                    </div>

                    <div class="sidebar-user-status">

                        ${userRole}

                    </div>

                </div>

            </div>

            <button

                id="logoutBtn"

                class="danger-btn"

                style="width:100%;margin-top:12px;"

            >

                Logout

            </button>

        </div>

    `;

    /*
    |--------------------------------------------------------------------------
    | Active Navigation
    |--------------------------------------------------------------------------
    */

    sidebar

        .querySelectorAll(".nav-link")

        .forEach(btn => {

            btn.addEventListener("click", () => {

                sidebar

                    .querySelectorAll(".nav-link")

                    .forEach(link => {

                        link.classList.remove("active");

                    });

                btn.classList.add("active");

            });

        });

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */

    document

        .getElementById("logoutBtn")

        ?.addEventListener("click", async () => {

            const result = await Swal.fire({

                title: "Logout",

                text: "Are you sure you want to logout?",

                icon: "question",

                showCancelButton: true,

                confirmButtonText: "Logout",

                cancelButtonText: "Cancel",

                confirmButtonColor: "#dc2626",

                cancelButtonColor: "#6b7280"

            });

            if (!result.isConfirmed) {

                return;

            }

            localStorage.removeItem(

                "opsdesk-session"

            );

            await Swal.fire({

                icon: "success",

                title: "Logged Out",

                text: "You have been logged out successfully.",

                timer: 1200,

                showConfirmButton: false

            });

            window.location.href = "/login";

        });

}