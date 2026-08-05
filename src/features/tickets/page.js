import { get } from "../../core/store.js";
import { initializeTicketForm } from "./form.js";
import { renderTicketTable } from "../../ui/components/ticketTable.js";
// import { initializeTickets } from "./index.js";
import { renderTickets } from "./index.js";
import { startTicketPolling } from "./polling.js";
import Swal from 'sweetalert2';
let ticketEventRegistered = false;

if (!ticketEventRegistered) {

    ticketEventRegistered = true;

    window.addEventListener(
        "ticketsUpdated",
        () => {

            renderTickets();

        }
    );

}
import {
    importData,
    exportJson,
    exportCsv
} from "./importExport.js";

export function renderTicketsPage(container) {

    const tickets = get("tickets") || [];

    container.innerHTML = `

        <section
            class="page-header"
            style="
                display:flex;
                justify-content:space-between;
                align-items:flex-start;
                gap:16px;
                margin-bottom:24px;
                flex-wrap:wrap;
            "
        >

            <div>

                <h1
                    style="
                        margin:0 0 4px;
                        font-size:1.5rem;
                        font-weight:700;
                        color:#0f172a;
                    "
                >

                    Tickets

                </h1>

                <p
                    style="
                        margin:0;
                        color:#64748b;
                    "
                >

                    Manage and monitor support tickets.

                </p>

            </div>

            <div
                style="
                    display:flex;
                    gap:10px;
                    flex-wrap:wrap;
                "
            >

                <button
                    id="newTicketBtn"
                    class="primary-btn"
                >

                    + New Ticket

                </button>

                <button
                    id="importBtn"
                    class="secondary-btn"
                >

                    Import

                </button>

                <button
                    id="exportJsonBtn"
                    class="secondary-btn"
                >

                    Export JSON

                </button>

                <button
                    id="exportCsvBtn"
                    class="secondary-btn"
                >

                    Export CSV

                </button>

                <input
                    id="ticketImportInput"
                    type="file"
                    accept=".json,.csv"
                    hidden
                >

            </div>

        </section>

        <section
            class="panel"
            style="
                background:#fff;
                border:1px solid #e2e8f0;
                border-radius:12px;
                padding:16px;
                margin-bottom:20px;
            "
        >

            <div
                class="toolbar"
                style="
                    display:flex;
                    gap:12px;
                    flex-wrap:wrap;
                "
            >

                <input
                    id="ticketSearch"
                    class="search-input"
                    type="search"
                    placeholder="Search tickets..."
                    autocomplete="off"
                >

                <select id="statusFilter">

                    <option value="All">

                        All Status

                    </option>

                    <option value="Open">

                        Open

                    </option>

                    <option value="Pending">

                        Pending

                    </option>

                    <option value="Closed">

                        Closed

                    </option>

                </select>

                <select id="priorityFilter">

                    <option value="All">

                        All Priority

                    </option>

                    <option value="High">

                        High

                    </option>

                    <option value="Medium">

                        Medium

                    </option>

                    <option value="Low">

                        Low

                    </option>

                </select>

               
        </section>

        <div
            id="ticketTableContainer"
            style="
                background:#fff;
                border:1px solid #e2e8f0;
                border-radius:12px;
                overflow:hidden;
            "
        >

            ${renderTicketTable(tickets)}

        </div>

    `;
initializeTicketForm();

renderTickets();

startTicketPolling();

bindImportExport(container);

/*
|--------------------------------------------------------------------------
| Refresh Tickets Automatically
|--------------------------------------------------------------------------
*/

if (!ticketEventRegistered) {

    ticketEventRegistered = true;

    window.addEventListener(

        "ticketsUpdated",

        () => {

            const ticketContainer = document.getElementById(

                "ticketTableContainer"

            );

            if (!ticketContainer) {

                return;

            }

            ticketContainer.innerHTML = renderTicketTable(

                get("tickets") || []

            );

        }

    );

}
    

}
/**
 * ---------------------------------------------------------
 * Import / Export
 * ---------------------------------------------------------
 */

function bindImportExport(container) {

    const fileInput = container.querySelector(

        "#ticketImportInput"

    );

    /*
    |--------------------------------------------------------------------------
    | Import
    |--------------------------------------------------------------------------
    */

    container
        .querySelector("#importBtn")
        ?.addEventListener("click", () => {

            fileInput.click();

        });

    fileInput?.addEventListener(

        "change",

        async event => {

            const file = event.target.files[0];

            if (!file) {

                return;

            }

            try {

                const reader = new FileReader();

                reader.onload = async e => {

                    const text = e.target.result;

                    let records = [];

                    /*
                    |--------------------------------------------------------------------------
                    | Parse JSON
                    |--------------------------------------------------------------------------
                    */

                    if (

                        file.name

                            .toLowerCase()

                            .endsWith(".json")

                    ) {

                        records = JSON.parse(text);

                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Parse CSV
                    |--------------------------------------------------------------------------
                    */

                    else {

                        const lines =

                            text

                                .trim()

                                .split("\n");

                        const headers =

                            lines

                                .shift()

                                .split(",");

                        records = lines.map(line => {

                            const values =

                                line.split(",");

                            const obj = {};

                            headers.forEach(

                                (header, index) => {

                                    obj[header.trim()] =

                                        values[index]?.trim() || "";

                                }

                            );

                            return obj;

                        });

                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Preview
                    |--------------------------------------------------------------------------
                    */

                    const preview = records

                        .slice(0, 5)

                        .map(ticket => `

                            <tr>

                                <td>${ticket.id ?? ""}</td>

                                <td>${ticket.title ?? ""}</td>

                                <td>${ticket.customer ?? ""}</td>

                                <td>${ticket.status ?? ""}</td>

                            </tr>

                        `)

                        .join("");

                    const result = await Swal.fire({

                        title: "Import Preview",

                        width: 900,

                        html: `

                            <p>

                                <strong>

                                    ${records.length}

                                </strong>

                                records found.

                            </p>

                            <table
                                class="table"
                                style="margin-top:15px;"
                            >

                                <thead>

                                    <tr>

                                        <th>ID</th>

                                        <th>Title</th>

                                        <th>Customer</th>

                                        <th>Status</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    ${preview}

                                </tbody>

                            </table>

                            ${records.length > 5

                                ? `<p style="margin-top:15px;">Showing first 5 records...</p>`

                                : ""

                            }

                        `,

                        showCancelButton: true,

                        confirmButtonText: "Import",

                        cancelButtonText: "Cancel"

                    });

                    /*
                    |--------------------------------------------------------------------------
                    | Import
                    |--------------------------------------------------------------------------
                    */

                    if (result.isConfirmed) {

                        await importData(file);

                        Swal.fire({

                            icon: "success",

                            title: "Import Complete",

                            text: `${records.length} ticket(s) imported.`,

                            toast: true,

                            position: "top-end",

                            timer: 2500,

                            showConfirmButton: false

                        });

                        renderTicketsPage(container);

                    }

                };

                reader.readAsText(file);

            }

            catch (error) {

                Swal.fire({

                    icon: "error",

                    title: "Import Failed",

                    text: error.message

                });

            }

            fileInput.value = "";

        }

    );

    /*
    |--------------------------------------------------------------------------
    | Export JSON
    |--------------------------------------------------------------------------
    */

    container
        .querySelector("#exportJsonBtn")
        ?.addEventListener("click", () => {

            exportJson();

        });

    /*
    |--------------------------------------------------------------------------
    | Export CSV
    |--------------------------------------------------------------------------
    */

    container
        .querySelector("#exportCsvBtn")
        ?.addEventListener("click", () => {

            exportCsv();

        });

}