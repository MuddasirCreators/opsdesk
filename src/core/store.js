import {

    safeClone,

    secureLog,

    secureError

} from "./security.js";

/**
 * ---------------------------------------------------------
 * Application Store
 * ---------------------------------------------------------
 */

const STORAGE_KEY = "opsdesk-store";

const STORE_VERSION = 1;

/**
 * ---------------------------------------------------------
 * Default State
 * ---------------------------------------------------------
 */

const defaultState = {

    version: STORE_VERSION,

    tickets: [],

    customers: [],

    jobs: [],

    auditLogs: [],

    users: [],
    session: null,

    dashboard: {},

    settings: {

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

    },

    loading: false,

    error: null

};

/**
 * ---------------------------------------------------------
 * Store Instance
 * ---------------------------------------------------------
 */

const store = loadStore();

/**
 * ---------------------------------------------------------
 * Load Store
 * ---------------------------------------------------------
 */

function loadStore() {

    try {

        const saved = localStorage.getItem(

            STORAGE_KEY

        );

        if (!saved) {

            return safeClone(

                defaultState

            );

        }

        const parsed = JSON.parse(

            saved

        );

        /*
        |--------------------------------------------------------------------------
        | Version Check
        |--------------------------------------------------------------------------
        */

        if (

            parsed.version !== STORE_VERSION

        ) {

            secureLog(

                "Store version mismatch. Resetting store."

            );

            return safeClone(

                defaultState

            );

        }

        return {

            ...safeClone(defaultState),

            ...parsed

        };

    }

    catch (error) {

        secureError(error);

        return safeClone(

            defaultState

        );

    }

}

/**
 * ---------------------------------------------------------
 * Save Store
 * ---------------------------------------------------------
 */

function saveStore() {

    try {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(store)

        );

    }

    catch (error) {

        secureError(error);

    }

}

/**
 * ---------------------------------------------------------
 * Get Entire Store
 * ---------------------------------------------------------
 */

export function getState() {

    return safeClone(store);

}

/**
 * ---------------------------------------------------------
 * Get Value
 * ---------------------------------------------------------
 */

export function get(key) {

    if (!(key in store)) {

        return undefined;

    }

    return safeClone(

        store[key]

    );

}

/**
 * ---------------------------------------------------------
 * Set Value
 * ---------------------------------------------------------
 */

export function set(key, value) {

    /*
    |--------------------------------------------------------------------------
    | Prevent Invalid Keys
    |--------------------------------------------------------------------------
    */

    if (!(key in defaultState)) {

        throw new Error(

            `Invalid store key: ${key}`

        );

    }

    store[key] = safeClone(value);

    saveStore();

    /*
    |--------------------------------------------------------------------------
    | Notify Application
    |--------------------------------------------------------------------------
    */

    window.dispatchEvent(

        new CustomEvent(

            "storeUpdated",

            {

                detail: {

                    key,

                    value: safeClone(value)

                }

            }

        )

    );

}

/**
 * ---------------------------------------------------------
 * Update Value
 * ---------------------------------------------------------
 */

export function update(key, callback) {

    if (!(key in defaultState)) {

        throw new Error(

            `Invalid store key: ${key}`

        );

    }

    store[key] = callback(

        safeClone(

            store[key]

        )

    );

    saveStore();

    window.dispatchEvent(

        new CustomEvent(

            "storeUpdated",

            {

                detail: {

                    key,

                    value: safeClone(

                        store[key]

                    )

                }

            }

        )

    );

}

/**
 * ---------------------------------------------------------
 * Reset Store
 * ---------------------------------------------------------
 */

export function reset() {

    Object.assign(

        store,

        safeClone(

            defaultState

        )

    );

    saveStore();

    window.dispatchEvent(

        new Event(

            "storeUpdated"

        )

    );

}

/**
 * ---------------------------------------------------------
 * Storage Synchronization
 * Hero Challenge
 * ---------------------------------------------------------
 */

window.addEventListener(

    "storage",

    event => {

        if (

            event.key !== STORAGE_KEY ||

            !event.newValue

        ) {

            return;

        }

        try {

            const updated = JSON.parse(

                event.newValue

            );

            Object.assign(

                store,

                safeClone(updated)

            );

            window.dispatchEvent(

                new Event(

                    "storeUpdated"

                )

            );

            secureLog(

                "Store synchronized across tabs."

            );

        }

        catch (error) {

            secureError(error);

        }

    }

);