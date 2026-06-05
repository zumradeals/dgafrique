/* DG Afrique main interactions */
(function () {
  const header = document.querySelector("[data-site-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");

  function syncHeaderState() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  }

  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });

  if (header && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        header.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18 })
    : null;

  document.querySelectorAll(".animate-on-scroll").forEach((element) => {
    if (observer) {
      observer.observe(element);
    } else {
      element.classList.add("is-visible");
    }
  });

  const counterObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 })
    : null;

  document.querySelectorAll(".counter").forEach((counter) => {
    if (counterObserver) {
      counterObserver.observe(counter);
    } else {
      animateCounter(counter);
    }
  });

  function animateCounter(element) {
    if (element.dataset.counted === "true") return;
    element.dataset.counted = "true";

    const target = Number(element.dataset.target || "0");
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased).toLocaleString(document.documentElement.lang || "fr");

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const currentYear = document.getElementById("current-year");
  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  const partnershipForm = document.querySelector("[data-partnership-form]");
  if (partnershipForm) {
    const status = partnershipForm.querySelector("[data-form-status]");

    partnershipForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!partnershipForm.checkValidity()) {
        partnershipForm.reportValidity();
        return;
      }

      setFormStatus(status, "", "");
      const submitButton = partnershipForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;

      try {
        const response = await fetch(partnershipForm.action, {
          body: new FormData(partnershipForm),
          method: "POST"
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.error || "Une erreur est survenue.");
        }

        partnershipForm.reset();
        setFormStatus(status, "success", window.DGA_TRANSLATIONS?.partnership?.success || "Votre demande a bien été transmise.");
      } catch (error) {
        setFormStatus(status, "error", error.message || "Une erreur est survenue.");
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  function setFormStatus(element, type, message) {
    if (!element) return;
    element.className = "form-status";
    if (type) element.classList.add(type);
    element.textContent = message;
  }
})();
