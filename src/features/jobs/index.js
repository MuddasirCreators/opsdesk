import { get, set } from "../../core/store.js";

import { requestManager } from "../../core/requestManager.js";
import { taskScheduler } from "../../core/taskScheduler.js";

import { httpClient } from "../../api/httpClient.js";
import { ENDPOINTS } from "../../api/endpoints.js";

import {

    getCache,

    setCache,

    removeCache

} from "../../utils/cache.js";

import {

    measureAsync

} from "../../utils/performance.js";

import {

    addAuditLog

} from "../auditLogs/index.js";

/**
 * Load Jobs
 */
export async function loadJobs() {

    return measureAsync(

        "Load Jobs",

        async () => {

            try {

                const cached = getCache("jobs");

                if (cached) {

                    return cached;

                }

                const response =

                    await requestManager.enqueue(() =>

                        httpClient.get(

                            ENDPOINTS.JOBS

                        )

                    );

                setCache(

                    "jobs",

                    response,

                    10000

                );

                return response;

            }

            catch (error) {

                console.error(

                    "Failed to load jobs.",

                    error

                );

            }

        }

    );

}

/**
 * Get Jobs
 */
export function getJobs() {

    return get("jobs") || [];

}

/**
 * Save Jobs
 */
export function setJobs(jobs) {

    removeCache("jobs");

    set(

        "jobs",

        jobs

    );

}

/**
 * Add Job
 */
export async function addJob(job) {

    job.createdAt ??=

        new Date().toISOString();

    job.priority ??= 5;

    job.timeout ??= 5000;

    job.status = "Queued";

    const jobs = getJobs();

    const schedulerTask = taskScheduler.add(

        async () => {

            job.status = "Running";

            job.startedAt =

                new Date().toISOString();

            setJobs(jobs);

            await requestManager.enqueue(() =>

                httpClient.post(

                    ENDPOINTS.JOBS,

                    job

                )

            );

            job.status = "Completed";

            job.completedAt =

                new Date().toISOString();

            job.duration =

                new Date(

                    job.completedAt

                ).getTime()

                -

                new Date(

                    job.startedAt

                ).getTime();

            setJobs(jobs);

            addAuditLog({

                user: "System",

                action: "Completed Job",

                module: "Jobs",

                details: `Job "${job.name}" completed.`

            });

            return job;

        },

        {

            priority: job.priority,

            timeout: job.timeout

        }

    );

    job.schedulerId = schedulerTask.id;

    jobs.push(job);

    setJobs(jobs);

    addAuditLog({

        user: "System",

        action: "Created Job",

        module: "Jobs",

        details: `Job "${job.name}" created.`

    });

    try {

        await schedulerTask.promise;

    }

    catch (error) {

        job.status = "Failed";

        job.completedAt =

            new Date().toISOString();

        job.duration =

            new Date(

                job.completedAt

            ).getTime()

            -

            new Date(

                job.startedAt ||

                job.createdAt

            ).getTime();

        job.error =

            error.message ||

            "Unknown error.";

        setJobs(jobs);

        addAuditLog({

            user: "System",

            action: "Failed Job",

            module: "Jobs",

            details: `Job "${job.name}" failed.`

        });

        throw error;

    }

}

/**
 * Cancel Job
 */
export function cancelJob(id) {

    const jobs = getJobs();

    const job = jobs.find(

        job =>

            Number(job.id) === Number(id)

    );

    if (!job) {

        return false;

    }

    if (

        job.status === "Completed" ||

        job.status === "Cancelled"

    ) {

        return false;

    }

    if (job.schedulerId) {

        taskScheduler.cancel(

            job.schedulerId

        );

    }

    job.status = "Cancelled";

    job.completedAt =

        new Date().toISOString();

    job.duration =

        new Date(

            job.completedAt

        ).getTime()

        -

        new Date(

            job.startedAt ||

            job.createdAt

        ).getTime();

    setJobs(jobs);

    addAuditLog({

        user: "System",

        action: "Cancelled Job",

        module: "Jobs",

        details: `Job "${job.name}" cancelled.`

    });

    return true;

}

/**
 * Find Job
 */
export function findJobById(id) {

    return getJobs().find(

        job =>

            Number(job.id) === Number(id)

    );

}

/**
 * Remove Job
 */
export async function removeJob(id) {

    try {

        const jobs = getJobs();

        const job = jobs.find(

            job =>

                Number(job.id) === Number(id)

        );

        await requestManager.enqueue(() =>

            httpClient.delete(

                `${ENDPOINTS.JOBS}/${id}`

            )

        );

        const updatedJobs = jobs.filter(

            job =>

                Number(job.id) !== Number(id)

        );

        setJobs(updatedJobs);

        addAuditLog({

            user: "System",

            action: "Removed Job",

            module: "Jobs",

            details: job

                ? `Job "${job.name}" removed.`

                : `Job #${id} removed.`

        });

    }

    catch (error) {

        console.error(

            "Unable to remove job.",

            error

        );

    }

}

/**
 * Pause Scheduler
 */
export function pauseScheduler() {

    taskScheduler.pause();

}

/**
 * Resume Scheduler
 */
export function resumeScheduler() {

    taskScheduler.resume();

}

/**
 * Scheduler Status
 */
export function schedulerStatus() {

    return taskScheduler.status();

}