/**
 * Race Guard
 *
 * Ensures that only the latest request
 * is allowed to update the UI.
 */

export class RaceGuard {

    constructor() {

        this.requestId = 0;

    }

    /**
     * Generate a new request ID
     */
    next() {

        this.requestId++;

        return this.requestId;

    }

    /**
     * Check if response belongs
     * to the latest request.
     */
    isLatest(id) {

        return id === this.requestId;

    }

    /**
     * Execute latest request only.
     */
    async run(task) {

        const id = this.next();

        const result = await task();

        if (!this.isLatest(id)) {

            return null;

        }

        return result;

    }

}

/**
 * Global Instance
 */
export const raceGuard = new RaceGuard();