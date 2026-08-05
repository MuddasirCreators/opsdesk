const STORAGE_KEY = "opsdesk.preferences";

const STORAGE_VERSION = 1;

/*
|--------------------------------------------------------------------------
| Default Preferences
|--------------------------------------------------------------------------
*/

const DEFAULT_PREFERENCES = {

    version: STORAGE_VERSION,

    theme: "light",

    accentColor: "#2563eb",

    fontSize: "16px",

    compactMode: false,

    showGrid: true,

    notifications: true,

    sounds: true,

    refreshInterval: 10000,

    language: "en",

    timeFormat: "24"

};

/*
|--------------------------------------------------------------------------
| Get Default Preferences
|--------------------------------------------------------------------------
*/

export function defaultPreferences() {

    return structuredClone(

        DEFAULT_PREFERENCES

    );

}

/*
|--------------------------------------------------------------------------
| Load Preferences
|--------------------------------------------------------------------------
*/

export function getPreferences() {

    try {

        const saved = localStorage.getItem(

            STORAGE_KEY

        );

        if (!saved) {

            return defaultPreferences();

        }

        const preferences = JSON.parse(

            saved

        );

        if (

            preferences.version !== STORAGE_VERSION

        ) {

            return migratePreferences(

                preferences

            );

        }

        return {

            ...defaultPreferences(),

            ...preferences

        };

    }

    catch (error) {

        console.warn(

            "Preferences corrupted. Restoring defaults."

        );

        return defaultPreferences();

    }

}

/*
|--------------------------------------------------------------------------
| Save Preferences
|--------------------------------------------------------------------------
*/

export function savePreferences(preferences) {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify({

            ...preferences,

            version: STORAGE_VERSION

        })

    );

}

/*
|--------------------------------------------------------------------------
| Reset Preferences
|--------------------------------------------------------------------------
*/

export function resetPreferences() {

    const defaults = defaultPreferences();

    savePreferences(

        defaults

    );

    return defaults;

}

/*
|--------------------------------------------------------------------------
| Remove Preferences
|--------------------------------------------------------------------------
*/

export function removePreferences() {

    localStorage.removeItem(

        STORAGE_KEY

    );

}

/*
|--------------------------------------------------------------------------
| Validate Preferences
|--------------------------------------------------------------------------
*/

export function validatePreferences(preferences) {

    const errors = {};

    if (

        !["light", "dark"].includes(

            preferences.theme

        )

    ) {

        errors.theme =

            "Invalid theme.";

    }

    if (

        typeof preferences.notifications !==

        "boolean"

    ) {

        errors.notifications =

            "Notifications must be boolean.";

    }

    if (

        typeof preferences.sounds !==

        "boolean"

    ) {

        errors.sounds =

            "Sounds must be boolean.";

    }

    if (

        Number(preferences.refreshInterval) < 1000

    ) {

        errors.refreshInterval =

            "Refresh interval too low.";

    }

    return {

        valid:

            Object.keys(errors).length === 0,

        errors

    };

}

/*
|--------------------------------------------------------------------------
| Preference Migration
|--------------------------------------------------------------------------
*/

function migratePreferences(oldPreferences) {

    const preferences = {

        ...defaultPreferences(),

        ...oldPreferences,

        version: STORAGE_VERSION

    };

    savePreferences(

        preferences

    );

    return preferences;

}