import {

    getJobs,
    cancelJob,
    removeJob,
    pauseScheduler,
    resumeScheduler,
    schedulerStatus

} from "./index.js";
import Swal from "sweetalert2";
/**
 * ---------------------------------------------------------
 * Render Jobs Page
 * ---------------------------------------------------------
 */
export function renderJobsPage(container) {

    const jobs = getJobs();

    const scheduler = schedulerStatus();

    container.innerHTML = `

        <section class="page-header">

            <div>

                <h1>Jobs</h1>

                <p>

                    Monitor background operations and task execution.

                </p>

            </div>

        </section>

               <div class="panel">

            <div class="panel-header">

                <h3>

                    Background Jobs

                </h3>

            </div>

            <table class="table">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Job</th>

                        <th>Type</th>

                        <th>Priority</th>

                        <th>Status</th>

                        <th>Started</th>

                        <th>Completed</th>

                        <th>Duration</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    ${jobs.length

                        ? jobs.map(job => `

                            <tr>

                                <td>

                                    #${job.id}

                                </td>

                                <td>

                                    ${job.name || "-"}

                                </td>

                                <td>

                                    ${job.type || "-"}

                                </td>

                                <td>

                                    ${job.priority ?? "-"}

                                </td>

                                <td>

                                    <span

                                        class="badge status-${(job.status || "queued").toLowerCase()}"

                                    >

                                        ${job.status || "Queued"}

                                    </span>

                                </td>

                                <td>

                                    ${formatDate(job.createdAt)}

                                </td>

                                <td>

                                    ${formatDate(job.completedAt)}

                                </td>

                                <td>

                                    ${formatDuration(job.duration)}

                                </td>

                                <td>

                                    ${job.status === "Queued"

                                        ? `

                                            <button

                                                class="secondary-btn cancel-job"

                                                data-id="${job.id}"

                                            >

                                                Cancel

                                            </button>

                                            <button

                                                class="danger-btn remove-job"

                                                data-id="${job.id}"

                                                style="margin-left:8px;"

                                            >

                                                Remove

                                            </button>

                                        `

                                        : `

                                            <button

                                                class="danger-btn remove-job"

                                                data-id="${job.id}"

                                            >

                                                Remove

                                            </button>

                                        `

                                    }

                                </td>

                            </tr>

                            ${job.error

                                ? `

                                    <tr>

                                        <td colspan="9">

                                            <strong>Error:</strong>

                                            ${job.error}

                                        </td>

                                    </tr>

                                `

                                : ""

                            }

                        `).join("")

                        : `

                            <tr>

                                <td colspan="9">

                                    No jobs available.

                                </td>

                            </tr>

                        `

                    }

                </tbody>

            </table>

        </div>

    `;

    bindEvents(container);

}
/**
 * ---------------------------------------------------------
 * Bind Events
 * ---------------------------------------------------------
 */
function bindEvents(container) {

    /*
    |--------------------------------------------------------------------------
    | Pause Scheduler
    |--------------------------------------------------------------------------
    */

    container
        .querySelector("#pauseSchedulerBtn")
        ?.addEventListener("click", () => {

            pauseScheduler();

            renderJobsPage(container);

        });

    /*
    |--------------------------------------------------------------------------
    | Resume Scheduler
    |--------------------------------------------------------------------------
    */

    container
        .querySelector("#resumeSchedulerBtn")
        ?.addEventListener("click", () => {

            resumeScheduler();

            renderJobsPage(container);

        });

    /*
    |--------------------------------------------------------------------------
    | Cancel Job
    |--------------------------------------------------------------------------
    */

    container
        .querySelectorAll(".cancel-job")
        .forEach(button => {

            button.addEventListener("click", () => {

                const id = Number(button.dataset.id);

                cancelJob(id);

                renderJobsPage(container);

            });

        });

    /*
    |--------------------------------------------------------------------------
    | Remove Job
    |--------------------------------------------------------------------------
    */

   /*
|--------------------------------------------------------------------------
| Remove Job
|--------------------------------------------------------------------------
*/

container
    .querySelectorAll(".remove-job")
    .forEach(button => {

        button.addEventListener("click", async () => {

            const id = Number(button.dataset.id);

            const result = await Swal.fire({

                title: "Remove Job?",

                text: "This job will be permanently removed.",

                icon: "warning",

                showCancelButton: true,

                confirmButtonText: "Remove",

                cancelButtonText: "Cancel",

                confirmButtonColor: "#dc2626",

                cancelButtonColor: "#6b7280"

            });

            if (!result.isConfirmed) {

                return;

            }

            await removeJob(id);

            await Swal.fire({

                icon: "success",

                title: "Removed",

                text: "Job removed successfully.",

                timer: 1500,

                showConfirmButton: false

            });

            renderJobsPage(container);

        });

    });

}

/**
 * ---------------------------------------------------------
 * Format Date
 * ---------------------------------------------------------
 */
function formatDate(date) {

    if (!date) {

        return "-";

    }

    return new Date(date).toLocaleString();

}

/**
 * ---------------------------------------------------------
 * Format Duration
 * ---------------------------------------------------------
 */
function formatDuration(duration) {

    if (duration === null || duration === undefined) {

        return "-";

    }

    if (duration < 1000) {

        return `${duration} ms`;

    }

    if (duration < 60000) {

        return `${(duration / 1000).toFixed(2)} s`;

    }

    const minutes = Math.floor(duration / 60000);

    const seconds = Math.floor(

        (duration % 60000) / 1000

    );

    return `${minutes}m ${seconds}s`;

}