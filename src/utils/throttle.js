/**
 * Throttle Function
 *
 * Executes a function at most once
 * during the specified delay.
 */

export function throttle(callback, delay = 1000) {

    let waiting = false;

    return (...args) => {

        if (waiting) {

            return;

        }

        callback(...args);

        waiting = true;

        setTimeout(() => {

            waiting = false;

        }, delay);

    };

}