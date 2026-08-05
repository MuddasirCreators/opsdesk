import {
    getSettings,
    updateSetting,
    restoreDefaultSettings
} from "./index.js";
import Swal from "sweetalert2";
/**
 * ---------------------------------------------------------
 * Helper: Apply settings live + on refresh
 * ---------------------------------------------------------
 */
function applyAccentColor(color) {
    const root = document.documentElement;
    root.style.setProperty("--primary", color);

    // Create a darker hover version
    const hover = adjustBrightness(color, -20);
    root.style.setProperty("--primary-hover", hover);

    // Soft background version
    root.style.setProperty("--primary-soft", hexToRgba(color, 0.15));
}

function applyFontSize(size) {
    document.documentElement.style.fontSize = size;
    document.body.style.fontSize = size;
}

function adjustBrightness(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * ---------------------------------------------------------
 * Render Settings Page
 * ---------------------------------------------------------
 */
export function renderSettingsPage(container) {
    const settings = getSettings();

    // Apply saved settings on page load / refresh
    applyAccentColor(settings.accentColor || "#2563eb");
    applyFontSize(settings.fontSize || "14px");

    container.innerHTML = `
        <section class="page-header">
            <div>
                <h1>Settings</h1>
                <p>Configure your application preferences and view system information.</p>
            </div>
        </section>

      

        <!-- System Information -->
        <div class="panel">
            <div class="panel-header">
                <h3>System Information</h3>
            </div>
            <div class="table-wrap">
                <table class="table">
                    <tbody>
                        <tr>
                            <th>Application</th>
                            <td>OpsDesk</td>
                        </tr>
                        <tr>
                            <th>Browser Language</th>
                            <td>${navigator.language}</td>
                        </tr>
                        <tr>
                            <th>Platform</th>
                            <td>${navigator.platform}</td>
                        </tr>
                        <tr>
                            <th>Time Zone</th>
                            <td>${Intl.DateTimeFormat().resolvedOptions().timeZone}</td>
                        </tr>
                        <tr>
                            <th>Local Time</th>
                            <td>${new Date().toLocaleString()}</td>
                        </tr>
                        <tr>
                            <th>Screen Resolution</th>
                            <td>${window.screen.width} × ${window.screen.height}</td>
                        </tr>
                        <tr>
                            <th>Viewport Size</th>
                            <td>${window.innerWidth} × ${window.innerHeight}</td>
                        </tr>
                        <tr>
                            <th>Color Depth</th>
                            <td>${window.screen.colorDepth} Bit</td>
                        </tr>
                        <tr>
                            <th>Pixel Ratio</th>
                            <td>${window.devicePixelRatio}</td>
                        </tr>
                        <tr>
                            <th>Online Status</th>
                            <td>${navigator.onLine ? "Online" : "Offline"}</td>
                        </tr>
                        <tr>
                            <th>Cookies Enabled</th>
                            <td>${navigator.cookieEnabled ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                            <th>Current URL</th>
                            <td style="word-break:break-word;">${window.location.href}</td>
                        </tr>
                        <tr>
                            <th>User Agent</th>
                            <td style="word-break:break-word;">${navigator.userAgent}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <br>

    `;

    attachEvents(container);
}

/**
 * ---------------------------------------------------------
 * Attach Events
 * ---------------------------------------------------------
 */
function attachEvents(container) {
    const accentInput = container.querySelector("#accentColorSetting");
    const fontSizeSelect = container.querySelector("#fontSizeSetting");

    // ===== LIVE PREVIEW =====
    accentInput?.addEventListener("input", (e) => {
        applyAccentColor(e.target.value);
    });

    fontSizeSelect?.addEventListener("change", (e) => {
        applyFontSize(e.target.value);
    });

    // ===== SAVE SETTINGS =====
    container.querySelector("#saveSettingsBtn")?.addEventListener("click", () => {
        const accentColor = accentInput.value;
        const fontSize = fontSizeSelect.value;

        updateSetting("accentColor", accentColor);
        updateSetting("fontSize", fontSize);

        // Apply again for safety
        applyAccentColor(accentColor);
        applyFontSize(fontSize);

        Swal.fire({
            icon: "success",
            title: "Settings Saved",
            text: "Your preferences have been updated successfully.",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true
        });
    });

    // ===== RESET SETTINGS =====
    container.querySelector("#resetSettingsBtn")?.addEventListener("click", () => {
        Swal.fire({
            title: "Reset Settings?",
            text: "This will restore all settings to their default values.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, reset them",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                restoreDefaultSettings();
                renderSettingsPage(container);

                Swal.fire({
                    icon: "success",
                    title: "Settings Reset",
                    text: "All settings have been restored to defaults.",
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true
                });
            }
        });
    });
}