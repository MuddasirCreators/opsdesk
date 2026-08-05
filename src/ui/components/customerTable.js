/**
 * Escape HTML
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

        return "-";

    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {

        return "-";

    }

    return date.toLocaleDateString();

}

/**
 * Render Customer Table
 */
export function renderCustomerTable(customers = []) {

    const hasCustomers = customers.length > 0;

    const rows = hasCustomers

        ? customers.map(customer => `

            <tr>

                <td>

                    ${escapeHtml(customer.id)}

                </td>

                <td>

                    ${escapeHtml(customer.name)}

                </td>

                <td>

                    ${escapeHtml(customer.email || "-")}

                </td>

                <td>

                    ${formatDate(customer.createdAt)}

                </td>

                <td>

                    <div class="table-actions">

                        <button

                            class="table-btn view-btn"

                            data-id="${customer.id}"

                        >

                            View

                        </button>

                        <button

                            class="table-btn edit-btn"

                            data-id="${customer.id}"

                        >

                            Edit

                        </button>

                        <button

                            class="table-btn delete-btn"

                            data-id="${customer.id}"

                        >

                            Delete

                        </button>

                    </div>

                </td>

            </tr>

        `).join("")

        : `

            <tr>

                <td

                    colspan="5"

                    class="empty-state"

                >

                    <div class="empty-state-content">

                        <span class="empty-icon">

                            👤

                        </span>

                        <strong>

                            No Customers Found

                        </strong>

                        <span>

                            Customers will automatically appear when tickets are created.

                        </span>

                    </div>

                </td>

            </tr>

        `;

    return `

        <div class="panel">

            <div class="panel-header">

                <div>

                    <h3>

                        Customers

                    </h3>

                    <p>

                        Total Customers:

                        ${customers.length}

                    </p>

                </div>

            </div>

            <div class="table-wrap">

                <table class="table">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Name</th>

                            <th>Email</th>

                            <th>Created</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}