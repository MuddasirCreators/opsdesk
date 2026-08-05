import { get, set } from "../../core/store.js";

import {
    renderCustomerTable
} from "../../ui/components/customerTable.js";

import {
    initializeCustomerEvents
} from "./events.js";

import {
    addAuditLog
} from "../auditLogs/index.js";

/**
 * ---------------------------------------------------------
 * Get All Customers
 * ---------------------------------------------------------
 */
export function getCustomers() {

    return get("customers") || [];

}

/**
 * ---------------------------------------------------------
 * Set Customers
 * ---------------------------------------------------------
 */
export function setCustomers(customers) {

    set("customers", customers);

}

/**
 * ---------------------------------------------------------
 * Add Customer
 * ---------------------------------------------------------
 */
export function addCustomer(customer) {

    const customers = getCustomers();

    customers.push({

        id: customer.id,

        name: customer.name,

        email: customer.email || "",

        createdAt:

            customer.createdAt ||

            new Date().toISOString()

    });

    setCustomers(customers);

    addAuditLog({

        user: "System",

        action: "Added Customer",

        module: "Customers",

        details: `Customer "${customer.name}" added.`

    });

    renderCustomers();

}

/**
 * ---------------------------------------------------------
 * Find Customer By ID
 * ---------------------------------------------------------
 */
export function findCustomerById(id) {

    return getCustomers().find(

        customer =>

            Number(customer.id) === Number(id)

    );

}

/**
 * ---------------------------------------------------------
 * Update Customer
 * ---------------------------------------------------------
 */
export function updateCustomer(updatedCustomer) {

    const customers = getCustomers();

    const index = customers.findIndex(

        customer =>

            Number(customer.id) ===

            Number(updatedCustomer.id)

    );

    if (index === -1) {

        return false;

    }

    customers[index] = {

        ...customers[index],

        ...updatedCustomer

    };

    setCustomers(customers);

    addAuditLog({

        user: "System",

        action: "Updated Customer",

        module: "Customers",

        details: `Customer "${updatedCustomer.name}" updated.`

    });

    renderCustomers();

    return true;

}

/**
 * ---------------------------------------------------------
 * Remove Customer
 * ---------------------------------------------------------
 */
export function removeCustomer(id) {

    const customers = getCustomers();

    const customer = customers.find(

        customer =>

            Number(customer.id) === Number(id)

    );

    const filtered = customers.filter(

        customer =>

            Number(customer.id) !== Number(id)

    );

    setCustomers(filtered);

    addAuditLog({

        user: "System",

        action: "Deleted Customer",

        module: "Customers",

        details: customer

            ? `Customer "${customer.name}" deleted.`

            : `Customer #${id} deleted.`

    });

    renderCustomers();

}

/**
 * ---------------------------------------------------------
 * Render Customers
 * ---------------------------------------------------------
 */
export function renderCustomers() {

    const container = document.getElementById(

        "customersContainer"

    );

    if (!container) {

        return;

    }

    const customers = getCustomers();

    container.innerHTML =

        renderCustomerTable(

            customers

        );

    initializeCustomerEvents();

}