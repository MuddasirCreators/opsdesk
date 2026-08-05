import Swal from "sweetalert2";

import {
    getUsers,
    addUser,
    findUser,
    deleteUser,
    updateUser,
    currentUser
} from "./index.js";

import {
    validateUser,
    USER_ROLES
} from "./validation.js";

import {
    renderUsersPage
} from "./page.js";

/**
 * ---------------------------------------------------------
 * Create User
 * ---------------------------------------------------------
 */
export async function createUser(container) {
    const roles = USER_ROLES.map(role => `
        <option value="${role}">${role}</option>
    `).join("");

    const result = await Swal.fire({
        title: "Create User",
        width: 650,
        showCancelButton: true,
        confirmButtonText: "Create",
        html: `
            <input id="fullName" class="swal2-input" placeholder="Full Name">
            <input id="username" class="swal2-input" placeholder="Username">
            <input id="email" class="swal2-input" placeholder="Email">
            <input id="password" class="swal2-input" type="password" placeholder="Password">
            <select id="role" class="swal2-select">${roles}</select>
        `,
        preConfirm: () => ({
            fullName: document.getElementById("fullName").value.trim(),
            username: document.getElementById("username").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value,
            role: document.getElementById("role").value
        })
    });

    if (!result.isConfirmed) return;

    const validation = validateUser(result.value);

    if (!validation.valid) {
        Swal.fire({
            icon: "error",
            title: "Validation Failed",
            text: Object.values(validation.errors)[0]
        });
        return;
    }

    const exists = getUsers().some(
        user => user.username.toLowerCase() === result.value.username.toLowerCase()
    );

    if (exists) {
        Swal.fire({
            icon: "error",
            title: "Duplicate Username",
            text: "Username already exists."
        });
        return;
    }

    addUser(result.value);
    renderUsersPage(container);
}

/**
 * ---------------------------------------------------------
 * View User
 * ---------------------------------------------------------
 */
export function viewUser(id) {
    const user = findUser(id);
    if (!user) return;

    Swal.fire({
        title: user.fullName,
        width: 600,
        html: `
            <div style="text-align:left;line-height:2;">
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Name:</strong> ${user.fullName}</p>
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Role:</strong> ${user.role}</p>
                <p><strong>Status:</strong> ${user.active ? "Active" : "Disabled"}</p>
                <p><strong>Created:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
                <p><strong>Last Login:</strong> ${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "-"}</p>
            </div>
        `,
        confirmButtonText: "Close"
    });
}

/**
 * ---------------------------------------------------------
 * Edit User
 * ---------------------------------------------------------
 */
export async function editUser(id, container) {
    const user = findUser(id);
    if (!user) return;

    const roles = USER_ROLES.map(role => `
        <option value="${role}" ${user.role === role ? "selected" : ""}>${role}</option>
    `).join("");

    const result = await Swal.fire({
        title: "Edit User",
        width: 650,
        showCancelButton: true,
        confirmButtonText: "Save",
        html: `
            <input id="fullName" class="swal2-input" value="${user.fullName}">
            <input id="username" class="swal2-input" value="${user.username}">
            <input id="email" class="swal2-input" value="${user.email}">
            <select id="role" class="swal2-select">${roles}</select>
        `,
        preConfirm: () => ({
            ...user,
            fullName: document.getElementById("fullName").value.trim(),
            username: document.getElementById("username").value.trim(),
            email: document.getElementById("email").value.trim(),
            role: document.getElementById("role").value
        })
    });

    if (!result.isConfirmed) return;

    const validation = validateUser({
        ...result.value,
        password: user.password
    });

    if (!validation.valid) {
        Swal.fire({
            icon: "error",
            title: "Validation Failed",
            text: Object.values(validation.errors)[0]
        });
        return;
    }

    updateUser(result.value);
    renderUsersPage(container);
}

/**
 * ---------------------------------------------------------
 * Delete User Dialog
 * ---------------------------------------------------------
 */
export async function deleteUserDialog(id, container) {
    const user = findUser(id);

    if (!user) {
        Swal.fire({
            icon: "error",
            title: "Not Found",
            text: "User not found."
        });
        return;
    }

    // Prevent deleting yourself
    const me = currentUser();
    if (me && Number(me.id) === Number(id)) {
        Swal.fire({
            icon: "warning",
            title: "Not Allowed",
            text: "You cannot delete your own account."
        });
        return;
    }

    const result = await Swal.fire({
        title: "Delete User?",
        html: `Are you sure you want to delete <strong>${user.fullName}</strong>?<br>This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        confirmButtonColor: "#dc2626",
        cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) return;

    deleteUser(id);

    await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: `User "${user.fullName}" has been deleted.`,
        timer: 1800,
        showConfirmButton: false
    });

    renderUsersPage(container);
}

/**
 * ---------------------------------------------------------
 * Change Password
 * ---------------------------------------------------------
 */
export async function changePassword(container) {
    const user = currentUser();

    if (!user) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No user is currently logged in."
        });
        return;
    }

    const result = await Swal.fire({
        title: "Change Password",
        width: 500,
        showCancelButton: true,
        confirmButtonText: "Update Password",
        confirmButtonColor: "#2563eb",
        html: `
            <input id="currentPassword" class="swal2-input" type="password" placeholder="Current Password">
            <input id="newPassword" class="swal2-input" type="password" placeholder="New Password">
            <input id="confirmPassword" class="swal2-input" type="password" placeholder="Confirm New Password">
        `,
        preConfirm: () => {
            const currentPassword = document.getElementById("currentPassword").value;
            const newPassword = document.getElementById("newPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (!currentPassword || !newPassword || !confirmPassword) {
                Swal.showValidationMessage("All fields are required.");
                return false;
            }

            if (newPassword.length < 4) {
                Swal.showValidationMessage("New password must be at least 4 characters.");
                return false;
            }

            if (newPassword !== confirmPassword) {
                Swal.showValidationMessage("New passwords do not match.");
                return false;
            }

            // Simple check against current password (adjust if you store hashed passwords)
            if (user.password && currentPassword !== user.password) {
                Swal.showValidationMessage("Current password is incorrect.");
                return false;
            }

            return { newPassword };
        }
    });

    if (!result.isConfirmed) return;

    // Update password
    updateUser({
        ...user,
        password: result.value.newPassword
    });

    await Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been changed successfully.",
        timer: 2000,
        showConfirmButton: false
    });

    // Optional: re-render page
    if (container) {
        renderUsersPage(container);
    }
}