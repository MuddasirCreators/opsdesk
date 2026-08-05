import { get, set } from "../../core/store.js";

import {

    addAuditLog

} from "../auditLogs/index.js";

/*
|--------------------------------------------------------------------------
| Default Administrator
|--------------------------------------------------------------------------
*/

const DEFAULT_ADMIN = {

    id: 1,

    fullName: "Administrator",

    username: "admin",

    password: "admin123",

    email: "admin@opsdesk.local",

    role: "Administrator",

    active: true,

    createdAt: new Date().toISOString(),

    lastLogin: null

};

/*
|--------------------------------------------------------------------------
| Initialize Users
|--------------------------------------------------------------------------
*/

export function initializeUsers() {

    const users = get("users");

    if (

        !Array.isArray(users) ||

        users.length === 0

    ) {

        set(

            "users",

            [

                DEFAULT_ADMIN

            ]

        );

    }

}

/*
|--------------------------------------------------------------------------
| Get Users
|--------------------------------------------------------------------------
*/

export function getUsers() {

    initializeUsers();

    return get("users") || [];

}

/*
|--------------------------------------------------------------------------
| Save Users
|--------------------------------------------------------------------------
*/

export function setUsers(users) {

    set(

        "users",

        users

    );

}

/*
|--------------------------------------------------------------------------
| Find User
|--------------------------------------------------------------------------
*/

export function findUser(id) {

    return getUsers().find(

        user =>

            Number(user.id) ===

            Number(id)

    );

}

/*
|--------------------------------------------------------------------------
| Find Username
|--------------------------------------------------------------------------
*/

export function findByUsername(username) {

    return getUsers().find(

        user =>

            user.username.toLowerCase() ===

            username.toLowerCase()

    );

}

/*
|--------------------------------------------------------------------------
| Add User
|--------------------------------------------------------------------------
*/

export function addUser(user) {

    const users = getUsers();

    users.push({

        ...user,

        id: Date.now(),

        createdAt: new Date().toISOString(),

        lastLogin: null,

        active: true

    });

    setUsers(users);

    addAuditLog({

        user: "System",

        action: "Created User",

        module: "Users",

        details: user.username

    });

}

/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

export function updateUser(updatedUser) {

    const users = getUsers();

    const index = users.findIndex(

        user =>

            Number(user.id) ===

            Number(updatedUser.id)

    );

    if (index === -1) {

        return false;

    }

    users[index] = {

        ...users[index],

        ...updatedUser

    };

    setUsers(users);

    addAuditLog({

        user: "System",

        action: "Updated User",

        module: "Users",

        details: updatedUser.username

    });

    return true;

}

/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

export function deleteUser(id) {

    const users = getUsers();

    const user = users.find(

        user =>

            Number(user.id) ===

            Number(id)

    );

    setUsers(

        users.filter(

            user =>

                Number(user.id) !==

                Number(id)

        )

    );

    addAuditLog({

        user: "System",

        action: "Deleted User",

        module: "Users",

        details: user?.username || id

    });

}

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export function login(

    username,

    password

) {

    const user = getUsers().find(

        user =>

            user.username === username &&

            user.password === password &&

            user.active

    );

    if (!user) {

        return false;

    }

    user.lastLogin =

        new Date().toISOString();

    setUsers(

        getUsers()

    );

    localStorage.setItem(

        "opsdesk-session",

        JSON.stringify(user)

    );

    addAuditLog({

        user: user.username,

        action: "Login",

        module: "Authentication",

        details: `${user.role}`

    });

    return true;

}

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export function logout() {

    const user = currentUser();

    if (user) {

        addAuditLog({

            user: user.username,

            action: "Logout",

            module: "Authentication",

            details: user.role

        });

    }

    localStorage.removeItem(

        "opsdesk-session"

    );

}

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

export function currentUser() {

    return JSON.parse(

        localStorage.getItem(

            "opsdesk-session"

        ) || "null"

    );

}

/*
|--------------------------------------------------------------------------
| Authenticated
|--------------------------------------------------------------------------
*/

export function isAuthenticated() {

    return currentUser() !== null;

}
/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export function changePassword(

    userId,

    currentPassword,

    newPassword

) {

    const users = getUsers();

    const user = users.find(

        user =>

            Number(user.id) ===

            Number(userId)

    );

    if (!user) {

        return {

            success: false,

            message: "User not found."

        };

    }

    if (

        user.password !==

        currentPassword

    ) {

        return {

            success: false,

            message: "Current password is incorrect."

        };

    }

    user.password = newPassword;

    setUsers(users);

    addAuditLog({

        user: user.username,

        action: "Changed Password",

        module: "Users",

        details: "Password updated."

    });

    return {

        success: true

    };

}

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

export function resetPassword(

    id,

    password = "123456"

) {

    const user = findUser(id);

    if (!user) {

        return false;

    }

    user.password = password;

    updateUser(user);

    return true;

}

/*
|--------------------------------------------------------------------------
| Activate User
|--------------------------------------------------------------------------
*/

export function activateUser(id) {

    const user = findUser(id);

    if (!user) {

        return false;

    }

    user.active = true;

    updateUser(user);

    return true;

}

/*
|--------------------------------------------------------------------------
| Disable User
|--------------------------------------------------------------------------
*/

export function disableUser(id) {

    const user = findUser(id);

    if (!user) {

        return false;

    }

    /*
    |--------------------------------------------------------------------------
    | Prevent Admin Disable
    |--------------------------------------------------------------------------
    */

    if (

        user.username === "admin"

    ) {

        return false;

    }

    user.active = false;

    updateUser(user);

    return true;

}

/*
|--------------------------------------------------------------------------
| Is Administrator
|--------------------------------------------------------------------------
*/

export function isAdministrator() {

    return (

        currentUser()?.role ===

        "Administrator"

    );

}

/*
|--------------------------------------------------------------------------
| Has Role
|--------------------------------------------------------------------------
*/

export function hasRole(role) {

    return (

        currentUser()?.role ===

        role

    );

}

/*
|--------------------------------------------------------------------------
| Has Permission
|--------------------------------------------------------------------------
*/

export function hasPermission(permission) {

    const role =

        currentUser()?.role;

    const permissions = {

        Administrator: [

            "dashboard",

            "tickets",

            "customers",

            "jobs",

            "auditLogs",

            "users",

            "settings"

        ],

        "Operations Lead": [

            "dashboard",

            "tickets",

            "customers",

            "jobs",

            "auditLogs",

            "settings"

        ],

        Engineer: [

            "dashboard",

            "jobs",

            "auditLogs"

        ],

        "Support Agent": [

            "dashboard",

            "tickets",

            "customers"

        ]

    };

    return (

        permissions[role] || []

    ).includes(permission);

}

/*
|--------------------------------------------------------------------------
| User Statistics
|--------------------------------------------------------------------------
*/

export function userStatistics() {

    const users = getUsers();

    return {

        total: users.length,

        active:

            users.filter(

                user => user.active

            ).length,

        disabled:

            users.filter(

                user => !user.active

            ).length,

        administrators:

            users.filter(

                user =>

                    user.role ===

                    "Administrator"

            ).length

    };

}