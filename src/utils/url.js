// Read state from the URL
export function loadState() {

    const params = new URLSearchParams(window.location.search);

    return {

        search: params.get("search") || "",

        status: params.get("status") || "All",

        priority: params.get("priority") || "All",

        sort: params.get("sort") || "",

        page: Number(params.get("page")) || 1

    };

}

// Save state to the URL
export function saveState(state) {

    const params = new URLSearchParams();

    if (state.search) {
        params.set("search", state.search);
    }

    if (state.status && state.status !== "All") {
        params.set("status", state.status);
    }

    if (state.priority && state.priority !== "All") {
        params.set("priority", state.priority);
    }

    if (state.sort) {
        params.set("sort", state.sort);
    }

    if (state.page && state.page > 1) {
        params.set("page", state.page);
    }

    const url = `${window.location.pathname}?${params.toString()}`;

    history.replaceState({}, "", url);

}