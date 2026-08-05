import { createTicket } from "./index.js";

import {
    validateTicket,
    isUniqueTitle
} from "./validation.js";

import {
    get,
    set
} from "../../core/store.js";
import {

    getPreference,
    setPreference,
    removePreference

} from "../../storage/preferences.js";
import {

    stripHtml

} from "../../core/security.js";
let formPanel = null;
let jobStartedAt = null;
const DRAFT_KEY = "ticket_draft";
export function initializeTicketForm() {

    createFormPanel();

    bindEvents();

}

function createFormPanel() {

    formPanel = document.getElementById("ticketFormPanel");

    if (formPanel) {

        return;

    }

    formPanel = document.createElement("section");

    formPanel.id = "ticketFormPanel";

    formPanel.className = "ticket-form-panel";

    formPanel.hidden = true;

    formPanel.innerHTML = `

        <form id="ticketForm" class="ticket-form">

            <div class="ticket-form-header">

                <div>

                    <h2>Create Ticket</h2>

                    <p>
                        Fill in the details below to open a new support ticket.
                    </p>

                </div>

                <button
                    type="button"
                    id="cancelTicketBtn"
                    class="secondary-btn">

                    Cancel

                </button>

            </div>

            <div class="form-grid">

                <div class="form-field form-field--full">

                    <label>

                        Title <span class="required">*</span>

                    </label>

                    <input
                        id="ticketTitle"
                        type="text"
                        autocomplete="off"
                        required
                    >

                </div>

                <div class="form-field">

                    <label>

                        Customer <span class="required">*</span>

                    </label>

                    <input
                        id="ticketCustomer"
                        type="text"
                        autocomplete="off"
                        required
                    >

                </div>

                <div class="form-field">

                    <label>

                        Category <span class="required">*</span>

                    </label>

                    <input
                        id="ticketCategory"
                        type="text"
                        autocomplete="off"
                        required
                    >

                </div>

                <div class="form-field">

                    <label>

                        Assignee <span class="required">*</span>

                    </label>

                    <input
                        id="ticketAssignee"
                        type="text"
                        autocomplete="off"
                        required
                    >

                </div>

                <div class="form-field">

                    <label>Status</label>

                    <select id="ticketStatus">

                        <option value="Open">Open</option>

                        <option value="Pending">Pending</option>

                        <option value="Closed">Closed</option>

                    </select>

                </div>

                <div class="form-field">

                    <label>Priority</label>

                    <select id="ticketPriority">

                        <option value="High">High</option>

                        <option value="Medium" selected>Medium</option>

                        <option value="Low">Low</option>

                    </select>

                </div>

            </div>

            <div class="modal-actions">

                <button
                    type="button"
                    id="cancelTicketBtnSecondary"
                    class="secondary-btn">

                    Cancel

                </button>

                <button
                    type="submit"
                    class="primary-btn">

                    Create Ticket

                </button>

            </div>

        </form>

    `;

    const page = document.getElementById("page");

    if (page) {

        page.insertBefore(

            formPanel,

            page.firstChild

        );

    }

    else {

        document.body.appendChild(formPanel);

    }

}

function showForm() {

    if (!formPanel) {

        return;

    }

    // Record the moment the user starts this operation
    jobStartedAt = new Date().toISOString();

    formPanel.hidden = false;
    restoreDraft();
    formPanel.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

    document.getElementById("ticketTitle")?.focus();

}

function hideForm() {

    if (!formPanel) {

        return;

    }

    formPanel.hidden = true;

    document.getElementById("ticketForm")?.reset();
    // removePreference(DRAFT_KEY);
    jobStartedAt = null;

}
/**
 * Save Draft
 */
function saveDraft() {

    setPreference(

        DRAFT_KEY,

        {

            title:
                document.getElementById("ticketTitle")?.value || "",

            customer:
                document.getElementById("ticketCustomer")?.value || "",

            category:
                document.getElementById("ticketCategory")?.value || "",

            assignee:
                document.getElementById("ticketAssignee")?.value || "",

            status:
                document.getElementById("ticketStatus")?.value || "Open",

            priority:
                document.getElementById("ticketPriority")?.value || "Medium"

        }

    );

}
/**
 * Restore Draft
 */
function restoreDraft() {

    const draft = getPreference(DRAFT_KEY);

    if (!draft) {

        return;

    }

    document.getElementById("ticketTitle").value =
        draft.title || "";

    document.getElementById("ticketCustomer").value =
        draft.customer || "";

    document.getElementById("ticketCategory").value =
        draft.category || "";

    document.getElementById("ticketAssignee").value =
        draft.assignee || "";

    document.getElementById("ticketStatus").value =
        draft.status || "Open";

    document.getElementById("ticketPriority").value =
        draft.priority || "Medium";

}

function bindEvents() {

    document.removeEventListener(

        "click",

        handleClick

    );

    document.addEventListener(

        "click",

        handleClick

    );

    const form = document.getElementById(

        "ticketForm"

    );
    form?.querySelectorAll(

    "input, select"

).forEach(field => {

    field.addEventListener(

        "input",

        saveDraft

    );

    field.addEventListener(

        "change",

        saveDraft

    );

});

    if (form) {

        form.removeEventListener(

            "submit",

            handleSubmit

        );

        form.addEventListener(

            "submit",

            handleSubmit

        );

    }

}

function handleClick(event) {

    if (event.target.closest("#newTicketBtn")) {

        showForm();

        return;

    }

    if (

        event.target.closest("#cancelTicketBtn") ||

        event.target.closest("#cancelTicketBtnSecondary")

    ) {

        hideForm();

    }

}

async function handleSubmit(event) {

    event.preventDefault();

   const ticket = {

    startedAt: jobStartedAt,

    title: stripHtml(

        document

            .getElementById("ticketTitle")

            .value

            .trim()

    ),

    customer: stripHtml(

        document

            .getElementById("ticketCustomer")

            .value

            .trim()

    ),

    category: stripHtml(

        document

            .getElementById("ticketCategory")

            .value

            .trim()

    ),

    assignee: stripHtml(

        document

            .getElementById("ticketAssignee")

            .value

            .trim()

    ),

    status:

        document.getElementById("ticketStatus").value,

    priority:

        document.getElementById("ticketPriority").value

};

    /*
     * Validation
     */

    const validation = validateTicket(ticket);

    if (!validation.valid) {

        const message =

            Object.values(

                validation.errors

            )[0];

        const jobs = get("jobs") || [];

        jobs.push({

            id: Date.now(),

            name: "Ticket Validation",

            type: "Validation",

            status: "Failed",
createdAt: jobStartedAt,

completedAt: new Date().toISOString(),

duration:

    new Date().getTime() -

    new Date(jobStartedAt).getTime(),

            message

        });

        set("jobs", jobs);

        alert(message);

        return;

    }

    /*
     * Duplicate Title
     */

    const unique = await isUniqueTitle(

        ticket.title

    );

    if (!unique) {

        const jobs = get("jobs") || [];

        jobs.push({

            id: Date.now(),

            name: "Duplicate Title Check",

            type: "Validation",

            status: "Failed",

           createdAt: jobStartedAt,

completedAt: new Date().toISOString(),

duration:

    new Date().getTime() -

    new Date(jobStartedAt).getTime(),

            message: "Ticket title already exists."

        });

        set("jobs", jobs);

        alert(

            "Ticket title already exists."

        );

        return;

    }

    /*
     * Create Ticket
     */

    try {

        await createTicket(ticket);
       removePreference(DRAFT_KEY);
        hideForm();

    }

   catch (error) {

    console.error(error);

    alert(

        "Unable to create ticket."

    );

}

}