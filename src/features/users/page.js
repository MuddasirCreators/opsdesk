import {

    getUsers,
    currentUser

} from "./index.js";

/**
 * ---------------------------------------------------------
 * Render Users Page
 * ---------------------------------------------------------
 */
export function renderUsersPage(container) {

    const users = getUsers();

    const user = currentUser();

    const isAdmin =

        user?.role === "Administrator";

    container.innerHTML = `

        <section class="page-header">

            <div>

                <h1>

                    Users

                </h1>

                <p>

                    Manage your profile and system users.

                </p>

            </div>

            ${isAdmin ? `

                <button

                    id="newUserBtn"

                    class="primary-btn"

                >

                    + New User

                </button>

            ` : ""}

        </section>

        <!-- ===================================================== -->
        <!-- My Profile -->
        <!-- ===================================================== -->

        <div class="panel">

            <div class="panel-header">

                <h3>

                    My Profile

                </h3>

            </div>

            <table class="table">

                <tbody>

                    <tr>

                        <td width="220">

                            <strong>Full Name</strong>

                        </td>

                        <td>

                            ${user?.fullName || "-"}

                        </td>

                    </tr>

                    <tr>

                        <td>

                            <strong>Username</strong>

                        </td>

                        <td>

                            ${user?.username || "-"}

                        </td>

                    </tr>

                    <tr>

                        <td>

                            <strong>Email</strong>

                        </td>

                        <td>

                            ${user?.email || "-"}

                        </td>

                    </tr>

                    <tr>

                        <td>

                            <strong>Role</strong>

                        </td>

                        <td>

                            <span class="badge">

                                ${user?.role || "-"}

                            </span>

                        </td>

                    </tr>

                    <tr>

                        <td>

                            <strong>Status</strong>

                        </td>

                        <td>

                            <span class="badge ${user?.active ? "success" : "danger"}">

                                ${user?.active ? "Active" : "Disabled"}

                            </span>

                        </td>

                    </tr>

                    <tr>

                        <td>

                            <strong>Last Login</strong>

                        </td>

                        <td>

                            ${user?.lastLogin

                                ? new Date(user.lastLogin).toLocaleString()

                                : "-"}

                        </td>

                    </tr>

                </tbody>

            </table>

            <br>

            <button

                id="changePasswordBtn"

                class="secondary-btn"

            >

                Change Password

            </button>

        </div>

        ${isAdmin ? `

        <br>

        <!-- ===================================================== -->
        <!-- User Management -->
        <!-- ===================================================== -->

        <div class="panel">

            <div class="panel-header">

                <h3>

                    User Management

                </h3>

            </div>

            <table class="table">

                <thead>

                    <tr>

                       

                        <th>Name</th>

                        <th>Username</th>

                        <th>Email</th>

                        <th>Role</th>

                        <th>Status</th>

                        <th>Last Login</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    ${users.length

                        ? users.map(user => `

                            <tr>

                               

                                <td>${user.fullName}</td>

                                <td>${user.username}</td>

                                <td>${user.email}</td>

                                <td>

                                    <span class="badge">

                                        ${user.role}

                                    </span>

                                </td>

                                <td>

                                    <span class="badge ${user.active ? "success" : "danger"}">

                                        ${user.active ? "Active" : "Disabled"}

                                    </span>

                                </td>

                                <td>

                                    ${user.lastLogin

                                        ? new Date(user.lastLogin).toLocaleString()

                                        : "-"}

                                </td>

                                <td>

                                    <button

    class="secondary-btn view-user"

    data-id="${user.id}"

>

    View

</button>

<button

    class="primary-btn edit-user"

    data-id="${user.id}"

>

    Edit

</button>

<button

    class="danger-btn delete-user"

    data-id="${user.id}"

>

    Delete

</button>

                                </td>

                            </tr>

                        `).join("")

                        : `

                            <tr>

                                <td colspan="8">

                                    No users found.

                                </td>

                            </tr>

                        `}

                </tbody>

            </table>

        </div>

        ` : ""}

    `;

    bindEvents(container);

}
/**
 * ---------------------------------------------------------
 * Bind Events
 * ---------------------------------------------------------
 */
function bindEvents(container) {

    /*
    |--------------------------------------------------------------------------
    | Change Password
    |--------------------------------------------------------------------------
    */

    container

        .querySelector("#changePasswordBtn")

        ?.addEventListener(

            "click",

            () => {

                import("./events.js")

                    .then(module =>

                        module.changePassword(container)

                    );

            }

        );

    /*
    |--------------------------------------------------------------------------
    | Administrator Only
    |--------------------------------------------------------------------------
    */

    const addButton =

        container.querySelector("#newUserBtn");

    if (!addButton) {

        return;

    }

    /*
    |--------------------------------------------------------------------------
    | Add User
    |--------------------------------------------------------------------------
    */

    addButton.addEventListener(

        "click",

        () => {

            import("./events.js")

                .then(module =>

                    module.createUser(container)

                );

        }

    );

    /*
    |--------------------------------------------------------------------------
    | View User
    |--------------------------------------------------------------------------
    */

    container

        .querySelectorAll(".view-user")

        .forEach(button => {

            button.addEventListener(

                "click",

                () => {

                    import("./events.js")

                        .then(module =>

                            module.viewUser(

                                Number(

                                    button.dataset.id

                                ),

                                container

                            )

                        );

                }

            );

        });

    /*
    |--------------------------------------------------------------------------
    | Edit User
    |--------------------------------------------------------------------------
    */

    container

        .querySelectorAll(".edit-user")

        .forEach(button => {

            button.addEventListener(

                "click",

                () => {

                    import("./events.js")

                        .then(module =>

                            module.editUser(

                                Number(

                                    button.dataset.id

                                ),

                                container

                            )

                        );

                }

            );

        });

    /*
    |--------------------------------------------------------------------------
    | Delete User
    |--------------------------------------------------------------------------
    */

    container

        .querySelectorAll(".delete-user")

        .forEach(button => {

            button.addEventListener(

                "click",

                () => {

                    import("./events.js")

                        .then(module =>

                            module.deleteUserDialog(

                                Number(

                                    button.dataset.id

                                ),

                                container

                            )

                        );

                }

            );

        });

}