export function renderDashboardCards(stats) {

    return `

        <section class="cards">

            <div class="card">

                <span>Total Tickets</span>

                <h2>${stats.total}</h2>

                <small>All support requests</small>

            </div>

            <div class="card">

                <span>Open</span>

                <h2>${stats.open}</h2>

                <small>Needs attention</small>

            </div>

            <div class="card">

                <span>Pending</span>

                <h2>${stats.pending}</h2>

                <small>Waiting for response</small>

            </div>

            <div class="card">

                <span>Closed</span>

                <h2>${stats.closed}</h2>

                <small>Resolved tickets</small>

            </div>

        </section>

    `;

}