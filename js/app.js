(() => {
  "use strict";

  /* ------------------------------------------------------------------------
     hide the mobile nav
     ------------------------------------------------------------------------ */
  const root = document.documentElement;
  root.classList.add("js");

    /* ------------------------------------------------------------------------
     THEME TOGGLE
     - Default: follows the operating system (prefers-color-scheme).
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
     REVEAL ON SCROLL
     ------------------------------------------------------------------------ */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  }


})();