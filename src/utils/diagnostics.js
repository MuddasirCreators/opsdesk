// src/utils/diagnostics.js

/**
 * Returns runtime diagnostics information.
 */
export function getRuntimeDiagnostics() {

    const diagnostics = {

        browser: navigator.userAgent,

        url: window.location.href,

        language: navigator.language,

        online: navigator.onLine,

        cookiesEnabled: navigator.cookieEnabled,

        localStorageSupported: typeof window.localStorage !== "undefined",

        sessionStorageSupported: typeof window.sessionStorage !== "undefined",

        screenResolution: `${window.screen.width} × ${window.screen.height}`

    };

    return Object.freeze(diagnostics);
}

/**
 * Returns diagnostics as JSON.
 */
export function getRuntimeDiagnosticsJSON() {

    return JSON.stringify(getRuntimeDiagnostics(), null, 4);

}