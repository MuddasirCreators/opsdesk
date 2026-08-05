import { get, set } from "../../core/store.js";

import {
    getPreferences,
    savePreferences,
    resetPreferences,
    validatePreferences
} from "./preferences.js";

import {
    renderSettingsPage
} from "./page.js";

/*
|--------------------------------------------------------------------------
| Load Settings
|--------------------------------------------------------------------------
*/

export function loadSettings() {

    const preferences = getPreferences();

    set("settings", preferences);

    applySettings(preferences);

    return preferences;

}

/*
|--------------------------------------------------------------------------
| Get Settings
|--------------------------------------------------------------------------
*/

export function getSettings() {

    return get("settings") || loadSettings();

}

/*
|--------------------------------------------------------------------------
| Save Settings
|--------------------------------------------------------------------------
*/

export function saveSettings(settings) {

    const validation = validatePreferences(settings);

    if (!validation.valid) {

        console.error(
            "Invalid settings:",
            validation.errors
        );

        return false;

    }

    savePreferences(settings);

    set(
        "settings",
        settings
    );

    applySettings(settings);

    return true;

}

/*
|--------------------------------------------------------------------------
| Update Setting
|--------------------------------------------------------------------------
*/

export function updateSetting(key, value) {

    const settings = {

        ...getSettings(),

        [key]: value

    };

    return saveSettings(settings);

}

/*
|--------------------------------------------------------------------------
| Reset Settings
|--------------------------------------------------------------------------
*/

export function restoreDefaultSettings() {

    const defaults = resetPreferences();

    set(
        "settings",
        defaults
    );

    applySettings(defaults);

    return defaults;

}

/*
|--------------------------------------------------------------------------
| Apply Settings
|--------------------------------------------------------------------------
*/

export function applySettings(settings = getSettings()) {

    /*
    |--------------------------------------------------------------------------
    | Theme
    |--------------------------------------------------------------------------
    */

    document.documentElement.setAttribute(

        "data-theme",

        settings.theme || "light"

    );

    /*
    |--------------------------------------------------------------------------
    | Accent Color
    |--------------------------------------------------------------------------
    */

    document.documentElement.style.setProperty(

        "--accent-color",

        settings.accentColor || "#2563eb"

    );

    /*
    |--------------------------------------------------------------------------
    | Font Size
    |--------------------------------------------------------------------------
    */

    document.documentElement.style.fontSize =

        settings.fontSize || "16px";

    /*
    |--------------------------------------------------------------------------
    | Compact Mode
    |--------------------------------------------------------------------------
    */

    document.body.classList.toggle(

        "compact-mode",

        Boolean(settings.compactMode)

    );

    /*
    |--------------------------------------------------------------------------
    | Grid Lines
    |--------------------------------------------------------------------------
    */

    document.body.classList.toggle(

        "hide-grid",

        !settings.showGrid

    );

}

/*
|--------------------------------------------------------------------------
| Render Settings
|--------------------------------------------------------------------------
*/

export function renderSettings(container) {

    loadSettings();

    renderSettingsPage(container);

}

/*
|--------------------------------------------------------------------------
| Export / Import Helpers
|--------------------------------------------------------------------------
*/

export function exportSettings() {

    return JSON.stringify(

        getSettings(),

        null,

        2

    );

}

export function importSettings(json) {

    try {

        const settings = JSON.parse(json);

        return saveSettings(settings);

    }

    catch (error) {

        console.error(

            "Invalid settings file.",

            error

        );

        return false;

    }

}