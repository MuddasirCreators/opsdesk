/**
 * Request Manager
 *
 * Mission 5 + Mission 7 + Mission 8
 */

class RequestManager {

    constructor(maxConcurrent = 3) {

        this.maxConcurrent = maxConcurrent;

        this.running = 0;

        this.queue = [];

        /*
        |--------------------------------------------------------------------------
        | Mission 8
        |--------------------------------------------------------------------------
        */

        this.totalRequests = 0;

        this.totalTime = 0;

    }

    /**
     * Add Request to Queue
     */
    enqueue(task) {

        if (typeof task !== "function") {

            return Promise.reject(

                new Error(

                    "Task must be a function."

                )

            );

        }

        return new Promise((resolve, reject) => {

            this.queue.push({

                task,

                resolve,

                reject

            });

            this.runNext();

        });

    }

    /**
     * Execute Next Request
     */
    async runNext() {

        if (

            this.running >= this.maxConcurrent

        ) {

            return;

        }

        if (

            this.queue.length === 0

        ) {

            return;

        }

        const request = this.queue.shift();

        this.running++;

        const start = performance.now();

        try {

            const result = await request.task();

            const duration =

                performance.now() - start;

            this.totalRequests++;

            this.totalTime += duration;

            console.log(

                `Request completed in ${duration.toFixed(2)} ms`

            );

            request.resolve(result);

        }

        catch (error) {

            request.reject(error);

        }

        finally {

            this.running--;

            this.runNext();

        }

    }

    /**
     * Run Requests Together
     */
    all(requests) {

        return Promise.all(requests);

    }

    /**
     * Run Requests Even if One Fails
     */
    allSettled(requests) {

        return Promise.allSettled(requests);

    }

    /**
     * Queue Status
     */
    status() {

        return {

            running: this.running,

            waiting: this.queue.length,

            concurrency: this.maxConcurrent,

            completed: this.totalRequests,

            averageTime:

                this.totalRequests === 0

                    ? 0

                    : Number(

                        (

                            this.totalTime /

                            this.totalRequests

                        ).toFixed(2)

                    )

        };

    }

    /**
     * Clear Waiting Queue
     */
    clearQueue() {

        this.queue.length = 0;

    }

    /**
     * Queue Size
     */
    size() {

        return this.queue.length;

    }

    /**
     * Active Requests
     */
    active() {

        return this.running;

    }

}

export const requestManager = new RequestManager();