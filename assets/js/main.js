(function () {
  const yearEl = document.querySelectorAll("[data-year]");
  const todayEl = document.querySelectorAll("[data-today]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  const now = new Date();
  yearEl.forEach((el) => (el.textContent = String(now.getFullYear())));

  // ISO-ish readable date
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  todayEl.forEach((el) => (el.textContent = `${yyyy}-${mm}-${dd}`));

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const isHidden = mobileNav.hasAttribute("hidden");

      if (isHidden) {
        mobileNav.removeAttribute("hidden");
        navToggle.setAttribute("aria-expanded", "true");
      } else {
        mobileNav.setAttribute("hidden", "");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
