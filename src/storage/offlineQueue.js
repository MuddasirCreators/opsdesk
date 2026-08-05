/**
 * ---------------------------------------------------------
 * Offline Queue Storage
 * ---------------------------------------------------------
 */

const STORAGE_KEY = "opsdesk_offline_queue";

let queueProcessor = null;

/**
 * ---------------------------------------------------------
 * Get Queue
 * ---------------------------------------------------------
 */

export function getQueue() {

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {

        return [];

    }

    try {

        return JSON.parse(data);

    }

    catch (error) {

        console.error(

            "Invalid offline queue data.",

            error

        );

        return [];

    }

}

/**
 * ---------------------------------------------------------
 * Save Queue
 * ---------------------------------------------------------
 */

export function saveQueue(queue) {

    try {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(queue)

        );

    }

    catch (error) {

        console.error(

            "Unable to save offline queue.",

            error

        );

    }

}

/**
 * ---------------------------------------------------------
 * Add Item
 * ---------------------------------------------------------
 */

export function addToQueue(item) {

    const queue = getQueue();

    queue.push({

        id: crypto.randomUUID(),

        timestamp: Date.now(),

        ...item

    });

    saveQueue(queue);

}

/**
 * ---------------------------------------------------------
 * Remove First Item
 * ---------------------------------------------------------
 */

export function removeFirstItem() {

    const queue = getQueue();

    if (queue.length === 0) {

        return null;

    }

    const item = queue.shift();

    saveQueue(queue);

    return item;

}

/**
 * ---------------------------------------------------------
 * Remove Item By ID
 * ---------------------------------------------------------
 */

export function removeById(id) {

    const queue = getQueue().filter(

        item => item.id !== id

    );

    saveQueue(queue);

}

/**
 * ---------------------------------------------------------
 * Queue Length
 * ---------------------------------------------------------
 */

export function getQueueLength() {

    return getQueue().length;

}

/**
 * ---------------------------------------------------------
 * Queue Empty?
 * ---------------------------------------------------------
 */

export function isQueueEmpty() {

    return getQueueLength() === 0;

}

/**
 * ---------------------------------------------------------
 * Clear Queue
 * ---------------------------------------------------------
 */

export function clearQueue() {

    localStorage.removeItem(STORAGE_KEY);

}

/**
 * ---------------------------------------------------------
 * Process Queue
 * ---------------------------------------------------------
 */

export async function processQueue(callback) {

    const queue = getQueue();

    if (queue.length === 0) {

        return;

    }

    const remaining = [];

    for (const item of queue) {

        try {

            await callback(item);

        }

        catch (error) {

            console.error(

                "Retry failed.",

                error

            );

            remaining.push(item);

        }

    }

    saveQueue(remaining);

}

/**
 * ---------------------------------------------------------
 * Register Queue Processor
 * ---------------------------------------------------------
 */

export function registerQueueProcessor(callback) {

    queueProcessor = callback;

}

/**
 * ---------------------------------------------------------
 * Retry Automatically
 * ---------------------------------------------------------
 */

window.addEventListener(

    "online",

    async () => {

        console.log(

            "Connection restored. Processing offline queue..."

        );

        if (queueProcessor) {

            await processQueue(queueProcessor);

        }

    }

);