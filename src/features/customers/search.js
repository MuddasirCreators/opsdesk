/**
 * ---------------------------------------------------------
 * Search Customers
 * ---------------------------------------------------------
 */
export function searchCustomers(customers, query) {

    if (!Array.isArray(customers)) {

        return [];

    }

    if (!query) {

        return customers;

    }

    const keyword = query

        .trim()

        .toLowerCase();

    return customers.filter(customer => {

        return (

            String(customer.id)

                .toLowerCase()

                .includes(keyword)

            ||

            (customer.name || "")

                .toLowerCase()

                .includes(keyword)

            ||

            (customer.email || "")

                .toLowerCase()

                .includes(keyword)

        );

    });

}