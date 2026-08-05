/**
 * Debounce
 *
 * Delays execution until
 * the user stops triggering
 * the function.
 */
export function debounce(callback, delay = 300) {

    let timerId = null;

    return function (...args) {

        clearTimeout(timerId);

        timerId = setTimeout(() => {

            callback.apply(this, args);

        }, delay);

    };

}