/**
 * Cancellation Utility
 *
 * Mission 5
 */

class CancellationManager {

    constructor() {

        this.controller = null;

    }

    /**
     * Cancel Current Request
     */
    cancel() {

        if (this.controller) {

            this.controller.abort();

        }

    }

    /**
     * Create New Request Signal
     */
    signal() {

        this.cancel();

        this.controller = new AbortController();

        return this.controller.signal;

    }

    /**
     * Execute Request
     */
    async run(task) {

        const signal = this.signal();

        return task(signal);

    }

}

/**
 * Global Instance
 */
export const cancellation = new CancellationManager();