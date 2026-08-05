import { get, set } from "../../core/store.js";

import { validateTicket } from "./validation.js";

/**
 * ---------------------------------------------------------
 * Import JSON
 * ---------------------------------------------------------
 */

export function importJson(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = event => {

            try {

                const tickets = JSON.parse(

                    event.target.result

                );

                if (!Array.isArray(tickets)) {

                    throw new Error(

                        "JSON file must contain an array."

                    );

                }

                const result = validateImportedTickets(

                    tickets

                );

                if (!result.valid) {

                    reject(

                        new Error(result.message)

                    );

                    return;

                }

                const current = get("tickets") || [];

                set(

                    "tickets",

                    [

                        ...current,

                        ...tickets

                    ]

                );

                resolve(tickets);

            }

            catch (error) {

                reject(error);

            }

        };

        reader.onerror = () => {

            reject(

                new Error(

                    "Unable to read JSON file."

                )

            );

        };

        reader.readAsText(file);

    });

}

/**
 * ---------------------------------------------------------
 * Validate Imported Tickets
 * ---------------------------------------------------------
 */

function validateImportedTickets(tickets) {

    for (let index = 0; index < tickets.length; index++) {

        const validation = validateTicket(

            tickets[index]

        );

        if (!validation.valid) {

            return {

                valid: false,

                message:

                    `Invalid ticket at row ${index + 1}.`

            };

        }

    }

    return {

        valid: true

    };

}

/**
 * ---------------------------------------------------------
 * Required Fields
 * ---------------------------------------------------------
 */

function hasRequiredFields(ticket) {

    return (

        ticket.title &&

        ticket.customer &&

        ticket.category &&

        ticket.assignee &&

        ticket.status &&

        ticket.priority

    );

}

/**
 * ---------------------------------------------------------
 * Normalize Ticket
 * ---------------------------------------------------------
 */

function normalizeTicket(ticket) {

    return {

        id:

            ticket.id ||

            Date.now() +

            Math.floor(

                Math.random() * 1000

            ),

        title:

            ticket.title?.trim() || "",

        customer:

            ticket.customer?.trim() || "",

        category:

            ticket.category?.trim() || "",

        assignee:

            ticket.assignee?.trim() || "",

        status:

            ticket.status || "Open",

        priority:

            ticket.priority || "Medium",

        createdAt:

            ticket.createdAt ||

            new Date().toISOString()

    };

}
/**
 * ---------------------------------------------------------
 * Import CSV
 * ---------------------------------------------------------
 */

export function importCsv(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = event => {

            try {

                const csv = event.target.result;

                const tickets = parseCsv(csv);

                const result = validateImportedTickets(tickets);

                if (!result.valid) {

                    reject(

                        new Error(result.message)

                    );

                    return;

                }

                const current = get("tickets") || [];

                set(

                    "tickets",

                    [

                        ...current,

                        ...tickets

                    ]

                );

                resolve(tickets);

            }

            catch (error) {

                reject(error);

            }

        };

        reader.onerror = () => {

            reject(

                new Error(

                    "Unable to read CSV file."

                )

            );

        };

        reader.readAsText(file);

    });

}

/**
 * ---------------------------------------------------------
 * Parse CSV
 * ---------------------------------------------------------
 */

function parseCsv(csv) {

    const lines = csv

        .trim()

        .split(/\r?\n/);

    if (lines.length < 2) {

        throw new Error(

            "CSV file is empty."

        );

    }

    const headers = lines[0]

        .split(",")

        .map(header =>

            header.trim()

        );

    const tickets = [];

    for (

        let index = 1;

        index < lines.length;

        index++

    ) {

        const values = lines[index]

            .split(",")

            .map(value =>

                value.trim()

            );

        if (

            values.length !== headers.length

        ) {

            throw new Error(

                `Invalid CSV row ${index + 1}.`

            );

        }

        const ticket = {};

        headers.forEach(

            (header, column) => {

                ticket[header] = values[column];

            }

        );

        if (

            !hasRequiredFields(ticket)

        ) {

            throw new Error(

                `Missing required fields in row ${index + 1}.`

            );

        }

        tickets.push(

            normalizeTicket(ticket)

        );

    }

    return tickets;

}

/**
 * ---------------------------------------------------------
 * CSV Headers
 * ---------------------------------------------------------
 */

export function getCsvHeaders() {

    return [

        "id",

        "title",

        "customer",

        "category",

        "assignee",

        "status",

        "priority",

        "createdAt"

    ];

}

/**
 * ---------------------------------------------------------
 * Validate CSV File
 * ---------------------------------------------------------
 */

export function validateCsv(file) {

    if (!file) {

        throw new Error(

            "No file selected."

        );

    }

    if (

        !file.name

            .toLowerCase()

            .endsWith(".csv")

    ) {

        throw new Error(

            "Please select a CSV file."

        );

    }

    return true;

}

/**
 * ---------------------------------------------------------
 * Validate JSON File
 * ---------------------------------------------------------
 */

export function validateJson(file) {

    if (!file) {

        throw new Error(

            "No file selected."

        );

    }

    if (

        !file.name

            .toLowerCase()

            .endsWith(".json")

    ) {

        throw new Error(

            "Please select a JSON file."

        );

    }

    return true;

}   
/**
 * ---------------------------------------------------------
 * Export JSON
 * ---------------------------------------------------------
 */

export function exportJson() {

    const tickets = get("tickets") || [];

    const json = JSON.stringify(

        tickets,

        null,

        4

    );

    downloadFile(

        json,

        "tickets.json",

        "application/json"

    );

}

/**
 * ---------------------------------------------------------
 * Export CSV
 * ---------------------------------------------------------
 */

export function exportCsv() {

    const tickets = get("tickets") || [];

    const headers = getCsvHeaders();

    const rows = [

        headers.join(",")

    ];

    tickets.forEach(ticket => {

        rows.push([

            ticket.id ?? "",

            escapeCsv(ticket.title),

            escapeCsv(ticket.customer),

            escapeCsv(ticket.category),

            escapeCsv(ticket.assignee),

            escapeCsv(ticket.status),

            escapeCsv(ticket.priority),

            ticket.createdAt ?? ""

        ].join(","));

    });

    downloadFile(

        rows.join("\n"),

        "tickets.csv",

        "text/csv"

    );

}

/**
 * ---------------------------------------------------------
 * Download File
 * ---------------------------------------------------------
 */

function downloadFile(

    content,

    fileName,

    mimeType

) {

    const blob = new Blob(

        [content],

        {

            type: `${mimeType};charset=utf-8`

        }

    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}

/**
 * ---------------------------------------------------------
 * Escape CSV Value
 * ---------------------------------------------------------
 */

function escapeCsv(value) {

    if (value === null || value === undefined) {

        return "";

    }

    const stringValue = String(value);

    if (

        stringValue.includes(",") ||

        stringValue.includes("\"") ||

        stringValue.includes("\n")

    ) {

        return `"${stringValue.replace(/"/g, "\"\"")}"`;

    }

    return stringValue;

}

/**
 * ---------------------------------------------------------
 * Export Helpers
 * ---------------------------------------------------------
 */

export function exportData(type = "json") {

    switch (type.toLowerCase()) {

        case "json":

            exportJson();

            break;

        case "csv":

            exportCsv();

            break;

        default:

            throw new Error(

                "Unsupported export format."

            );

    }

}

/**
 * ---------------------------------------------------------
 * Import Helpers
 * ---------------------------------------------------------
 */

export async function importData(

    file

) {

    if (!file) {

        throw new Error(

            "No file selected."

        );

    }

    if (

        file.name

            .toLowerCase()

            .endsWith(".json")

    ) {

        validateJson(file);

        return importJson(file);

    }

    if (

        file.name

            .toLowerCase()

            .endsWith(".csv")

    ) {

        validateCsv(file);

        return importCsv(file);

    }

    throw new Error(

        "Only JSON and CSV files are supported."

    );

}