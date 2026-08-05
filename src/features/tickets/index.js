import { get, set } from "../../core/store.js";
import { searchTickets } from "../../utils/search.js";
import { renderTicketTable } from "../../ui/components/ticketTable.js";
import { requestManager } from "../../core/requestManager.js";
import { httpClient } from "../../api/httpClient.js";
import { debounce } from "../../utils/debounce.js";
import { throttle } from "../../utils/throttle.js";
import { addToQueue } from "../../storage/offlineQueue.js";
import { escapeHtml } from "../../core/security.js";
import { measure, nextFrame } from "../../utils/performance.js";
import { addJob } from "../jobs/index.js";
import {
    getCustomers,
    addCustomer,
    setCustomers
} from "../customers/index.js";
import { addAuditLog } from "../auditLogs/index.js";
import Swal from "sweetalert2";

/*
|--------------------------------------------------------------------------
| Filters
|--------------------------------------------------------------------------
*/
let filters = {
    search: "",
    status: "All",
    priority: "All"
};

/*
|--------------------------------------------------------------------------
| SweetAlert Check
|--------------------------------------------------------------------------
*/
function ensureSwal() {
    if (typeof window === "undefined") {
        return false;
    }

    if (typeof Swal === "undefined") {
        return false;
    }

    if (import.meta?.env?.MODE === "test") {
        return false;
    }

    return true;
}

/*
|--------------------------------------------------------------------------
| Create Ticket
|--------------------------------------------------------------------------
*/
export async function createTicket(ticket) {
    // Validation (required for tests)
    if (!ticket || typeof ticket !== "object") {
        throw new Error("Invalid ticket.");
    }

    if (!ticket.title || !ticket.priority || !ticket.status) {
        throw new Error("Invalid ticket.");
    }

    const jobs = get("jobs") || [];

    const job = {
        id: Date.now(),
        name: "Create Ticket",
        type: "Ticket",
        priority: ticket.priority || "Medium",
        status: "Queued",
        createdAt: ticket.startedAt || new Date().toISOString(),
        completedAt: null,
        duration: null
    };

    jobs.push(job);
    set("jobs", jobs);

    try {
        job.status = "Running";
        set("jobs", jobs);

        // Try API (non-blocking for local creation)
        try {
            await requestManager.enqueue(() =>
                httpClient.post("/tickets", ticket)
            );
        } catch (apiError) {
            console.warn("API create ticket failed, continuing locally.", apiError);
        }

        /*
        |--------------------------------------------------------------------------
        | Offline Support
        |--------------------------------------------------------------------------
        */
        if (typeof navigator !== "undefined" && !navigator.onLine) {
            addToQueue({
                type: "CREATE_TICKET",
                endpoint: "/tickets",
                method: "POST",
                payload: ticket
            });

            job.status = "Queued";
            job.completedAt = new Date().toISOString();
            job.duration =
                new Date(job.completedAt).getTime() -
                new Date(job.createdAt).getTime();

            set("jobs", jobs);

            if (ensureSwal()) {
                Swal.fire({
                    icon: "info",
                    title: "Offline",
                    text: "Ticket saved to offline queue.",
                    toast: true,
                    timer: 2500,
                    position: "top-end",
                    showConfirmButton: false
                });
            }

            return null;
        }

        /*
        |--------------------------------------------------------------------------
        | Create Ticket (Local Store)
        |--------------------------------------------------------------------------
        */
        const tickets = get("tickets") || [];

        const lastId = tickets.length
            ? Math.max(...tickets.map(t => Number(t.id) || 0))
            : 0;

        const newTicket = {
            id: lastId + 1,
            createdAt: new Date().toISOString(),
            ...ticket
        };

        set("tickets", [...tickets, newTicket]);

        /*
        |--------------------------------------------------------------------------
        | Audit Log
        |--------------------------------------------------------------------------
        */
        addAuditLog({
            user: "System",
            action: "Created Ticket",
            module: "Tickets",
            details: `Ticket "${newTicket.title}" created.`
        });

        /*
        |--------------------------------------------------------------------------
        | Auto Create Customer
        |--------------------------------------------------------------------------
        */
        if (newTicket.customer) {
            const customers = getCustomers() || [];

            const exists = customers.some(
                customer =>
                    customer.name &&
                    customer.name.trim().toLowerCase() ===
                    String(newTicket.customer).trim().toLowerCase()
            );

            if (!exists) {
                const lastCustomerId = customers.length
                    ? Math.max(...customers.map(c => Number(c.id) || 0))
                    : 0;

                addCustomer({
                    id: lastCustomerId + 1,
                    name: newTicket.customer,
                    email: "",
                    createdAt: new Date().toISOString()
                });
            }
        }

        if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("ticketsUpdated"));
        }

        /*
        |--------------------------------------------------------------------------
        | Complete Job
        |--------------------------------------------------------------------------
        */
        job.name = `Create Ticket #${newTicket.id}`;
        job.priority = newTicket.priority;
        job.status = "Completed";
        job.completedAt = new Date().toISOString();
        job.duration =
            new Date(job.completedAt).getTime() -
            new Date(job.createdAt).getTime();

        set("jobs", jobs);

        // Safe render (skip in tests / when DOM not ready)
        try {
            renderTickets();
        } catch (e) {
            // ignore in test environment
        }

        if (ensureSwal()) {
            await Swal.fire({
                icon: "success",
                title: "Ticket Created",
                text: `Ticket #${newTicket.id} created successfully.`,
                toast: true,
                timer: 2500,
                position: "top-end",
                showConfirmButton: false
            });
        }

        // Important: return the created ticket (required by tests)
        return newTicket;

    } catch (error) {
        job.status = "Failed";
        job.completedAt = new Date().toISOString();
        job.duration =
            new Date(job.completedAt).getTime() -
            new Date(job.createdAt).getTime();

        set("jobs", jobs);

        if (ensureSwal()) {
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: error.message || "Unable to create ticket."
            });
        }

        throw error;
    }
}

/*
|--------------------------------------------------------------------------
| Render Tickets
|--------------------------------------------------------------------------
*/
export function renderTickets() {
    measure("Render Tickets", () => {
        let tickets = [...(get("tickets") || [])];

        if (filters.search) {
            tickets = searchTickets(tickets, filters.search);
        }

        if (filters.status !== "All") {
            tickets = tickets.filter(
                ticket => ticket.status === filters.status
            );
        }

        if (filters.priority !== "All") {
            tickets = tickets.filter(
                ticket => ticket.priority === filters.priority
            );
        }

        const container = document.getElementById("ticketTableContainer");

        if (!container) {
            return;
        }

        nextFrame(() => {
            container.innerHTML = renderTicketTable(tickets);
            attachEvents();
        });
    });
}

/*
|--------------------------------------------------------------------------
| Debounced Search
|--------------------------------------------------------------------------
*/
const debouncedSearch = debounce(() => {
    renderTickets();
}, 300);

/*
|--------------------------------------------------------------------------
| Events
|--------------------------------------------------------------------------
*/
function attachEvents() {
    const search = document.getElementById("ticketSearch");

    if (search) {
        search.oninput = event => {
            filters.search = event.target.value;
            debouncedSearch();
        };
    }

    const status = document.getElementById("statusFilter");

    if (status) {
        status.onchange = event => {
            filters.status = event.target.value;
            renderTickets();
        };
    }

    const priority = document.getElementById("priorityFilter");

    if (priority) {
        priority.onchange = event => {
            filters.priority = event.target.value;
            renderTickets();
        };
    }

    /*
    |--------------------------------------------------------------------------
    | View Ticket
    |--------------------------------------------------------------------------
    */
    document.querySelectorAll(".view-btn").forEach(button => {
        button.onclick = throttle(() => {
            const id = Number(button.dataset.id);

            const ticket = (get("tickets") || []).find(
                t => Number(t.id) === id
            );

            if (!ticket) {
                return;
            }

            const created = ticket.createdAt
                ? new Date(ticket.createdAt).toLocaleString()
                : "N/A";

            if (ensureSwal()) {
                Swal.fire({
                    title: `Ticket #${ticket.id}`,
                    html: `
                        <div style="text-align:left;line-height:1.8;">
                            <p><strong>Title:</strong> ${escapeHtml(ticket.title)}</p>
                            <p><strong>Customer:</strong> ${escapeHtml(ticket.customer)}</p>
                            <p><strong>Category:</strong> ${escapeHtml(ticket.category)}</p>
                            <p><strong>Assignee:</strong> ${escapeHtml(ticket.assignee)}</p>
                            <p><strong>Status:</strong> ${escapeHtml(ticket.status)}</p>
                            <p><strong>Priority:</strong> ${escapeHtml(ticket.priority)}</p>
                            <p><strong>Created:</strong> ${escapeHtml(created)}</p>
                        </div>
                    `,
                    confirmButtonText: "Close",
                    confirmButtonColor: "#2563eb"
                });
            }
        }, 500);
    });

    /*
    |--------------------------------------------------------------------------
    | Edit Ticket
    |--------------------------------------------------------------------------
    */
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.onclick = async () => {
            const id = Number(button.dataset.id);
            const tickets = get("tickets") || [];

            const ticket = tickets.find(t => Number(t.id) === id);

            if (!ticket || !ensureSwal()) {
                return;
            }

            const result = await Swal.fire({
                title: `Edit Ticket #${ticket.id}`,
                html: `
                    <input
                        id="editTitle"
                        class="swal2-input"
                        placeholder="Title"
                        value="${escapeAttr(ticket.title)}"
                    >
                    <input
                        id="editCustomer"
                        class="swal2-input"
                        placeholder="Customer"
                        value="${escapeAttr(ticket.customer)}"
                    >
                    <input
                        id="editCategory"
                        class="swal2-input"
                        placeholder="Category"
                        value="${escapeAttr(ticket.category)}"
                    >
                    <input
                        id="editAssignee"
                        class="swal2-input"
                        placeholder="Assignee"
                        value="${escapeAttr(ticket.assignee)}"
                    >
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Save",
                preConfirm: () => {
                    return {
                        title: escapeHtml(
                            document.getElementById("editTitle").value.trim()
                        ),
                        customer: escapeHtml(
                            document.getElementById("editCustomer").value.trim()
                        ),
                        category: escapeHtml(
                            document.getElementById("editCategory").value.trim()
                        ),
                        assignee: escapeHtml(
                            document.getElementById("editAssignee").value.trim()
                        )
                    };
                }
            });

            if (!result.isConfirmed) {
                return;
            }

            const updatedTickets = tickets.map(item =>
                item.id === id
                    ? { ...item, ...result.value }
                    : item
            );

            set("tickets", updatedTickets);

            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("ticketsUpdated"));
            }

            addAuditLog({
                user: "System",
                action: "Updated Ticket",
                module: "Tickets",
                details: `Ticket #${ticket.id} updated.`
            });

            renderTickets();
        };
    });

    /*
    |--------------------------------------------------------------------------
    | Delete Ticket
    |--------------------------------------------------------------------------
    */
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.onclick = async () => {
            if (!ensureSwal()) {
                return;
            }

            const id = Number(button.dataset.id);

            const result = await Swal.fire({
                title: "Delete Ticket?",
                text: "This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                confirmButtonColor: "#dc2626"
            });

            if (!result.isConfirmed) {
                return;
            }

            const tickets = (get("tickets") || []).filter(
                t => Number(t.id) !== id
            );

            set("tickets", tickets);

            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("ticketsUpdated"));
            }

            addAuditLog({
                user: "System",
                action: "Deleted Ticket",
                module: "Tickets",
                details: `Ticket #${id} deleted.`
            });

            renderTickets();
        };
    });
}

/*
|--------------------------------------------------------------------------
| Escape Attribute
|--------------------------------------------------------------------------
*/
function escapeAttr(value) {
    return escapeHtml(value ?? "").replace(/\n/g, " ");
}