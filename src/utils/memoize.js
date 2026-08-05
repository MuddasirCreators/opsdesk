/**
 * ==========================================================
 * Memoization Utility
 * Mission 8
 * ==========================================================
 *
 * Features
 * --------
 * ✔ Cache expensive calculations
 * ✔ Automatic key generation
 * ✔ Clear cache
 * ✔ Cache statistics
 */

const cache = new Map();

/**
 * ----------------------------------------------------------
 * Memoize Function
 * ----------------------------------------------------------
 */
export function memoize(fn) {

    return (...args) => {

        const key = JSON.stringify(args);

        if (cache.has(key)) {

            return cache.get(key);

        }

        const result = fn(...args);

        cache.set(key, result);

        return result;

    };

}

/**
 * ----------------------------------------------------------
 * Clear Memo Cache
 * ----------------------------------------------------------
 */
export function clearMemoCache() {

    cache.clear();

}

/**
 * ----------------------------------------------------------
 * Remove One Cached Value
 * ----------------------------------------------------------
 */
export function removeMemo(key) {

    cache.delete(key);

}

/**
 * ----------------------------------------------------------
 * Cache Size
 * ----------------------------------------------------------
 */
export function memoCacheSize() {

    return cache.size;

}