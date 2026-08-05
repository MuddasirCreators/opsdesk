// src/config.js

const CONFIG = Object.freeze({
    APP_NAME: "OppDesk",
    VERSION: "1.0.0",

    API: {
        BASE_URL: "https://api.opsdesk.local",
        TIMEOUT: 10000
    },

    APP: {
        ENVIRONMENT: "development",
        DEBUG: true
    }
});

export default CONFIG;