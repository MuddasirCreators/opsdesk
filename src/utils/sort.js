const PRIORITY_ORDER = {
    high: 1,
    medium: 2,
    low: 3
};

export function sortTickets(tickets, sortBy = "id", sortDirection = "asc") {

    const sortedTickets = [...tickets];

    sortedTickets.sort((a, b) => {

        let valueA;
        let valueB;

        switch (sortBy) {

            case "priority":
                valueA = PRIORITY_ORDER[a.priority.toLowerCase()] ?? 999;
                valueB = PRIORITY_ORDER[b.priority.toLowerCase()] ?? 999;
                break;

            case "createdAt":
                valueA = new Date(a.createdAt).getTime();
                valueB = new Date(b.createdAt).getTime();
                break;

            default:
                valueA = a[sortBy];
                valueB = b[sortBy];
        }

        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;

        return 0;
    });

    return sortedTickets.map(ticket => ({
        ...ticket,
        status: ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).toLowerCase(),
        priority: ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1).toLowerCase()
    }));
}