import { get } from "../../core/store.js";
import { requestManager } from "../../core/requestManager.js";
import { httpClient } from "../../api/httpClient.js";
import { ENDPOINTS } from "../../api/endpoints.js";

import { renderDashboardCards } from "../../ui/components/dashboardCards.js";
import { renderRecentTickets } from "../../ui/components/recentTickets.js";

import {
    getCache,
    setCache
} from "../../utils/cache.js";

import {
    memoize
} from "../../utils/memoize.js";

/**
 * ---------------------------------------------------------
 * Cached Dashboard Statistics
 * ---------------------------------------------------------
 */
const calculateStats = memoize(tickets => ({
    total: tickets.length,
    open: tickets.filter(ticket => ticket.status === "Open").length,
    pending: tickets.filter(ticket => ticket.status === "Pending").length,
    closed: tickets.filter(ticket => ticket.status === "Closed").length
}));

/**
 * ---------------------------------------------------------
 * Load Dashboard
 * ---------------------------------------------------------
 */
export async function loadDashboard() {
    try {
        await requestManager.allSettled([
            httpClient.get(ENDPOINTS.TICKETS),
            httpClient.get(ENDPOINTS.CUSTOMERS),
            httpClient.get(ENDPOINTS.JOBS)
        ]);
    } catch (error) {
        console.error("Unable to load dashboard.", error);
    }
}

/**
 * ---------------------------------------------------------
 * Helper – Priority counts
 * ---------------------------------------------------------
 */
function getPriorityStats(tickets) {
    const high = tickets.filter(t => String(t.priority).toLowerCase() === "high").length;
    const medium = tickets.filter(t => String(t.priority).toLowerCase() === "medium").length;
    const low = tickets.filter(t => String(t.priority).toLowerCase() === "low").length;
    const total = high + medium + low || 1;

    return {
        high,
        medium,
        low,
        total: high + medium + low,
        highPct: Math.round((high / total) * 100),
        mediumPct: Math.round((medium / total) * 100),
        lowPct: Math.round((low / total) * 100)
    };
}

/**
 * ---------------------------------------------------------
 * Render Dashboard
 * ---------------------------------------------------------
 */
export async function renderDashboard(container) {
    const startTime = performance.now();

    await loadDashboard();

    const tickets = get("tickets") || [];
    const customers = get("customers") || [];
    const jobs = get("jobs") || [];

    // Cache statistics
    let stats = getCache("dashboard_stats");
    if (!stats) {
        stats = calculateStats(tickets);
        setCache("dashboard_stats", stats, 10000);
    }

    const priority = getPriorityStats(tickets);
    const recentTickets = [...tickets]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

    const activeJobs = jobs.filter(j => j.status === "Active" || j.status === "Running").length;

    container.innerHTML = `
        <section class="page-header dashboard-header">
            <div>
                <h1>Dashboard</h1>
                <p>Monitor ticket activity and system performance in real-time.</p>
            </div>
            <div class="dashboard-header-actions">
                <button class="secondary-btn date-range-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Last 7 days
                </button>
                <button class="secondary-btn export-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Export Report
                </button>
            </div>
        </section>

        <!-- Metric Cards -->
        <div class="cards dashboard-cards">
            <div class="card metric-card">
                <div class="metric-card-top">
                    <div class="metric-icon metric-icon-blue">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 5v2M15 11v2M15 17v2"></path>
                            <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"></path>
                        </svg>
                    </div>
                    <div class="metric-info">
                        <span class="metric-label">Total Tickets</span>
                        <h2 class="metric-value">${stats.total}</h2>
                        <span class="metric-sub">All support requests</span>
                    </div>
                </div>
                <div class="metric-trend up">↑ vs last 7 days</div>
            </div>

            <div class="card metric-card">
                <div class="metric-card-top">
                    <div class="metric-icon metric-icon-green">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                    </div>
                    <div class="metric-info">
                        <span class="metric-label">Open</span>
                        <h2 class="metric-value">${stats.open}</h2>
                        <span class="metric-sub">Needs attention</span>
                    </div>
                </div>
                <div class="metric-trend up">↑ vs last 7 days</div>
            </div>

            <div class="card metric-card">
                <div class="metric-card-top">
                    <div class="metric-icon metric-icon-orange">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div class="metric-info">
                        <span class="metric-label">Pending</span>
                        <h2 class="metric-value">${stats.pending}</h2>
                        <span class="metric-sub">Waiting for response</span>
                    </div>
                </div>
                <div class="metric-trend down">↓ vs last 7 days</div>
            </div>

            <div class="card metric-card">
                <div class="metric-card-top">
                    <div class="metric-icon metric-icon-purple">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <div class="metric-info">
                        <span class="metric-label">Closed</span>
                        <h2 class="metric-value">${stats.closed}</h2>
                        <span class="metric-sub">Resolved tickets</span>
                    </div>
                </div>
                <div class="metric-trend up">↑ vs last 7 days</div>
            </div>
        </div>

        <!-- Main Grid -->
        <section class="dashboard-grid">
            <!-- Recent Tickets -->
            <div class="panel recent-tickets-panel">
                <div class="panel-header">
                    <h3>Recent Tickets</h3>
                    <button id="viewAllTickets" class="primary-btn view-all-btn">View All</button>
                </div>

                <div class="table-wrap">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>TITLE</th>
                                <th>CUSTOMER</th>
                                <th>PRIORITY</th>
                                <th>STATUS</th>
                                <th>CREATED</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${
                                recentTickets.length
                                    ? recentTickets.map(ticket => {
                                        const priorityClass = String(ticket.priority || "").toLowerCase();
                                        const statusClass = String(ticket.status || "").toLowerCase();
                                        const created = ticket.createdAt
                                            ? new Date(ticket.createdAt).toLocaleString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                              })
                                            : "—";

                                        return `
                                            <tr>
                                                <td class="cell-strong">#${ticket.id}</td>
                                                <td>${ticket.title || "—"}</td>
                                                <td>${ticket.customer || "—"}</td>
                                                <td><span class="badge priority-${priorityClass}">${ticket.priority || "—"}</span></td>
                                                <td><span class="badge status-${statusClass}">${ticket.status || "—"}</span></td>
                                                <td>${created}</td>
                                            </tr>
                                        `;
                                      }).join("")
                                    : `
                                        <tr>
                                            <td colspan="6" class="empty-state">No recent tickets</td>
                                        </tr>
                                      `
                            }
                        </tbody>
                    </table>
                </div>

                <div class="table-footer">
                    Showing ${recentTickets.length} of ${tickets.length} tickets
                </div>
            </div>

            <!-- System Overview -->
            <div class="panel system-overview-panel">
                <h3>System Overview</h3>

                <div class="status-list">
                    <div class="status-item">
                        <div class="status-left">
                            <span class="status-dot online"></span>
                            <span>API Server</span>
                        </div>
                        <span class="badge status-closed">Online</span>
                        <span class="status-value">99.9%</span>
                    </div>

                    <div class="status-item">
                        <div class="status-left">
                            <span class="status-dot online"></span>
                            <span>Database</span>
                        </div>
                        <span class="badge status-closed">Connected</span>
                        <span class="status-value">100%</span>
                    </div>

                    <div class="status-item">
                        <div class="status-left">
                            <span class="status-dot warning"></span>
                            <span>Offline Queue</span>
                        </div>
                        <span class="badge status-open">Ready</span>
                        <span class="status-value">0 tasks</span>
                    </div>

                    <div class="status-item">
                        <div class="status-left">
                            <span class="status-dot info"></span>
                            <span>Last Sync</span>
                        </div>
                        <strong>Just Now</strong>
                        <span class="status-value">${new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                <!-- Bottom mini metrics -->
                <div class="mini-metrics">
                    <div class="mini-metric">
                        <div class="mini-metric-icon blue">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <div>
                            <strong>${customers.length}</strong>
                            <span>Customers</span>
                        </div>
                    </div>

                    <div class="mini-metric">
                        <div class="mini-metric-icon green">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                        </div>
                        <div>
                            <strong>${activeJobs || jobs.length}</strong>
                            <span>Active Jobs</span>
                        </div>
                    </div>

                    <div class="mini-metric">
                        <div class="mini-metric-icon purple">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                            </svg>
                        </div>
                        <div>
                            <strong>98.2%</strong>
                            <span>System Health</span>
                        </div>
                    </div>

                    <div class="mini-metric">
                        <div class="mini-metric-icon orange">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                        </div>
                        <div>
                            <strong>${stats.open + stats.pending}</strong>
                            <span>Incidents</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Bottom Section -->
        <section class="dashboard-bottom-grid">
            <!-- Activity Overview (simple visual) -->
            <div class="panel activity-panel">
                <div class="panel-header">
                    <h3>Activity Overview</h3>
                    <div class="chart-legend">
                        <span class="legend-item"><span class="legend-dot blue"></span> Tickets Created</span>
                        <span class="legend-item"><span class="legend-dot green"></span> Tickets Resolved</span>
                        <span class="legend-item"><span class="legend-dot purple"></span> Tickets Closed</span>
                    </div>
                </div>
                <div class="activity-chart-placeholder">
                    <div class="chart-bars">
                        <div class="chart-bar" style="height: 35%"><span></span></div>
                        <div class="chart-bar" style="height: 55%"><span></span></div>
                        <div class="chart-bar" style="height: 70%"><span></span></div>
                        <div class="chart-bar" style="height: 45%"><span></span></div>
                        <div class="chart-bar" style="height: 80%"><span></span></div>
                        <div class="chart-bar" style="height: 65%"><span></span></div>
                        <div class="chart-bar" style="height: 90%"><span></span></div>
                    </div>
                    <div class="chart-labels">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>
            </div>

            <!-- Top Priorities -->
            <div class="panel priorities-panel">
                <h3>Top Priorities</h3>
                <div class="priority-donut-wrap">
                    <div class="priority-donut" style="--high: ${priority.highPct}; --medium: ${priority.mediumPct}; --low: ${priority.lowPct}">
                        <div class="donut-center">
                            <strong>${priority.total}</strong>
                            <span>Total</span>
                        </div>
                    </div>
                    <div class="priority-legend">
                        <div class="priority-legend-item">
                            <span class="dot high"></span>
                            <span>High</span>
                            <strong>${priority.high}</strong>
                            <span class="pct">(${priority.highPct}%)</span>
                        </div>
                        <div class="priority-legend-item">
                            <span class="dot medium"></span>
                            <span>Medium</span>
                            <strong>${priority.medium}</strong>
                            <span class="pct">(${priority.mediumPct}%)</span>
                        </div>
                        <div class="priority-legend-item">
                            <span class="dot low"></span>
                            <span>Low</span>
                            <strong>${priority.low}</strong>
                            <span class="pct">(${priority.lowPct}%)</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;

    // Bind View All button
    const viewAll = container.querySelector("#viewAllTickets");
    if (viewAll) {
        viewAll.addEventListener("click", (e) => {
            e.preventDefault();
            if (typeof window.navigate === "function") {
                window.navigate("/tickets");
            } else {
                history.pushState({}, "", "/tickets");
                window.dispatchEvent(new PopStateEvent("popstate"));
            }
        });
    }

    console.log(`Dashboard rendered in ${(performance.now() - startTime).toFixed(2)} ms`);
}