/**
 * Returns paginated ticket data.
 *
 * @param {Array} tickets
 * @param {number} currentPage
 * @param {number} pageSize
 * @returns {Object}
 */
export function paginateTickets(
    tickets,
    currentPage = 1,
    pageSize = 10
) {
    if (!Array.isArray(tickets)) {
        return {
            data: [],
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            pageSize
        };
    }

    const totalItems = tickets.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const safePage = Math.min(
        Math.max(currentPage, 1),
        Math.max(totalPages, 1)
    );

    const startIndex = (safePage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
        data: tickets.slice(startIndex, endIndex),
        currentPage: safePage,
        totalPages,
        totalItems,
        pageSize
    };
}