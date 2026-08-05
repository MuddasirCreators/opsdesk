/**
 * Maximum rows rendered.
 * Mission 8 (Simple Virtualization)
 */
const MAX_VISIBLE_ROWS = 500;

/**
 * Escape text for safe insertion into HTML.
 */
function escapeHtml(value) {

    if (value == null) {

        return "";

    }

    return String(value)

        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

}

/**
 * Format Date
 */
function formatDate(value) {

    if (!value) {

        return "—";

    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {

        return "—";

    }

    return date.toLocaleDateString(

        undefined,

        {

            year: "numeric",

            month: "short",

            day: "numeric"

        }

    );

}

/**
 * Render Ticket Table
 */
export function renderTicketTable(tickets = []) {

    const hasRows =

        Array.isArray(tickets) &&

        tickets.length > 0;

    const visibleTickets = hasRows

        ? tickets.slice(0, MAX_VISIBLE_ROWS)

        : [];

    const rows = hasRows

        ? visibleTickets.map(ticket => {

            const id = escapeHtml(ticket.id);

            const title = escapeHtml(ticket.title);

            const customer = escapeHtml(ticket.customer);

            const priority = escapeHtml(ticket.priority);

            const status = escapeHtml(ticket.status);

            const assignee = escapeHtml(

                ticket.assignee || "—"

            );

            const created = escapeHtml(

                formatDate(ticket.createdAt)

            );

            const priorityClass =

                String(ticket.priority || "")

                    .toLowerCase();

            const statusClass =

                String(ticket.status || "")

                    .toLowerCase();

            return `

                <tr class="ticket-row" data-id="${id}">

                    <td class="cell-strong">

                        #${id}

                    </td>

                    <td>

                        <span

                            class="ticket-title"

                            title="${title}"

                        >

                            ${title}

                        </span>

                    </td>

                    <td>${customer}</td>

                    <td>

                        <span

                            class="badge priority-${priorityClass}"

                        >

                            ${priority}

                        </span>

                    </td>

                    <td>

                        <span

                            class="badge status-${statusClass}"

                        >

                            ${status}

                        </span>

                    </td>

                    <td>${assignee}</td>

                    <td>${created}</td>

                    <td>

                        <div class="table-actions">

                            <button

                                type="button"

                                class="table-btn view-btn"

                                data-id="${id}"

                            >

                                View

                            </button>

                            <button

                                type="button"

                                class="table-btn edit-btn"

                                data-id="${id}"

                            >

                                Edit

                            </button>

                            <button

                                type="button"

                                class="table-btn delete-btn"

                                data-id="${id}"

                            >

                                Delete

                            </button>

                        </div>

                    </td>

                </tr>

            `;

        }).join("")

        : `

            <tr>

                <td colspan="8" class="empty-state">

                    <div class="empty-state-content">

                        <span class="empty-icon">

                            📋

                        </span>

                        <strong>

                            No tickets found

                        </strong>

                        <span>

                            Try adjusting filters or create a new ticket.

                        </span>

                    </div>

                </td>

            </tr>

        `;

    return `

        <div class="panel ticket-panel">

            <div class="panel-header">

                <div>

                    <h3>

                        All Tickets

                    </h3>

                    <p>

                        ${

                            hasRows

                                ? `${visibleTickets.length} of ${tickets.length} ticket${tickets.length === 1 ? "" : "s"}`

                                : "No results"

                        }

                    </p>

                </div>

                <button

                    type="button"

                    id="newTicketBtn"

                    class="primary-btn"

                >

                    <span>+</span>

                    New Ticket

                </button>

            </div>

            <div class="table-wrap">

                <table class="table">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Title</th>

                            <th>Customer</th>

                            <th>Priority</th>

                            <th>Status</th>

                            <th>Assignee</th>

                            <th>Created</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows}

                    </tbody>

                </table>

            </div>

            ${

                tickets.length > MAX_VISIBLE_ROWS

                    ? `

                        <div

                            style="padding:12px;color:#64748b;font-size:13px;text-align:center;"

                        >

                            Showing first ${MAX_VISIBLE_ROWS} records for better performance.

                        </div>

                    `

                    : ""

            }

        </div>

    `;

}