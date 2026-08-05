/**
 * ==========================================================
 * Cache Utility
 * Mission 8
 * ==========================================================
 *
 * Features
 * --------
 * ✔ In-memory cache
 * ✔ Expiration (TTL)
 * ✔ Cache invalidation
 * ✔ Clear cache
 * ✔ Size monitoring
 */

const cache = new Map();

/**
 * ----------------------------------------------------------
 * Save Cache
 * ----------------------------------------------------------
 */
export function setCache(key, value, ttl = 60000) {

    cache.set(key, {

        value,

        expires: Date.now() + ttl

    });

}

/**
 * ----------------------------------------------------------
 * Get Cache
 * ----------------------------------------------------------
 */
export function getCache(key) {

    const item = cache.get(key);

    if (!item) {

        return null;

    }

    if (Date.now() > item.expires) {

        cache.delete(key);

        return null;

    }

    return item.value;

}

/**
 * ----------------------------------------------------------
 * Check Cache
 * ----------------------------------------------------------
 */
export function hasCache(key) {

    return getCache(key) !== null;

}

/**
 * ----------------------------------------------------------
 * Remove Cache
 * ----------------------------------------------------------
 */
export function removeCache(key) {

    cache.delete(key);

}

/**
 * ----------------------------------------------------------
 * Clear Cache
 * ----------------------------------------------------------
 */
export function clearCache() {

    cache.clear();

}

/**
 * ----------------------------------------------------------
 * Cache Size
 * ----------------------------------------------------------
 */
export function cacheSize() {

    return cache.size;

}