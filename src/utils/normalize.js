/**
 * Normalize a single ticket.
 */
export function normalizeTicket(ticket) {

    return {

        id: Number(ticket.id),

        title: String(ticket.title || "").trim(),

        customer: String(ticket.customer || "").trim(),

        category: String(ticket.category || "").trim(),

        assignee: String(ticket.assignee || "").trim(),

        status: String(ticket.status || "Open").trim(),

        priority: String(ticket.priority || "Medium").trim(),

        createdAt: ticket.createdAt
            ? new Date(ticket.createdAt)
            : new Date()

    };

}

/**
 * Normalize all tickets.
 */
export function normalizeTickets(tickets = []) {

    return tickets.map(normalizeTicket);

}