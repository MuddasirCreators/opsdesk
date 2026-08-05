/**
 * Filters tickets based on the provided criteria.
 *
 * @param {Array} tickets
 * @param {Object} filters
 * @returns {Array}
 */
export function filterTickets(tickets, filters = {}) {
    if (!Array.isArray(tickets)) {
        return [];
    }

    const {
        status = "",
        priority = "",
        category = "",
        assignee = ""
    } = filters;

    return tickets.filter((ticket) => {
        const matchesStatus =
            !status || ticket.status === status;

        const matchesPriority =
            !priority || ticket.priority === priority;

        const matchesCategory =
            !category || ticket.category === category;

        const matchesAssignee =
            !assignee || ticket.assignee === assignee;

        return (
            matchesStatus &&
            matchesPriority &&
            matchesCategory &&
            matchesAssignee
        );
    });
}