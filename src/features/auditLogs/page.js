import {

    renderAuditLogs

} from "./index.js";

/**
 * ---------------------------------------------------------
 * Render Audit Logs Page
 * ---------------------------------------------------------
 */
export function renderAuditLogsPage(container) {

    container.innerHTML = `

        <section class="page-header">

            <div>

                <h1>

                    Audit Logs

                </h1>

                <p>

                    Monitor all application activities and user actions.

                </p>

            </div>

        </section>

        <section class="panel">

            <div class="panel-header">

                <div>

                    <h3>

                        Activity History

                    </h3>

                    <p>

                        Every important action performed inside the application is recorded here.

                    </p>

                </div>

            </div>

            <div

                id="auditLogsContainer"

            >

            </div>

        </section>

    `;

    renderAuditLogs();

}