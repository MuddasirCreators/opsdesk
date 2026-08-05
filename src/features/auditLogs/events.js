import Swal from "sweetalert2";

import {

    getAuditLogs,

    setAuditLogs,

    findAuditLogById,

    removeAuditLog,

    renderAuditLogs

} from "./index.js";

/**
 * ---------------------------------------------------------
 * Initialize Audit Log Events
 * ---------------------------------------------------------
 */
export function initializeAuditLogEvents() {

    bindViewEvents();

    bindDeleteEvents();

    bindClearEvents();

}

/**
 * ---------------------------------------------------------
 * View Audit Log
 * ---------------------------------------------------------
 */
function bindViewEvents() {

    document.querySelectorAll(

        ".view-btn"

    ).forEach(button => {

        button.onclick = () => {

            const id = Number(

                button.dataset.id

            );

            const log = findAuditLogById(id);

            if (!log) {

                return;

            }

            Swal.fire({

                title: "Audit Log",

                html: `

                    <div style="text-align:left;line-height:1.8;">

                        <p>

                            <strong>ID:</strong>

                            ${log.id}

                        </p>

                        <p>

                            <strong>User:</strong>

                            ${log.user}

                        </p>

                        <p>

                            <strong>Action:</strong>

                            ${log.action}

                        </p>

                        <p>

                            <strong>Module:</strong>

                            ${log.module}

                        </p>

                        <p>

                            <strong>Details:</strong>

                            ${log.details || "-"}

                        </p>

                        <p>

                            <strong>Date:</strong>

                            ${new Date(log.createdAt).toLocaleString()}

                        </p>

                    </div>

                `,

                confirmButtonText: "Close",

                confirmButtonColor: "#2563eb"

            });

        };

    });

}

/**
 * ---------------------------------------------------------
 * Delete Audit Log
 * ---------------------------------------------------------
 */
function bindDeleteEvents() {

    document.querySelectorAll(

        ".delete-btn"

    ).forEach(button => {

        button.onclick = async () => {

            const id = Number(

                button.dataset.id

            );

            const result = await Swal.fire({

                title: "Delete Audit Log?",

                text: "This action cannot be undone.",

                icon: "warning",

                showCancelButton: true,

                confirmButtonText: "Delete",

                confirmButtonColor: "#dc2626"

            });

            if (!result.isConfirmed) {

                return;

            }

            removeAuditLog(id);

            Swal.fire({

                icon: "success",

                title: "Audit Log Deleted",

                timer: 1500,

                showConfirmButton: false

            });

        };

    });

}

/**
 * ---------------------------------------------------------
 * Clear All Audit Logs
 * ---------------------------------------------------------
 */
function bindClearEvents() {

    const button = document.getElementById(

        "clearAuditLogs"

    );

    if (!button) {

        return;

    }

    button.onclick = async () => {

        const result = await Swal.fire({

            title: "Clear All Audit Logs?",

            text: "All audit history will be removed.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Clear All",

            confirmButtonColor: "#dc2626"

        });

        if (!result.isConfirmed) {

            return;

        }

        setAuditLogs([]);

        renderAuditLogs();

        Swal.fire({

            icon: "success",

            title: "Audit Logs Cleared",

            timer: 1500,

            showConfirmButton: false

        });

    };

}