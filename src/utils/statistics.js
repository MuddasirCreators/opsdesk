/**
 * Calculate ticket statistics.
 */
export function getStatistics(tickets) {

    return {

        total: tickets.length,

        open: tickets.filter(ticket =>
            ticket.status === "Open"
        ).length,

        closed: tickets.filter(ticket =>
            ticket.status === "Closed"
        ).length,

        pending: tickets.filter(ticket =>
            ticket.status === "Pending"
        ).length,

        highPriority: tickets.filter(ticket =>
            ticket.priority === "High"
        ).length,

        mediumPriority: tickets.filter(ticket =>
            ticket.priority === "Medium"
        ).length,

        lowPriority: tickets.filter(ticket =>
            ticket.priority === "Low"
        ).length

    };

}