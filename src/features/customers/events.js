import Swal from "sweetalert2";

import {

    getCustomers,

    updateCustomer,

    removeCustomer

} from "./index.js";

import {

    validateCustomer

} from "./validation.js";

/**
 * ---------------------------------------------------------
 * Initialize Customer Events
 * ---------------------------------------------------------
 */

export function initializeCustomerEvents() {

    bindViewEvents();

    bindEditEvents();

    bindDeleteEvents();

}

/**
 * ---------------------------------------------------------
 * View Customer
 * ---------------------------------------------------------
 */

function bindViewEvents() {

    document.querySelectorAll(".view-btn").forEach(button => {

        button.onclick = () => {

            const id = Number(button.dataset.id);

            const customer = getCustomers().find(

                customer => Number(customer.id) === id

            );

            if (!customer) {

                return;

            }

            Swal.fire({

                title: customer.name,

                html: `

                    <div style="text-align:left;line-height:1.8;">

                        <p><strong>ID:</strong> ${customer.id}</p>

                        <p><strong>Name:</strong> ${customer.name}</p>

                        <p><strong>Email:</strong> ${customer.email || "-"}</p>

                        <p><strong>Created:</strong> ${customer.createdAt || "-"}</p>

                    </div>

                `,

                confirmButtonText: "Close"

            });

        };

    });

}

/**
 * ---------------------------------------------------------
 * Edit Customer
 * ---------------------------------------------------------
 */

function bindEditEvents() {

    document.querySelectorAll(".edit-btn").forEach(button => {

        button.onclick = async () => {

            const id = Number(button.dataset.id);

            const customer = getCustomers().find(

                customer => Number(customer.id) === id

            );

            if (!customer) {

                return;

            }

            const result = await Swal.fire({

                title: "Edit Customer",

                html: `

                    <input

                        id="customerName"

                        class="swal2-input"

                        value="${customer.name}"

                    >

                    <input

                        id="customerEmail"

                        class="swal2-input"

                        value="${customer.email || ""}"

                    >

                `,

                showCancelButton: true,

                confirmButtonText: "Save",

                preConfirm: () => ({

                    id,

                    name: document.getElementById(

                        "customerName"

                    ).value.trim(),

                    email: document.getElementById(

                        "customerEmail"

                    ).value.trim()

                })

            });

            if (!result.isConfirmed) {

                return;

            }

            const validation = validateCustomer(

                result.value

            );

            if (!validation.valid) {

                Swal.fire({

                    icon: "error",

                    title: Object.values(

                        validation.errors

                    )[0]

                });

                return;

            }

            updateCustomer(

                result.value

            );

            Swal.fire({

                icon: "success",

                title: "Customer Updated",

                timer: 1500,

                showConfirmButton: false

            });

        };

    });

}

/**
 * ---------------------------------------------------------
 * Delete Customer
 * ---------------------------------------------------------
 */

function bindDeleteEvents() {

    document.querySelectorAll(".delete-btn").forEach(button => {

        button.onclick = async () => {

            const id = Number(button.dataset.id);

            const result = await Swal.fire({

                title: "Delete Customer?",

                text: "This action cannot be undone.",

                icon: "warning",

                showCancelButton: true,

                confirmButtonText: "Delete",

                confirmButtonColor: "#dc2626"

            });

            if (!result.isConfirmed) {

                return;

            }

            removeCustomer(id);

            Swal.fire({

                icon: "success",

                title: "Customer Deleted",

                timer: 1500,

                showConfirmButton: false

            });

        };

    });

}