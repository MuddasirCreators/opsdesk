import Swal from "sweetalert2";

import {

    getCustomers,

    setCustomers,

    renderCustomers

} from "./index.js";

/**
 * Bind Customer Events
 */
export function bindCustomerEvents() {

    bindView();

    bindEdit();

    bindDelete();

}

/**
 * View Customer
 */
function bindView() {

    document.querySelectorAll(

        ".view-btn"

    ).forEach(button => {

        button.onclick = () => {

            const id = Number(

                button.dataset.id

            );

            const customer = getCustomers().find(

                customer =>

                    Number(customer.id) === id

            );

            if (!customer) {

                return;

            }

            Swal.fire({

                title: customer.name,

                html: `

                    <div style="text-align:left">

                        <p>

                            <strong>ID:</strong>

                            ${customer.id}

                        </p>

                        <p>

                            <strong>Name:</strong>

                            ${customer.name}

                        </p>

                        <p>

                            <strong>Email:</strong>

                            ${customer.email || "-"}

                        </p>

                        <p>

                            <strong>Created:</strong>

                            ${customer.createdAt || "-"}

                        </p>

                    </div>

                `,

                confirmButtonText: "Close"

            });

        };

    });

}

/**
 * Edit Customer
 */
function bindEdit() {

    document.querySelectorAll(

        ".edit-btn"

    ).forEach(button => {

        button.onclick = async () => {

            const id = Number(

                button.dataset.id

            );

            const customers = getCustomers();

            const customer = customers.find(

                customer =>

                    Number(customer.id) === id

            );

            if (!customer) {

                return;

            }

            const result = await Swal.fire({

                title: "Edit Customer",

                input: "text",

                inputValue: customer.name,

                showCancelButton: true,

                confirmButtonText: "Save"

            });

            if (!result.isConfirmed) {

                return;

            }

            customer.name =

                result.value.trim();

            setCustomers(customers);

            renderCustomers();

        };

    });

}

/**
 * Delete Customer
 */
function bindDelete() {

    document.querySelectorAll(

        ".delete-btn"

    ).forEach(button => {

        button.onclick = async () => {

            const id = Number(

                button.dataset.id

            );

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

            const customers = getCustomers().filter(

                customer =>

                    Number(customer.id) !== id

            );

            setCustomers(

                customers

            );

            renderCustomers();

            Swal.fire({

                icon: "success",

                title: "Deleted",

                timer: 1500,

                showConfirmButton: false

            });

        };

    });

}