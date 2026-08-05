/**
 * ==========================================================
 * Task Scheduler
 * Mission 5 + Mission 7
 * ==========================================================
 *
 * Features
 * --------
 * ✔ Priority Queue
 * ✔ Concurrency Limit
 * ✔ Pause / Resume
 * ✔ Cancellation
 * ✔ Timeout
 * ✔ Queue Management
 * ✔ Promise-based API
 *
 */

class TaskScheduler {

    constructor(maxConcurrent = 2) {

        this.maxConcurrent = maxConcurrent;

        this.running = 0;

        this.queue = [];

        this.paused = false;

        this.nextId = 1;

    }

    /**
     * --------------------------------------------------------
     * Add Task
     * --------------------------------------------------------
     */

    add(task, options = {}) {

        if (typeof task !== "function") {

            throw new Error(

                "Task must be a function."

            );

        }

        const {

            priority = 5,

            timeout = 5000

        } = options;

        const safeTimeout =

            timeout > 0

                ? timeout

                : 5000;

        const id = this.nextId++;

        return {

            id,

            promise: new Promise((resolve, reject) => {

                this.queue.push({

                    id,

                    task,

                    priority,

                    timeout: safeTimeout,

                    resolve,

                    reject,

                    cancelled: false

                });

                this.sortQueue();

                this.run();

            })

        };

    }

    /**
     * --------------------------------------------------------
     * Execute Queue
     * --------------------------------------------------------
     */

    async run() {

        if (this.paused) {

            return;

        }

        while (

            this.running < this.maxConcurrent &&

            this.queue.length > 0

        ) {

            const item = this.queue.shift();

            if (item.cancelled) {

                item.reject(

                    new Error(

                        "Task cancelled."

                    )

                );

                continue;

            }

            this.execute(item);

        }

    }

    /**
     * --------------------------------------------------------
     * Execute Task
     * --------------------------------------------------------
     */

    async execute(item) {

        this.running++;

        let timer;

        try {

            const result = await Promise.race([

                item.task(),

                new Promise((_, reject) => {

                    timer = setTimeout(() => {

                        reject(

                            new Error(

                                "Task timeout."

                            )

                        );

                    }, item.timeout);

                })

            ]);

            clearTimeout(timer);

            item.resolve(result);

        }

        catch (error) {

            clearTimeout(timer);

            item.reject(error);

        }

        finally {

            this.running--;

            this.run();

        }

    }

    /**
     * --------------------------------------------------------
     * Sort Queue
     * --------------------------------------------------------
     */

    sortQueue() {

        this.queue.sort(

            (a, b) => a.priority - b.priority

        );

    }

    /**
     * --------------------------------------------------------
     * Cancel Task
     * --------------------------------------------------------
     */

    cancel(id) {

        const task = this.queue.find(

            task => task.id === id

        );

        if (!task) {

            return false;

        }

        task.cancelled = true;

        return true;

    }

    /**
     * --------------------------------------------------------
     * Pause Scheduler
     * --------------------------------------------------------
     */

    pause() {

        this.paused = true;

    }

    /**
     * --------------------------------------------------------
     * Resume Scheduler
     * --------------------------------------------------------
     */

    resume() {

        if (!this.paused) {

            return;

        }

        this.paused = false;

        this.run();

    }

    /**
     * --------------------------------------------------------
     * Clear Waiting Queue
     * --------------------------------------------------------
     */

    clear() {

        this.queue = [];

    }

    /**
     * --------------------------------------------------------
     * Queue Size
     * --------------------------------------------------------
     */

    size() {

        return this.queue.length;

    }

    /**
     * --------------------------------------------------------
     * Running Tasks
     * --------------------------------------------------------
     */

    active() {

        return this.running;

    }

    /**
     * --------------------------------------------------------
     * Scheduler Status
     * --------------------------------------------------------
     */

    status() {

        return {

            paused: this.paused,

            running: this.running,

            waiting: this.queue.length,

            concurrency: this.maxConcurrent

        };

    }

    /**
     * --------------------------------------------------------
     * Is Idle
     * --------------------------------------------------------
     */

    isIdle() {

        return (

            this.running === 0 &&

            this.queue.length === 0

        );

    }

}

/**
 * --------------------------------------------------------
 * Singleton Scheduler
 * --------------------------------------------------------
 */

export const taskScheduler = new TaskScheduler(2);