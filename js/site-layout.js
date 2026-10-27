class dcsHeader extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";

    this.innerHTML =
    `<header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="index.html" aria-label="Dubai Cash Stuffer, home">
          <img class="logo--light" src="assets/logo-light.png" alt="" width="200" height="60">
          <img class="logo--dark" src="assets/logo-dark.png" alt="" width="200" height="60">
        </a>

        <nav id="site-nav" class="site-nav" aria-label="Main">
          <a href="index.html" aria-current="page">Home</a>
          <a href="video.html">Videos</a>
          <a href="blog.html">Blog</a>
          <a href="services.html">Services</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
        </nav>

        <div class="header-actions">
          <button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="Switch to dark mode">
            <span aria-hidden="true">◐</span> <span data-theme-label>Dark</span>
          </button>
          <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav">Menu</button>
        </div>
      </div>
    </header>`

    /* ------------------------------------------------------------------------
      hide the mobile nav
      ------------------------------------------------------------------------ */
    const root = document.documentElement;
    root.classList.add("js");

    /* ------------------------------------------------------------------------
    THEME TOGGLE
    - default: follows the operating system (prefers-color-scheme).
    - every access is wrapped in try/catch.
    ------------------------------------------------------------------------ */
    const THEME_KEY = "dcs-theme";
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    const themeButtons = document.querySelectorAll("[data-theme-toggle]");

    function readStoredTheme() {
      try {
        return localStorage.getItem(THEME_KEY);
      } catch (e) {
        return null;
      }
    }

    function storeTheme(value) {
      try {
        localStorage.setItem(THEME_KEY, value);
      } catch (e) {
        /* ignore: the theme still applies for this visit. */
      }
    }

    function currentTheme() {
      return root.dataset.theme || (systemDark.matches ? "dark" : "light");
    }

    function applyTheme(theme) {
      root.dataset.theme = theme;
      themeButtons.forEach((btn) => {
        const isDark = theme === "dark";
        btn.setAttribute("aria-pressed", String(isDark));
        btn.setAttribute(
          "aria-label",
          isDark ? "Switch to light mode" : "Switch to dark mode"
        );
        const label = btn.querySelector("[data-theme-label]");
        if (label) label.textContent = isDark ? "Light" : "Dark";
      });
    }

    // apply the saved choice on load-if any.
    const saved = readStoredTheme();
    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
    } else {
      applyTheme(currentTheme());
    }

    themeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = currentTheme() === "dark" ? "light" : "dark";
        storeTheme(next);
        applyTheme(next);
      });
    });

    // if the OS theme changes and the user hasn't chosen one, follow it.
    systemDark.addEventListener?.("change", () => {
      if (!readStoredTheme()) applyTheme(currentTheme());
    });

    /* ------------------------------------------------------------------------
      MOBILE NAV
      ------------------------------------------------------------------------ */
    const navToggle = document.querySelector("[data-nav-toggle]");
    const nav = document.getElementById("site-nav");

    if (navToggle && nav) {
      const setNav = (open) => {
        nav.dataset.open = String(open);
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.textContent = open ? "Close" : "Menu";
      };

      navToggle.addEventListener("click", () => {
        setNav(nav.dataset.open !== "true");
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && nav.dataset.open === "true") {
          setNav(false);
          navToggle.focus();
        }
      });

      // close the menu when focus leaves it (keyboard users tabbing past the end).
      nav.addEventListener("focusout", (event) => {
        if (!nav.contains(event.relatedTarget) && event.relatedTarget !== navToggle) {
          if (window.innerWidth < 1024) setNav(false);
        }
      });
    }
  }
}
customElements.define("dcs-header", dcsHeader);


class dcsFooter extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";

    this.innerHTML =
    `<footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <h2>Newsletter</h2>
            <p class="muted">Budget tips, free printables and new video alerts.</p>
            <form class="newsletter-form" data-form action="#" novalidate>
              <div class="field">
                <label for="footer-email" class="sr-only">Email address</label>
                <input id="footer-email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required aria-describedby="footer-email-error">
                <p class="field__error" id="footer-email-error" aria-live="polite"></p>
              </div>
              <div>
                <button class="btn btn-footer btn--primary" type="submit">Sign up</button>
              </div>
            </form>
            <p class="form-status" data-form-status role="status" aria-live="polite"></p>
          </div>

          <!-- <nav aria-label="Footer">
            <h2>Explore</h2>
            <a href="video.html">Videos</a>
            <a href="blog.html">Blog</a>
            <a href="services.html">Services</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
          </nav> -->

          <div>
            <h2>Follow</h2>
            <ul class="social-list">
              <!-- Replace href values with your real profiles -->
              <li><a href="https://www.youtube.com/" rel="noopener" aria-label="YouTube">YouTube</a></li>
              <li><a href="https://www.instagram.com/" rel="noopener" aria-label="Instagram">Instagram</a></li>
              <li><a href="https://www.tiktok.com/" rel="noopener" aria-label="TikTok">TikTok</a></li>
            </ul>
          </div>
        </div>

        <p class="footer-base">
          <span>© <span data-year>2026</span> Dubai Cash Stuffer. All rights reserved.</span>
          <span><a href="contact.html">Privacy</a> · <a href="contact.html">Terms</a></span>
        </p>
      </div>
    </footer>`

    /* ------------------------------------------------------------------------
    FORMS
    ------------------------------------------------------------------------ */
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setFieldError(input, message) {
      const errorEl = input.parentElement.querySelector(".field__error");
      if (errorEl) errorEl.textContent = message;
      input.setAttribute("aria-invalid", message ? "true" : "false");
      if (message) input.setAttribute("aria-describedby", errorEl.id);
    }

    function validateField(input) {
      const value = input.value.trim();
      if (input.required && !value) {
        setFieldError(input, "This field is required.");
        return false;
      }
      if (input.type === "email" && value && !EMAIL_RE.test(value)) {
        setFieldError(input, "Please enter a valid email address.");
        return false;
      }
      setFieldError(input, "");
      return true;
    }

    document.querySelectorAll("form[data-form]").forEach((form) => {
      const status = form.querySelector("[data-form-status]");

      // validate fields as the user leaves them (not while typing).
      form.querySelectorAll("input, textarea, select").forEach((input) => {
        input.addEventListener("blur", () => validateField(input));
      });

      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const fields = [...form.querySelectorAll("input, textarea, select")];
        const allValid = fields.map(validateField).every(Boolean);

        if (!allValid) {
          const firstInvalid = fields.find((f) => f.getAttribute("aria-invalid") === "true");
          firstInvalid?.focus();
          if (status) status.textContent = "Please fix the highlighted fields.";
          return;
        }

        if (status) status.textContent = "Sending…";

        try {
          await new Promise((resolve) => setTimeout(resolve, 700));
          form.reset();
          if (status) status.textContent = "Thanks! We'll be in touch soon.";
        } catch (err) {
          if (status) status.textContent = "Something went wrong. Please try again.";
        }
      });
    });

    document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
    });

  }
}
customElements.define("dcs-footer", dcsFooter);
