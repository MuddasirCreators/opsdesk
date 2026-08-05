/**
 * Show Notification
 */
export function showNotification(message, type = "info") {

    const notification = document.createElement("div");

    notification.className = `notification ${type}`;

    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);

}

/**
 * Success Notification
 */
export function success(message) {

    showNotification(message, "success");

}

/**
 * Error Notification
 */
export function error(message) {

    showNotification(message, "error");

}

/**
 * Warning Notification
 */
export function warning(message) {

    showNotification(message, "warning");

}

/**
 * Info Notification
 */
export function info(message) {

    showNotification(message, "info");

}