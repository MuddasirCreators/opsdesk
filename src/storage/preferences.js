/**
 * ---------------------------------------------------------
 * Preferences Storage
 * ---------------------------------------------------------
 */

const STORAGE_KEY = "opsdesk_preferences";

/**
 * ---------------------------------------------------------
 * Default Preferences
 * ---------------------------------------------------------
 */

const DEFAULT_PREFERENCES = {

    theme: "light",

    sidebarCollapsed: false,

    pageSize: 10,

    sortBy: "id"

};

/**
 * ---------------------------------------------------------
 * Get All Preferences
 * ---------------------------------------------------------
 */

export function getPreferences() {

    try {

        const data = localStorage.getItem(STORAGE_KEY);

        if (!data) {

            return {

                ...DEFAULT_PREFERENCES

            };

        }

        return {

            ...DEFAULT_PREFERENCES,

            ...JSON.parse(data)

        };

    }

    catch (error) {

        console.error(

            "Unable to read preferences.",

            error

        );

        return {

            ...DEFAULT_PREFERENCES

        };

    }

}

/**
 * ---------------------------------------------------------
 * Save All Preferences
 * ---------------------------------------------------------
 */

export function savePreferences(preferences) {

    try {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(preferences)

        );

    }

    catch (error) {

        console.error(

            "Unable to save preferences.",

            error

        );

    }

}

/**
 * ---------------------------------------------------------
 * Get One Preference
 * ---------------------------------------------------------
 */

export function getPreference(key) {

    const preferences = getPreferences();

    return preferences[key];

}

/**
 * ---------------------------------------------------------
 * Save One Preference
 * ---------------------------------------------------------
 */

export function setPreference(key, value) {

    const preferences = getPreferences();

    preferences[key] = value;

    savePreferences(preferences);

}

/**
 * ---------------------------------------------------------
 * Update Multiple Preferences
 * ---------------------------------------------------------
 */

export function updatePreferences(values) {

    const preferences = {

        ...getPreferences(),

        ...values

    };

    savePreferences(preferences);

}

/**
 * ---------------------------------------------------------
 * Remove One Preference
 * ---------------------------------------------------------
 */

export function removePreference(key) {

    const preferences = getPreferences();

    delete preferences[key];

    savePreferences(preferences);

}

/**
 * ---------------------------------------------------------
 * Reset Preferences
 * ---------------------------------------------------------
 */

export function resetPreferences() {

    savePreferences({

        ...DEFAULT_PREFERENCES

    });

}

/**
 * ---------------------------------------------------------
 * Clear All Preferences
 * ---------------------------------------------------------
 */

export function clearPreferences() {

    localStorage.removeItem(STORAGE_KEY);

}

/**
 * ---------------------------------------------------------
 * Listen For Preference Changes
 * (Cross-Tab Synchronization)
 * ---------------------------------------------------------
 */

export function onPreferenceChange(callback) {

    window.addEventListener(

        "storage",

        event => {

            if (event.key !== STORAGE_KEY) {

                return;

            }

            callback(

                getPreferences()

            );

        }

    );

}

/**
 * ---------------------------------------------------------
 * Check Preference Exists
 * ---------------------------------------------------------
 */

export function hasPreference(key) {

    return Object.prototype.hasOwnProperty.call(

        getPreferences(),

        key

    );

}

/**
 * ---------------------------------------------------------
 * Export Default Preferences
 * ---------------------------------------------------------
 */

export {

    DEFAULT_PREFERENCES

};