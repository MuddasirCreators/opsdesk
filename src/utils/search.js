/**
 * Search tickets by keyword.
 */
export function searchTickets(tickets, keyword = "") {

    const query = keyword.trim().toLowerCase();

    // Return all tickets if search box is empty
    if (query === "") {
        return tickets;
    }

    return tickets.filter(ticket => {

        return (

            String(ticket.title || "")
                .toLowerCase()
                .includes(query) ||

            String(ticket.customer || "")
                .toLowerCase()
                .includes(query) ||

            String(ticket.status || "")
                .toLowerCase()
                .includes(query) ||

            String(ticket.priority || "")
                .toLowerCase()
                .includes(query)

        );

    });

}