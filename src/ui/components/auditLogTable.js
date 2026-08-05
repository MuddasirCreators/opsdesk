/**
 * ---------------------------------------------------------
 * Escape HTML
 * ---------------------------------------------------------
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
 * ---------------------------------------------------------
 * Format Date
 * ---------------------------------------------------------
 */
function formatDate(value) {

    if (!value) {

        return "-";

    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {

        return "-";

    }

    return date.toLocaleString();

}

/**
 * ---------------------------------------------------------
 * Render Audit Log Table
 * ---------------------------------------------------------
 */
export function renderAuditLogTable(logs = []) {

    const hasLogs = logs.length > 0;

    const rows = hasLogs

        ? logs.map(log => `

            <tr>

                <td>

                    ${escapeHtml(log.id)}

                </td>

                <td>

                    ${escapeHtml(log.user || "System")}

                </td>

                <td>

                    ${escapeHtml(log.action)}

                </td>

                <td>

                    ${escapeHtml(log.module)}

                </td>

                <td>

                    ${formatDate(log.createdAt)}

                </td>

                <td>

                    <div class="table-actions">

                        <button

                            type="button"

                            class="table-btn view-btn"

                            data-id="${log.id}"

                        >

                            View

                        </button>

                        <button

                            type="button"

                            class="table-btn delete-btn"

                            data-id="${log.id}"

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

                    colspan="6"

                    class="empty-state"

                >

                    <div class="empty-state-content">

                        <span class="empty-icon">

                            📝

                        </span>

                        <strong>

                            No Audit Logs Found

                        </strong>

                        <span>

                            Application activity will appear here automatically.

                        </span>

                    </div>

                </td>

            </tr>

        `;

    return `

        <div class="panel audit-log-panel">

            <div class="panel-header">

                <div>

                    <h3>

                        Audit Logs

                    </h3>

                    <p>

                        Total Records:

                        ${logs.length}

                    </p>

                </div>

                <button

                    type="button"

                    id="clearAuditLogs"

                    class="danger-btn"

                >

                    Clear All

                </button>

            </div>

            <div class="table-wrap">

                <table class="table">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>User</th>

                            <th>Action</th>

                            <th>Module</th>

                            <th>Date</th>

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