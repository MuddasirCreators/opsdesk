import { renderCustomers } from "./index.js";

/**
 * Render Customers Page
 */
export function renderCustomersPage(container) {

    container.innerHTML = `

        <section class="page-header">

            <div>

                <h1>Customers</h1>

                <p>

                    Manage customer information and records.

                </p>

            </div>

        </section>

        <section class="panel">

            <div class="panel-header">

                <div>

                    <h3>Customer Directory</h3>

                    <p>

                        Customers are automatically created when a new ticket is created.

                    </p>

                </div>

            </div>

            <div id="customersContainer">

            </div>

        </section>

    `;

    renderCustomers();

}