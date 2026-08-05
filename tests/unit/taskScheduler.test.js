import { describe, it, expect, beforeEach } from "vitest";
import { taskScheduler } from "../../src/core/taskScheduler.js";
// ⚠️ Change the path above if your file is in a different location

describe("TaskScheduler", () => {

    beforeEach(() => {
        taskScheduler.clear();
        taskScheduler.paused = false;
        taskScheduler.running = 0;
        taskScheduler.nextId = 1;
    });

    it("should add a task and return an id + promise", async () => {
        const { id, promise } = taskScheduler.add(async () => "done");

        expect(id).toBeDefined();
        expect(typeof id).toBe("number");

        const result = await promise;
        expect(result).toBe("done");
    });

    it("should reject non-function tasks", () => {
        expect(() => {
            taskScheduler.add("not a function");
        }).toThrow("Task must be a function.");
    });

    it("should respect concurrency limit", async () => {
        let running = 0;
        let maxRunning = 0;

        const createTask = () => async () => {
            running++;
            maxRunning = Math.max(maxRunning, running);
            await new Promise(r => setTimeout(r, 50));
            running--;
            return true;
        };

        const tasks = [
            taskScheduler.add(createTask()),
            taskScheduler.add(createTask()),
            taskScheduler.add(createTask()),
            taskScheduler.add(createTask())
        ];

        await Promise.all(tasks.map(t => t.promise));

        expect(maxRunning).toBeLessThanOrEqual(2);
    });

    it("should prioritize higher priority tasks (lower number = higher priority)", async () => {
        const order = [];

        // Pause so all tasks stay in the queue first
        taskScheduler.pause();

        taskScheduler.add(async () => {
            order.push("low");
        }, { priority: 10 });

        taskScheduler.add(async () => {
            order.push("high");
        }, { priority: 1 });

        taskScheduler.add(async () => {
            order.push("medium");
        }, { priority: 5 });

        // Now resume – tasks should run in priority order
        taskScheduler.resume();

        // Wait until all tasks are finished
        await new Promise(resolve => {
            const check = () => {
                if (taskScheduler.isIdle()) resolve();
                else setTimeout(check, 15);
            };
            check();
        });

        // High priority (1) must run before low priority (10)
        expect(order.indexOf("high")).toBeLessThan(order.indexOf("low"));

        // Medium (5) should also run before low (10)
        expect(order.indexOf("medium")).toBeLessThan(order.indexOf("low"));
    });

    it("should cancel a queued task", async () => {
        // Fill concurrency so next tasks stay in queue
        taskScheduler.add(async () => new Promise(r => setTimeout(r, 100)));
        taskScheduler.add(async () => new Promise(r => setTimeout(r, 100)));

        const { id, promise } = taskScheduler.add(async () => "should not run");

        const cancelled = taskScheduler.cancel(id);
        expect(cancelled).toBe(true);

        await expect(promise).rejects.toThrow("Task cancelled.");
    });

    it("should pause and resume", async () => {
        taskScheduler.pause();
        expect(taskScheduler.status().paused).toBe(true);

        const { promise } = taskScheduler.add(async () => "resumed");

        let finished = false;
        promise.then(() => { finished = true; });

        await new Promise(r => setTimeout(r, 30));
        expect(finished).toBe(false);

        taskScheduler.resume();
        expect(taskScheduler.status().paused).toBe(false);

        const result = await promise;
        expect(result).toBe("resumed");
    });

    it("should timeout a long-running task", async () => {
        const { promise } = taskScheduler.add(
            async () => new Promise(r => setTimeout(r, 2000)),
            { timeout: 50 }
        );

        await expect(promise).rejects.toThrow("Task timeout.");
    });

    it("should clear the queue", () => {
        taskScheduler.add(async () => new Promise(r => setTimeout(r, 500)));
        taskScheduler.add(async () => new Promise(r => setTimeout(r, 500)));
        taskScheduler.add(async () => "waiting");

        taskScheduler.clear();
        expect(taskScheduler.size()).toBe(0);
    });

    it("should report correct status", () => {
        const status = taskScheduler.status();

        expect(status).toHaveProperty("paused");
        expect(status).toHaveProperty("running");
        expect(status).toHaveProperty("waiting");
        expect(status).toHaveProperty("concurrency");
        expect(status.concurrency).toBe(2);
    });

    it("should report idle state correctly", async () => {
        expect(taskScheduler.isIdle()).toBe(true);

        const { promise } = taskScheduler.add(async () => {
            await new Promise(r => setTimeout(r, 40));
            return true;
        });

        await promise;

        expect(taskScheduler.isIdle()).toBe(true);
    });

});