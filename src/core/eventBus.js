//An Event Bus allows different parts of the application to communicate without directly knowing about each other\
const events = {};

/**
 * Register an Event
 */
export function on(eventName, callback) {

    if (!events[eventName]) {
        events[eventName] = [];
    }

    events[eventName].push(callback);

}

/**
 * Remove an Event
 */
export function off(eventName, callback) {

    if (!events[eventName]) {
        return;
    }

    events[eventName] = events[eventName].filter(
        item => item !== callback
    );

}

/**
 * Trigger an Event
 */
export function emit(eventName, data = null) {

    if (!events[eventName]) {
        return;
    }

    events[eventName].forEach(callback => {
        callback(data);
    });

}

/**
 * Remove All Events
 */
export function clearEvents() {

    Object.keys(events).forEach(eventName => {
        delete events[eventName];
    });

}