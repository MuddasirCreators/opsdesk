/**
 * API Endpoints
 */

export const ENDPOINTS = Object.freeze({

    /**
     * Tickets
     */
    TICKETS: "/tickets",

    /**
     * Customers
     */
    CUSTOMERS: "/customers",

    /**
     * Jobs
     */
    JOBS: "/jobs",

    /**
     * Audit Logs
     */
    AUDIT_LOGS: "/audit-logs"

});

/**
 * Build endpoint with ID
 */

export function ticketById(id) {

    return `${ENDPOINTS.TICKETS}/${id}`;

}

export function customerById(id) {

    return `${ENDPOINTS.CUSTOMERS}/${id}`;

}

export function jobById(id) {

    return `${ENDPOINTS.JOBS}/${id}`;

}

export function auditLogById(id) {

    return `${ENDPOINTS.AUDIT_LOGS}/${id}`;

}