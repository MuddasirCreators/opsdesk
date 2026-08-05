import {

    describe,
    it,
    expect,
    beforeEach

} from "vitest";

import {

    addCustomer,
    getCustomers,
    updateCustomer,
    removeCustomer,
    findCustomerById

} from "../../src/features/customers/index.js";

import {

    reset

} from "../../src/core/store.js";

describe("Customer CRUD Integration", () => {

    beforeEach(() => {

        reset();

    });

    /*
    |--------------------------------------------------------------------------
    | Create Customer
    |--------------------------------------------------------------------------
    */

    it("should create a customer", () => {

        addCustomer({

            id: 1,

            name: "John Smith",

            email: "john@example.com"

        });

        const customers = getCustomers();

        expect(customers).toHaveLength(1);

        expect(customers[0].name).toBe(

            "John Smith"

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Find Customer
    |--------------------------------------------------------------------------
    */

    it("should find customer by id", () => {

        addCustomer({

            id: 10,

            name: "Ali",

            email: "ali@test.com"

        });

        const customer = findCustomerById(10);

        expect(customer).toBeDefined();

        expect(customer.name).toBe(

            "Ali"

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Update Customer
    |--------------------------------------------------------------------------
    */

    it("should update customer", () => {

        addCustomer({

            id: 5,

            name: "Ahmed",

            email: "old@test.com"

        });

        const updated = updateCustomer({

            id: 5,

            name: "Ahmed Khan",

            email: "new@test.com"

        });

        expect(updated).toBe(true);

        const customer = findCustomerById(5);

        expect(customer.name).toBe(

            "Ahmed Khan"

        );

        expect(customer.email).toBe(

            "new@test.com"

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Delete Customer
    |--------------------------------------------------------------------------
    */

    it("should remove customer", () => {

        addCustomer({

            id: 20,

            name: "Sara",

            email: "sara@test.com"

        });

        removeCustomer(20);

        expect(

            getCustomers()

        ).toHaveLength(0);

    });

    /*
    |--------------------------------------------------------------------------
    | Update Missing Customer
    |--------------------------------------------------------------------------
    */

    it("should return false when updating unknown customer", () => {

        const result = updateCustomer({

            id: 999,

            name: "Unknown"

        });

        expect(result).toBe(false);

    });

    /*
    |--------------------------------------------------------------------------
    | Remove Missing Customer
    |--------------------------------------------------------------------------
    */

    it("should not throw when removing unknown customer", () => {

        expect(() =>

            removeCustomer(999)

        ).not.toThrow();

    });

});