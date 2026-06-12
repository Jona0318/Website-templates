/* ===================================================================
   Standaard Website Template — JavaScript
   Bevat: mobiel menu, dark mode, back-to-top, FAQ-accordion,
   cookie-banner, scroll-animaties, statistiek-tellers, hero-entrance,
   header-schaduw, formulier-validatie, jaar in footer.
   Vanilla JS, geen dependencies.
   =================================================================== */

(function () {
  "use strict";

  // Centrale check: gebruiker wil minder beweging → animaties overslaan
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- 1. Mobiel menu (hamburger) -------------------------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#main-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Menu sluiten na klik op een link (mobiel)
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Sluiten met Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* --- 2. Dark mode toggle --------------------------------------- */
  const themeToggle = document.querySelector(".theme-toggle");
  const STORAGE_KEY = "theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Schakel naar lichte modus" : "Schakel naar donkere modus"
      );
    }
  }

  // Voorkeur ophalen: opgeslagen keuze > systeemvoorkeur
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }

  /* --- 3. Back-to-top knop & header-schaduw ----------------------- */
  const backToTop = document.querySelector(".back-to-top");
  const siteHeader = document.querySelector(".site-header");

  function onScroll() {
    if (backToTop) {
      backToTop.classList.toggle("is-visible", window.scrollY > 500);
    }
    // Header krijgt schaduw + dekkender achtergrond zodra er gescrold is
    if (siteHeader) {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 10);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // Direct toepassen, bv. bij herladen halverwege de pagina

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* --- 4. FAQ accordion ------------------------------------------ */
  document.querySelectorAll(".faq-question").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const answer = btn.nextElementSibling;
      btn.setAttribute("aria-expanded", String(!expanded));
      answer.style.maxHeight = expanded ? null : answer.scrollHeight + "px";
    });
  });

  /* --- 5. Cookie-banner ------------------------------------------ */
  const cookieBanner = document.querySelector(".cookie-banner");
  const COOKIE_KEY = "cookie-consent";
  if (cookieBanner) {
    if (!localStorage.getItem(COOKIE_KEY)) {
      cookieBanner.hidden = false;
    }
    cookieBanner.querySelectorAll("[data-cookie-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        localStorage.setItem(COOKIE_KEY, btn.dataset.cookieAction);
        cookieBanner.hidden = true;
      });
    });
  }

  /* --- 6. Scroll-onthul animaties (met stagger) ------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Na de onthul-transitie: vertraging en .reveal opruimen,
            // zodat hover-effecten (bv. op kaarten) weer direct reageren
            entry.target.addEventListener("transitionend", function handler(e) {
              if (e.target !== entry.target) return; // Gebubbelde events van kinderen negeren
              entry.target.removeEventListener("transitionend", handler);
              entry.target.style.transitionDelay = "";
              entry.target.classList.remove("reveal");
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      // Stagger: index bepalen t.o.v. broers/zussen die ook .reveal zijn,
      // zodat kaarten in een grid één voor één binnenkomen (max 400ms)
      if (!prefersReducedMotion && el.parentElement) {
        const siblings = Array.prototype.filter.call(
          el.parentElement.children,
          function (child) { return child.classList.contains("reveal"); }
        );
        const index = siblings.indexOf(el);
        if (index > 0) {
          el.style.transitionDelay = Math.min(index * 80, 400) + "ms";
        }
      }
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* --- 6b. Statistiek-tellers ------------------------------------- */
  // Telt het numerieke deel van bv. "500+", "12 jr" of "99,9%" op
  // wanneer de statistieken in beeld komen. Prefix/suffix blijven staan.
  function animateCounter(el) {
    const text = el.textContent.trim();
    const match = text.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
    if (!match) return; // Geen getal gevonden → laten staan

    const prefix = match[1];
    const numStr = match[2];
    const suffix = match[3];
    const useComma = numStr.indexOf(",") !== -1;
    const decimals = (numStr.split(/[.,]/)[1] || "").length;
    const target = parseFloat(numStr.replace(",", "."));
    if (isNaN(target)) return;

    const duration = 1200;
    let startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      let value = (target * eased).toFixed(decimals);
      if (useComma) value = value.replace(".", ",");
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statNumbers = document.querySelectorAll(".stat__number");
  if (statNumbers.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    statNumbers.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* --- 6c. Hero-entrance ------------------------------------------ */
  // Hero-elementen faden bij het laden gefaseerd in (alleen homepage).
  const heroItems = document.querySelectorAll(
    ".hero .eyebrow, .hero h1, .hero p, .hero .hero__actions, .hero .hero__image"
  );
  if (heroItems.length && !prefersReducedMotion) {
    // De omliggende .reveal-wrappers direct tonen; de kinderen animeren zelf
    document.querySelectorAll(".hero .reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
    heroItems.forEach(function (el, i) {
      el.classList.add("hero-enter");
      el.style.transitionDelay = Math.min(i * 100, 500) + "ms";
      el.addEventListener("transitionend", function handler(e) {
        if (e.target !== el) return; // Gebubbelde events van kinderen negeren
        el.removeEventListener("transitionend", handler);
        el.style.transitionDelay = "";
      });
    });
    // Dubbele rAF: eerst de beginstand laten renderen, dan animeren
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        heroItems.forEach(function (el) {
          el.classList.add("hero-enter--in");
        });
      });
    });
  }

  /* --- 7. Actuele jaartal in footer ------------------------------ */
  const yearEl = document.querySelector("#current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --- 8. Contactformulier-validatie ----------------------------- */
  const form = document.querySelector("#contact-form");
  if (form) {
    const status = form.querySelector(".form-status");

    function showError(input, message) {
      const errorEl = input.parentElement.querySelector(".form-error");
      if (errorEl) errorEl.textContent = message;
      input.setAttribute("aria-invalid", "true");
    }

    function clearError(input) {
      const errorEl = input.parentElement.querySelector(".form-error");
      if (errorEl) errorEl.textContent = "";
      input.removeAttribute("aria-invalid");
    }

    function validateField(input) {
      const value = input.value.trim();
      if (input.hasAttribute("required") && !value) {
        showError(input, "Dit veld is verplicht.");
        return false;
      }
      if (input.type === "email" && value) {
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!emailOk) {
          showError(input, "Voer een geldig e-mailadres in.");
          return false;
        }
      }
      clearError(input);
      return true;
    }

    // Live validatie wanneer een veld wordt verlaten
    form.querySelectorAll("input, textarea").forEach(function (input) {
      input.addEventListener("blur", function () {
        validateField(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("input[required], textarea[required], input[type=email]").forEach(function (input) {
        if (!validateField(input)) valid = false;
      });

      if (!valid) {
        if (status) {
          status.hidden = false;
          status.className = "form-status form-status--error";
          status.textContent = "Controleer de gemarkeerde velden en probeer het opnieuw.";
        }
        return;
      }

      // Hier zou je de data naar een server/endpoint sturen.
      // Demo: toon een succesmelding en reset het formulier.
      if (status) {
        status.hidden = false;
        status.className = "form-status form-status--success";
        status.textContent = "Bedankt! Je bericht is verzonden. We nemen snel contact op.";
      }
      form.reset();
    });
  }
})();
