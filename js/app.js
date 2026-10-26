(() => {
  "use strict";

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

  /* ------------------------------------------------------------------------
     6. MISC: filter pills (blog categories) toggle aria-pressed.
     ------------------------------------------------------------------------ */
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    group.addEventListener("click", (event) => {
      const pill = event.target.closest(".pill");
      if (!pill) return;
      group.querySelectorAll(".pill").forEach((p) => p.setAttribute("aria-pressed", "false"));
      pill.setAttribute("aria-pressed", "true");
      // hook: filter post or video grid using pill.dataset.filter.
    });
  });

})();