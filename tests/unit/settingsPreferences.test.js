import {

    describe,
    it,
    expect,
    beforeEach

} from "vitest";

import {

    defaultPreferences,
    getPreferences,
    savePreferences,
    resetPreferences,
    removePreferences,
    validatePreferences

} from "../../src/features/settings/preferences.js";

describe("Settings Preferences", () => {

    beforeEach(() => {

        localStorage.clear();

    });

    /*
    |--------------------------------------------------------------------------
    | Default Preferences
    |--------------------------------------------------------------------------
    */

    it("should return default preferences", () => {

        const preferences = defaultPreferences();

        expect(preferences.theme).toBe("light");

        expect(preferences.language).toBe("en");

        expect(preferences.timeFormat).toBe("24");

    });

    /*
    |--------------------------------------------------------------------------
    | Save Preferences
    |--------------------------------------------------------------------------
    */

    it("should save preferences", () => {

        const preferences = defaultPreferences();

        preferences.theme = "dark";

        savePreferences(preferences);

        const loaded = getPreferences();

        expect(loaded.theme).toBe("dark");

    });

    /*
    |--------------------------------------------------------------------------
    | Load Default Preferences
    |--------------------------------------------------------------------------
    */

    it("should load default preferences when storage is empty", () => {

        const preferences = getPreferences();

        expect(preferences.theme).toBe("light");

        expect(preferences.notifications).toBe(true);

    });

    /*
    |--------------------------------------------------------------------------
    | Reset Preferences
    |--------------------------------------------------------------------------
    */

    it("should reset preferences", () => {

        const preferences = defaultPreferences();

        preferences.theme = "dark";

        savePreferences(preferences);

        const reset = resetPreferences();

        expect(reset.theme).toBe("light");

    });

    /*
    |--------------------------------------------------------------------------
    | Remove Preferences
    |--------------------------------------------------------------------------
    */

    it("should remove preferences", () => {

        savePreferences(defaultPreferences());

        removePreferences();

        const loaded = getPreferences();

        expect(loaded.theme).toBe("light");

    });

    /*
    |--------------------------------------------------------------------------
    | Theme Validation
    |--------------------------------------------------------------------------
    */

    it("should reject invalid theme", () => {

        const preferences = defaultPreferences();

        preferences.theme = "blue";

        const result = validatePreferences(preferences);

        expect(result.valid).toBe(false);

        expect(result.errors.theme).toBe(

            "Invalid theme."

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Notifications Validation
    |--------------------------------------------------------------------------
    */

    it("should reject invalid notifications value", () => {

        const preferences = defaultPreferences();

        preferences.notifications = "yes";

        const result = validatePreferences(preferences);

        expect(result.valid).toBe(false);

        expect(result.errors.notifications).toBe(

            "Notifications must be boolean."

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Sounds Validation
    |--------------------------------------------------------------------------
    */

    it("should reject invalid sounds value", () => {

        const preferences = defaultPreferences();

        preferences.sounds = "true";

        const result = validatePreferences(preferences);

        expect(result.valid).toBe(false);

        expect(result.errors.sounds).toBe(

            "Sounds must be boolean."

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Refresh Interval Validation
    |--------------------------------------------------------------------------
    */

    it("should reject invalid refresh interval", () => {

        const preferences = defaultPreferences();

        preferences.refreshInterval = 500;

        const result = validatePreferences(preferences);

        expect(result.valid).toBe(false);

        expect(result.errors.refreshInterval).toBe(

            "Refresh interval too low."

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Valid Preferences
    |--------------------------------------------------------------------------
    */

    it("should validate correct preferences", () => {

        const preferences = defaultPreferences();

        const result = validatePreferences(preferences);

        expect(result.valid).toBe(true);

        expect(result.errors).toEqual({});

    });

});