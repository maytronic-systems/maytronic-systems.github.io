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
      if (isHidden) mobileNav.removeAttribute("hidden");
      else mobileNav.setAttribute("hidden", "");
    });
  }
    if (gallery && galleryDataEl) {
    const track = gallery.querySelector("[data-gallery-track]");
    const caption = gallery.querySelector("[data-gallery-caption]");
    const counter = gallery.querySelector("[data-gallery-counter]");
    const dots = gallery.querySelector("[data-gallery-dots]");
    const thumbs = gallery.querySelector("[data-gallery-thumbs]");
    const prevButton = gallery.querySelector("[data-gallery-prev]");
    const nextButton = gallery.querySelector("[data-gallery-next]");

    let screenshots = [];

    try {
      screenshots = JSON.parse(galleryDataEl.textContent);
    } catch (error) {
      console.error("Could not parse gallery data", error);
    }

    if (screenshots.length && track && caption && counter && dots && thumbs && prevButton && nextButton) {
      let currentIndex = 0;
      let touchStartX = 0;
      let touchDeltaX = 0;

      screenshots.forEach((shot, index) => {
        const slide = document.createElement("article");
        slide.className = "gallery-slide";
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-roledescription", "slide");
        slide.setAttribute("aria-label", `${index + 1} of ${screenshots.length}`);
        slide.innerHTML = `
          <figure class="gallery-frame">
            <img
              src="${shot.src}"
              alt="${shot.alt}"
              width="1440"
              height="3120"
              loading="${index === 0 ? "eager" : "lazy"}"
              decoding="async"
            />
          </figure>
        `;
        track.appendChild(slide);

        const dot = document.createElement("button");
        dot.className = "gallery-dot";
        dot.type = "button";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", `Show ${shot.title}`);
        dot.addEventListener("click", () => updateGallery(index));
        dots.appendChild(dot);

        const thumb = document.createElement("button");
        thumb.className = "gallery-thumb";
        thumb.type = "button";
        thumb.setAttribute("aria-label", `Preview ${shot.title}`);
        thumb.innerHTML = `
          <img
            src="${shot.src}"
            alt=""
            width="1440"
            height="3120"
            loading="lazy"
            decoding="async"
          />
        `;
        thumb.addEventListener("click", () => updateGallery(index));
        thumbs.appendChild(thumb);
      });

      const dotButtons = Array.from(dots.querySelectorAll(".gallery-dot"));
      const thumbButtons = Array.from(thumbs.querySelectorAll(".gallery-thumb"));

      const updateGallery = (nextIndex) => {
        currentIndex = (nextIndex + screenshots.length) % screenshots.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        const activeShot = screenshots[currentIndex];
        caption.textContent = `${activeShot.title} — ${activeShot.description}`;
        counter.textContent = `${currentIndex + 1} / ${screenshots.length}`;

        dotButtons.forEach((dot, index) => {
          const isActive = index === currentIndex;
          dot.setAttribute("aria-selected", String(isActive));
          dot.setAttribute("tabindex", isActive ? "0" : "-1");
        });

        thumbButtons.forEach((thumb, index) => {
          thumb.classList.toggle("is-active", index === currentIndex);
          thumb.setAttribute("aria-current", index === currentIndex ? "true" : "false");
        });

        prevButton.disabled = screenshots.length < 2;
        nextButton.disabled = screenshots.length < 2;
      };

      prevButton.addEventListener("click", () => updateGallery(currentIndex - 1));
      nextButton.addEventListener("click", () => updateGallery(currentIndex + 1));

      gallery.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          updateGallery(currentIndex - 1);
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          updateGallery(currentIndex + 1);
        }
      });

      gallery.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].clientX;
        touchDeltaX = 0;
      }, { passive: true });

      gallery.addEventListener("touchmove", (event) => {
        touchDeltaX = event.changedTouches[0].clientX - touchStartX;
      }, { passive: true });

      gallery.addEventListener("touchend", () => {
        if (Math.abs(touchDeltaX) < 45) return;
        if (touchDeltaX < 0) updateGallery(currentIndex + 1);
        if (touchDeltaX > 0) updateGallery(currentIndex - 1);
      });

      updateGallery(0);
    }
  }
})();
