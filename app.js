const root = document.documentElement;
const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = themeToggle ? themeToggle.querySelector(".theme-toggle__label") : null;
const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");
const navLinks = siteNav ? Array.from(siteNav.querySelectorAll('a[href^="#"]')) : [];
const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
const yearNode = document.getElementById("year");
const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function getStoredTheme() {
    try {
        return localStorage.getItem("portfolio-theme");
    } catch (error) {
        return null;
    }
}

function setStoredTheme(theme) {
    try {
        localStorage.setItem("portfolio-theme", theme);
    } catch (error) {
        return;
    }
}

function resolveTheme() {
    const storedTheme = getStoredTheme();

    if (storedTheme === "dark" || storedTheme === "light") {
        return storedTheme;
    }

    return themeMedia.matches ? "dark" : "light";
}

function updateThemeToggle(theme) {
    if (!themeToggle || !themeLabel) {
        return;
    }

    themeLabel.textContent = theme === "dark" ? "Light mode" : "Dark mode";
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
}

function applyTheme(theme, persist = true) {
    root.dataset.theme = theme;
    updateThemeToggle(theme);

    if (persist) {
        setStoredTheme(theme);
    }
}

function closeMenu() {
    if (!siteNav || !menuToggle) {
        return;
    }

    siteNav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
    if (!siteNav || !menuToggle) {
        return;
    }

    const shouldOpen = !siteNav.classList.contains("is-open");
    siteNav.classList.toggle("is-open", shouldOpen);
    menuToggle.classList.toggle("is-open", shouldOpen);
    menuToggle.setAttribute("aria-expanded", String(shouldOpen));
}

function setupRevealAnimation() {
    body.classList.add("js-ready");

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("revealed"));
        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -10% 0px"
        }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
}

function setupActiveNavigation() {
    if (!navLinks.length || !("IntersectionObserver" in window)) {
        return;
    }

    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const currentId = `#${entry.target.id}`;
                navLinks.forEach((link) => {
                    link.classList.toggle("is-active", link.getAttribute("href") === currentId);
                });
            });
        },
        {
            rootMargin: "-45% 0px -45% 0px",
            threshold: 0
        }
    );

    sections.forEach((section) => sectionObserver.observe(section));
}

function setupEvents() {
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
            applyTheme(nextTheme);
            closeMenu();
        });
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", toggleMenu);
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    const syncThemeWithSystem = (event) => {
        if (!getStoredTheme()) {
            applyTheme(event.matches ? "dark" : "light", false);
        }
    };

    if (typeof themeMedia.addEventListener === "function") {
        themeMedia.addEventListener("change", syncThemeWithSystem);
    } else if (typeof themeMedia.addListener === "function") {
        themeMedia.addListener(syncThemeWithSystem);
    }

    const revealAllIfReduced = (event) => {
        if (event.matches) {
            revealItems.forEach((item) => item.classList.add("revealed"));
        }
    };

    if (typeof reduceMotion.addEventListener === "function") {
        reduceMotion.addEventListener("change", revealAllIfReduced);
    } else if (typeof reduceMotion.addListener === "function") {
        reduceMotion.addListener(revealAllIfReduced);
    }
}

applyTheme(root.dataset.theme || resolveTheme(), false);
setupRevealAnimation();
setupActiveNavigation();
setupEvents();

if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
}
