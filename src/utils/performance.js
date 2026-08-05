/**
 * ==========================================================
 * Performance Utilities
 * Mission 8
 * ==========================================================
 *
 * Features
 * --------
 * ✔ Performance API
 * ✔ requestAnimationFrame
 * ✔ requestIdleCallback
 * ✔ FPS Counter
 * ✔ Measure Execution Time
 * ✔ Debounce Rendering
 */

/**
 * ----------------------------------------------------------
 * Measure Function Execution
 * ----------------------------------------------------------
 */

export function measure(name, callback) {

    const start = performance.now();

    const result = callback();

    const end = performance.now();

    console.log(

        `${name}: ${(end - start).toFixed(2)} ms`

    );

    return result;

}

/**
 * ----------------------------------------------------------
 * Async Measure
 * ----------------------------------------------------------
 */

export async function measureAsync(name, callback) {

    const start = performance.now();

    const result = await callback();

    const end = performance.now();

    console.log(

        `${name}: ${(end - start).toFixed(2)} ms`

    );

    return result;

}

/**
 * ----------------------------------------------------------
 * requestAnimationFrame Wrapper
 * ----------------------------------------------------------
 */

export function nextFrame(callback) {

    return requestAnimationFrame(callback);

}

/**
 * ----------------------------------------------------------
 * Cancel Animation Frame
 * ----------------------------------------------------------
 */

export function cancelFrame(id) {

    cancelAnimationFrame(id);

}

/**
 * ----------------------------------------------------------
 * Run During Browser Idle Time
 * ----------------------------------------------------------
 */

export function runIdle(callback) {

    if ("requestIdleCallback" in window) {

        return requestIdleCallback(callback);

    }

    return setTimeout(callback, 1);

}

/**
 * ----------------------------------------------------------
 * Cancel Idle Callback
 * ----------------------------------------------------------
 */

export function cancelIdle(id) {

    if ("cancelIdleCallback" in window) {

        cancelIdleCallback(id);

        return;

    }

    clearTimeout(id);

}

/**
 * ----------------------------------------------------------
 * FPS Counter
 * ----------------------------------------------------------
 */

let lastFrame = performance.now();

export function fps() {

    const now = performance.now();

    const value =

        1000 / (now - lastFrame);

    lastFrame = now;

    return Math.round(value);

}

/**
 * ----------------------------------------------------------
 * Simple Debounce
 * ----------------------------------------------------------
 */

export function debounce(callback, delay = 300) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}

/**
 * ----------------------------------------------------------
 * Simple Throttle
 * ----------------------------------------------------------
 */

export function throttle(callback, delay = 200) {

    let waiting = false;

    return (...args) => {

        if (waiting) {

            return;

        }

        waiting = true;

        callback(...args);

        setTimeout(() => {

            waiting = false;

        }, delay);

    };

}