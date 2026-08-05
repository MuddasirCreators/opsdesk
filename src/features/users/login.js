import Swal from "sweetalert2";
import { login } from "./index.js";
import { navigate } from "../../app.js";

/**
 * ---------------------------------------------------------
 * Render Login Page
 * ---------------------------------------------------------
 */
export function renderLoginPage(container) {
    container.innerHTML = `
        <div class="login-page">
            <div class="login-container">

                <!-- Image Side -->
                <div class="login-image-side">
                    <div class="login-image-content">
                        <h1 class="login-brand">OpsDesk</h1>
                        <p class="login-tagline">
                            Streamline your operations, support tickets, and team collaboration in one powerful console.
                        </p>
                    </div>
                    <div class="login-image-overlay"></div>
                </div>

                <!-- Form Side -->
                <div class="login-form-side">
                    <div class="login-form-wrapper">
                        <div class="login-welcome">
                            <h2>Welcome</h2>
                            <p>Sign in to your OpsDesk account</p>
                        </div>

                        <div class="login-form">
                            <div class="form-group">
                                <label for="username">Username</label>
                                <div class="input-with-icon">
                                    <span class="input-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </span>
                                    <input
                                        id="username"
                                        type="text"
                                        class="form-control"
                                        placeholder="Enter your username"
                                        autocomplete="username"
                                    >
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="password">Password</label>
                                <div class="input-with-icon">
                                    <span class="input-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                    </span>
                                    <input
                                        id="password"
                                        type="password"
                                        class="form-control"
                                        placeholder="Enter your password"
                                        autocomplete="current-password"
                                    >
                                </div>
                            </div>

                            <button id="loginBtn" class="primary-btn login-btn">
                                LOGIN
                            </button>
                        </div>

                        <div class="login-footer">
                            <span>Secure access for authorized personnel only</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    bindEvents(container);
}

/**
 * ---------------------------------------------------------
 * Events
 * ---------------------------------------------------------
 */
function bindEvents(container) {
    const loginButton = container.querySelector("#loginBtn");

    loginButton.addEventListener("click", authenticate);

    container.querySelector("#password").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            authenticate();
        }
    });

    container.querySelector("#username").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            document.getElementById("password").focus();
        }
    });
}

/**
 * ---------------------------------------------------------
 * Authenticate
 * ---------------------------------------------------------
 */
async function authenticate() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
        Swal.fire({
            icon: "warning",
            title: "Missing Information",
            text: "Please enter both username and password.",
            confirmButtonColor: "#2563eb"
        });
        return;
    }

    const success = login(username, password);

    if (!success) {
        Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Invalid username or password.",
            confirmButtonColor: "#dc2626"
        });
        return;
    }

    await Swal.fire({
        icon: "success",
        title: "Welcome",
        text: "Login successful.",
        timer: 1200,
        showConfirmButton: false,
        timerProgressBar: true
    });

    navigate("/dashboard");
}