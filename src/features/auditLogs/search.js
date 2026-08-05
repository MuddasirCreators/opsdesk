/**
 * ---------------------------------------------------------
 * Search Audit Logs
 * ---------------------------------------------------------
 */
export function searchAuditLogs(logs, query) {

    if (!Array.isArray(logs)) {

        return [];

    }

    if (!query) {

        return logs;

    }

    const keyword = query

        .trim()

        .toLowerCase();

    return logs.filter(log => {

        return (

            String(log.id)

                .toLowerCase()

                .includes(keyword)

            ||

            (log.user || "")

                .toLowerCase()

                .includes(keyword)

            ||

            (log.action || "")

                .toLowerCase()

                .includes(keyword)

            ||

            (log.module || "")

                .toLowerCase()

                .includes(keyword)

            ||

            (log.details || "")

                .toLowerCase()

                .includes(keyword)

        );

    });

}