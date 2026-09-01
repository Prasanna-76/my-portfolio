/* ============================================================
   PERSONAL LINKS
   Replace these values later. Social buttons and resume
   buttons across the site read from this object.
   ============================================================ */
const PERSONAL_LINKS = {
  github: "https://github.com/Prasanna-76",
  linkedin: "https://www.linkedin.com/in/prasanna-priya-kagitapalli-6172432b4",
  email: "mailto:prasannapriyakagitapalli@gmail.com",
  phone: "tel:+919959257131",
  phoneDisplay: "+91 9959257131",
  maps: "https://maps.app.goo.gl/YyMTAHQngXRAR4fF9",
  resume: "assets/resume.pdf"
};

function applyPersonalLinks() {
  const links = PERSONAL_LINKS;

  document.querySelectorAll("[data-social]").forEach((element) => {
    const key = element.getAttribute("data-social");
    const url = links[key];

    if (!url) {
      return;
    }

    element.setAttribute("href", url);

    if (key === "email" || key === "phone") {
      element.removeAttribute("target");
      element.removeAttribute("rel");

      const labelTarget = element.hasAttribute("data-social-label")
        ? element
        : element.querySelector("[data-social-label]");

      if (labelTarget) {
        if (key === "email") {
          labelTarget.textContent = url.replace(/^mailto:/i, "");
        }

        if (key === "phone") {
          labelTarget.textContent = links.phoneDisplay || url.replace(/^tel:/i, "");
        }
      }
    } else {
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noopener noreferrer");
    }
  });

  const resumeUrl = links.resume || "assets/resume.pdf";
  const resumeFileName = "Prasanna_Priya_Kagitapalli_Resume.pdf";

  function setResumeStatus(message) {
    document.querySelectorAll("[data-resume-status]").forEach((status) => {
      status.textContent = message || "";
    });
  }

  document.querySelectorAll("[data-resume]").forEach((element) => {
    const mode = element.getAttribute("data-resume");
    element.setAttribute("href", resumeUrl);

    if (mode === "download") {
      element.setAttribute("download", resumeFileName);
      element.removeAttribute("target");
      element.removeAttribute("rel");

      element.addEventListener("click", async (event) => {
        event.preventDefault();

        try {
          const response = await fetch(resumeUrl, { cache: "no-store" });

          if (!response.ok) {
            setResumeStatus("Resume PDF is not available yet.");
            return;
          }

          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = objectUrl;
          link.download = resumeFileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
          setResumeStatus("");
        } catch (error) {
          setResumeStatus("Resume PDF is not available yet.");
        }
      });
    } else {
      element.removeAttribute("download");
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noopener noreferrer");
    }
  });
}

applyPersonalLinks();

const header = document.getElementById("header");
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menu-btn");
const overlay = document.getElementById("nav-overlay");
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const toTop = document.getElementById("to-top");
const navLinks = document.querySelectorAll(".nav a:not(.nav-cta)");
const pageLinks = document.querySelectorAll('a[href^="#"]');
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const desktopQuery = window.matchMedia("(min-width: 1201px)");

const navSections = Array.from(navLinks)
  .map((link) => document.getElementById((link.getAttribute("href") || "").slice(1)))
  .filter(Boolean);

function setMenu(open) {
  if (!nav || !menuBtn) {
    return;
  }

  nav.classList.toggle("open", open);
  menuBtn.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");

  if (overlay) {
    overlay.classList.toggle("show", open);
    overlay.hidden = !open;
  }
}

function closeMenu() {
  setMenu(false);
}

function openMenu() {
  setMenu(true);
}

if (menuBtn && nav) {
  menuBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (nav.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

if (overlay) {
  overlay.addEventListener("click", closeMenu);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

if (desktopQuery.addEventListener) {
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) {
      closeMenu();
    }
  });
} else {
  desktopQuery.addListener((event) => {
    if (event.matches) {
      closeMenu();
    }
  });
}

function scrollToId(id) {
  const target = document.getElementById(id);

  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start"
  });
}

pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href") || "";

    if (link.classList.contains("placeholder-link") || href === "#") {
      event.preventDefault();
      return;
    }

    const id = href.slice(1);
    const target = document.getElementById(id);

    if (!target) {
      closeMenu();
      return;
    }

    event.preventDefault();
    closeMenu();

    window.setTimeout(() => {
      scrollToId(id);

      try {
        if (window.location.hash !== href) {
          history.pushState(null, "", href);
        }
      } catch (error) {
        window.location.hash = href;
      }
    }, 60);
  });
});

function fillSkillBars(root) {
  const bars = (root || document).querySelectorAll(".skill-progress");

  bars.forEach((bar) => {
    const level = bar.getAttribute("data-level") || "0";
    window.requestAnimationFrame(() => {
      bar.style.width = level + "%";
    });
  });
}

function startTyping() {
  const typed = document.getElementById("typed-text");
  const phrases = ["MCA Student | Aspiring Full Stack Developer"];

  if (!typed) {
    return;
  }

  if (prefersReducedMotion) {
    typed.textContent = phrases.join(" | ");
    return;
  }

  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let deleting = true;

  function tick() {
    const phrase = phrases[phraseIndex];

    if (!deleting) {
      charIndex += 1;
      typed.textContent = phrase.slice(0, charIndex);

      if (charIndex === phrase.length) {
        deleting = true;
        window.setTimeout(tick, 1600);
        return;
      }

      window.setTimeout(tick, 88);
      return;
    }

    charIndex -= 1;
    typed.textContent = phrase.slice(0, Math.max(charIndex, 0));

    if (charIndex <= 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      window.setTimeout(tick, 320);
      return;
    }

    window.setTimeout(tick, 46);
  }

  window.setTimeout(tick, 1400);
}

function createParticles() {
  const root = document.getElementById("particles");

  if (!root || prefersReducedMotion) {
    return;
  }

  const colors = ["#7c3aed", "#38bdf8", "#f9a8d4"];
  const count = window.innerWidth < 700 ? 16 : 32;

  root.innerHTML = "";

  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = 40 + Math.random() * 70 + "%";
    particle.style.background = colors[index % colors.length];
    particle.style.animationDelay = Math.random() * 10 + "s";
    particle.style.animationDuration = 9 + Math.random() * 10 + "s";
    root.appendChild(particle);
  }
}

let ticking = false;
const revealItems = document.querySelectorAll(".reveal");

function showReveal(item) {
  item.classList.add("visible");

  if (item.classList.contains("skill-card") || item.querySelector(".skill-progress")) {
    fillSkillBars(item);
  }
}

function revealInView() {
  revealItems.forEach((item) => {
    if (item.classList.contains("visible")) {
      return;
    }

    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 72) {
      showReveal(item);
    }
  });
}

function updateEducationTimeline() {
  const timeline = document.getElementById("edu-timeline");

  if (!timeline) {
    return;
  }

  if (prefersReducedMotion) {
    timeline.style.setProperty("--edu-progress", "1");
    return;
  }

  const rect = timeline.getBoundingClientRect();
  const viewport = window.innerHeight || 1;
  const start = viewport * 0.78;
  const traveled = start - rect.top;
  const distance = Math.max(rect.height, 1);
  const progress = Math.min(1, Math.max(0, traveled / distance));

  timeline.style.setProperty("--edu-progress", progress.toFixed(3));
}

function updateOnScroll() {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }

  if (toTop) {
    toTop.classList.toggle("visible", window.scrollY > 420);
  }

  revealInView();
  updateEducationTimeline();

  let current = "home";

  navSections.forEach((section) => {
    if (section.getBoundingClientRect().top - 140 <= 0) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    link.classList.toggle("active", href === "#" + current);
  });
}

function onScroll() {
  if (ticking) {
    return;
  }

  ticking = true;
  window.requestAnimationFrame(() => {
    updateOnScroll();
    ticking = false;
  });
}

function setupProjectThumbnails() {
  const thumbs = document.querySelectorAll(".project-thumb");

  thumbs.forEach((thumb) => {
    const media = thumb.closest(".project-media");

    function markLoaded() {
      thumb.classList.remove("is-missing");
      if (media) {
        media.classList.add("has-thumb");
      }
    }

    function markMissing() {
      thumb.classList.add("is-missing");
      if (media) {
        media.classList.remove("has-thumb");
      }
    }

    thumb.addEventListener("error", markMissing);
    thumb.addEventListener("load", markLoaded);

    if (thumb.complete) {
      if (thumb.naturalWidth > 0) {
        markLoaded();
      } else {
        markMissing();
      }
    }
  });
}

function setupProfilePhotos() {
  const photos = document.querySelectorAll(".profile-photo");

  photos.forEach((photo) => {
    const frame = photo.closest(".portrait-frame, .about-photo-wrap");
    const caption = photo.closest("figure") && photo.closest("figure").querySelector(".photo-hint");

    function markLoaded() {
      photo.classList.remove("is-missing");
      if (frame) {
        frame.classList.add("has-photo");
      }
      if (caption) {
        caption.hidden = true;
      }
    }

    function markMissing() {
      photo.classList.add("is-missing");
      if (frame) {
        frame.classList.remove("has-photo");
      }
      if (caption) {
        caption.hidden = false;
      }
    }

    photo.addEventListener("error", markMissing);
    photo.addEventListener("load", markLoaded);

    if (photo.complete) {
      if (photo.naturalWidth > 0) {
        markLoaded();
      } else {
        markMissing();
      }
    }
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
updateOnScroll();
createParticles();
startTyping();
setupProfilePhotos();
setupProjectThumbnails();

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showReveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach(showReveal);
}

if (toTop) {
  toTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });

    try {
      history.pushState(null, "", "#home");
    } catch (error) {
      window.location.hash = "home";
    }
  });
}

if (form && formStatus) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const fields = {
    name: form.elements.namedItem("name"),
    email: form.elements.namedItem("email"),
    subject: form.elements.namedItem("subject"),
    message: form.elements.namedItem("message")
  };

  function setFieldError(field, message) {
    const error = document.getElementById(field.id + "-error");
    field.classList.toggle("invalid", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");

    if (error) {
      error.textContent = message || "";
    }
  }

  function clearStatus() {
    formStatus.textContent = "";
    formStatus.classList.remove("error");
  }

  function validateField(field) {
    const value = field.value.trim();

    if (field.name === "name") {
      if (!value) {
        setFieldError(field, "Please enter your name.");
        return false;
      }
      if (value.length < 2) {
        setFieldError(field, "Name should be at least 2 characters.");
        return false;
      }
    }

    if (field.name === "email") {
      if (!value) {
        setFieldError(field, "Please enter your email address.");
        return false;
      }
      if (!emailPattern.test(value)) {
        setFieldError(field, "Please enter a valid email, such as name@example.com.");
        return false;
      }
    }

    if (field.name === "subject") {
      if (!value) {
        setFieldError(field, "Please enter a subject.");
        return false;
      }
    }

    if (field.name === "message") {
      if (!value) {
        setFieldError(field, "Please enter a message.");
        return false;
      }
      if (value.length < 10) {
        setFieldError(field, "Message should be at least 10 characters.");
        return false;
      }
    }

    setFieldError(field, "");
    return true;
  }

  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    if (!field) {
      return;
    }

    field.addEventListener("blur", () => {
      validateField(field);
    });

    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) {
        validateField(field);
      }
      clearStatus();
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearStatus();

    const results = Object.keys(fields).map((key) => validateField(fields[key]));
    const firstInvalid = Object.keys(fields)
      .map((key) => fields[key])
      .find((field) => field && field.classList.contains("invalid"));

    if (results.indexOf(false) !== -1) {
      formStatus.classList.add("error");
      formStatus.textContent = "Please fix the highlighted fields and try again.";
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    const name = fields.name.value.trim();
    formStatus.classList.remove("error");
    formStatus.textContent =
      "Thank you, " +
      name +
      ". Your details were validated successfully. A live email service is not connected yet, so this message was not sent.";
    form.reset();

    Object.keys(fields).forEach((key) => {
      setFieldError(fields[key], "");
    });
  });
}

if (window.location.hash.length > 1) {
  const initial = document.getElementById(window.location.hash.slice(1));
  if (initial) {
    window.setTimeout(() => scrollToId(initial.id), 80);
  }
}
