export function renderRecentTickets(tickets = []) {

    const recent = [...tickets]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    return `

        <div class="panel">

            <div class="panel-header">

                <h3>Recent Tickets</h3>

                <button class="primary-btn" id="viewAllTickets">
                    View All
                </button>

            </div>

            <table class="table">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Title</th>
                        <th>Customer</th>
                        <th>Priority</th>
                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    ${
                        recent.length

                        ? recent.map(ticket => `

                            <tr>

                                <td>#${ticket.id}</td>

                                <td>${ticket.title}</td>

                                <td>${ticket.customer}</td>

                                <td>

                                    <span class="badge priority-${ticket.priority.toLowerCase()}">

                                        ${ticket.priority}

                                    </span>

                                </td>

                                <td>

                                    <span class="badge status-${ticket.status.toLowerCase()}">

                                        ${ticket.status}

                                    </span>

                                </td>

                            </tr>

                        `).join("")

                        : `

                            <tr>

                                <td colspan="5">

                                    No tickets available.

                                </td>

                            </tr>

                        `

                    }

                </tbody>

            </table>

        </div>

    `;

}