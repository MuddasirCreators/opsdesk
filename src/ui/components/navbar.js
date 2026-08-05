export function renderNavbar() {
  const navbar = document.getElementById("navbar");

  if (!navbar) {
    return;
  }

  navbar.innerHTML = `
    <div class="navbar">
      <div class="navbar-left">
        <div class="navbar-title-block">
          <p class="navbar-eyebrow">OpsDesk</p>
          <h1 class="navbar-heading">Operations Console</h1>
        </div>
      </div>

      <div class="navbar-center">
        <span class="navbar-status">
          <span class="navbar-status-dot" aria-hidden="true"></span>
          System healthy
        </span>
      </div>

      <div class="navbar-right">
        <button
          id="theme-toggle"
          class="theme-toggle"
          type="button"
          aria-label="Toggle day / night mode"
          title="Toggle day / night mode"
        >
          <!-- DAY MODE (light) -->
          <span class="theme-state theme-day">
            <span class="theme-label">DAY MODE</span>
            <span class="theme-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <line x1="12" y1="2" x2="12" y2="4"></line>
                <line x1="12" y1="20" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line>
                <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="4" y2="12"></line>
                <line x1="20" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line>
                <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line>
              </svg>
            </span>
          </span>

          <!-- NIGHT MODE (dark) -->
          <span class="theme-state theme-night">
            <span class="theme-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 14.3A9 9 0 1 1 9.7 3a7 7 0 0 0 11.3 11.3z"/>
                <circle cx="17.5" cy="6.5" r="1.2"/>
                <circle cx="19.5" cy="9.5" r="0.7"/>
              </svg>
            </span>
            <span class="theme-label">NIGHT MODE</span>
          </span>
        </button>

        <div class="profile" role="status" aria-label="Signed in as Muddasir Amin, Administrator">
          <div class="avatar" aria-hidden="true">M</div>
          <div class="profile-meta">
            <strong class="profile-name">Muddasir Amin</strong>
            <span class="profile-role">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Theme toggle logic
  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;

  // Apply saved theme (or system preference)
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  themeToggle?.addEventListener("click", () => {
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}