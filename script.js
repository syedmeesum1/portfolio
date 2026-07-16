// @ts-check

/**
 * Main application entry point
 */
document.addEventListener("DOMContentLoaded", () => {
    // Check for mobile device (matches CSS breakpoint)
    const isMobile = window.matchMedia("(max-width: 900px)").matches;

    // --- GSAP DISABLED ON MOBILE ---
    if (isMobile) {
        document.documentElement.classList.add("mobile-layout");
        
        // Just handle basic mobile interactions if needed (Hamburger is handled via CSS/simple toggle below)
        const hamburger = document.querySelector(".hamburger");
        const navMenu = document.getElementById("nav-links");

        if (hamburger && navMenu) {
            hamburger.addEventListener("click", () => {
                navMenu.classList.toggle("active");
                hamburger.classList.toggle("toggle");
            });
        }

        // Handle Nav Links (Simple Scroll)
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (navMenu?.classList.contains("active")) {
                    navMenu.classList.remove("active");
                    // @ts-ignore
                    hamburger?.classList.remove("toggle");
                }
            });
        });

        // Ensure active state on scroll (Simple Spy)
        // using IntersectionObserver for performance on mobile
        const sections = document.querySelectorAll("section");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        const href = link.getAttribute("href");
                        // @ts-ignore
                        link.style.color = href === `#${id}` ? "var(--accent)" : "var(--text-primary)";
                    });
                }
            });
        }, { threshold: 0.5 });
        sections.forEach(sec => observer.observe(sec));

        return; // STOP HERE FOR MOBILE
    }

    // =========================================
    // DESKTOP ONLY LOGIC BELOW
    // =========================================
    document.documentElement.classList.remove("mobile-layout");

    // @ts-ignore
    if (typeof gsap !== "undefined") {
        // @ts-ignore
        gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);
    } else {
        console.error("GSAP not loaded");
        return;
    }

    // --- Custom Cursor ---
    /** @type {HTMLElement | null} */
    const cursor = document.getElementById("cursor");

    if (cursor) {
        // Center the custom cursor
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });

        // Move cursor (optimized)
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduceMotion) {
            const setCursorX = gsap.quickTo(cursor, "x", { duration: 0.12, ease: "power2.out" });
            const setCursorY = gsap.quickTo(cursor, "y", { duration: 0.12, ease: "power2.out" });

            let rafId = 0;
            let lastX = 0;
            let lastY = 0;

            document.addEventListener("mousemove", (e) => {
                lastX = e.clientX;
                lastY = e.clientY;
                if (rafId) return;
                rafId = window.requestAnimationFrame(() => {
                    rafId = 0;
                    setCursorX(lastX);
                    setCursorY(lastY);
                });
            }, { passive: true });
        }

        // Hover effects
        /** @type {NodeListOf<HTMLElement>} */
        const hoverables = document.querySelectorAll("a, button, .project-card, .skill-item");

        hoverables.forEach((el) => {
            el.addEventListener("mouseenter", () => {
                gsap.to(cursor, {
                    scale: 3,
                    backgroundColor: "oklch(68% 0.23 305 / 0.18)",
                    borderColor: "var(--accent-sec)",
                    duration: 0.25
                });
            });
            el.addEventListener("mouseleave", () => {
                gsap.to(cursor, {
                    scale: 1,
                    backgroundColor: "var(--accent-sec)",
                    borderColor: "var(--accent)",
                    duration: 0.25
                });
            });
        });
    }

    // --- Card Interactive Shine & Glow Effects ---
    const glowCards = document.querySelectorAll(".project-card, .skill-item");
    glowCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            // @ts-ignore
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // @ts-ignore
            card.style.setProperty("--mx", `${x}px`);
            // @ts-ignore
            card.style.setProperty("--my", `${y}px`);
        });
    });

    // --- SECTIONS & NAVIGATION ---
    /** @type {HTMLElement[]} */
    // @ts-ignore
    const sections = gsap.utils.toArray("section");
    /** @type {NodeListOf<HTMLAnchorElement>} */
    const navLinks = document.querySelectorAll(".nav-link");
    /** @type {HTMLElement | null} */
    const navMenu = document.getElementById("nav-links");
    /** @type {HTMLElement | null} */
    const hamburger = document.querySelector(".hamburger");
    /** @type {HTMLElement | null} */
    const logo = document.querySelector(".logo");

    /** @type {number} */
    let currentIndex = 0;
    /** @type {boolean} */
    let isAnimating = false;

    // --- ANIMATION CONTROLLER ---
    /** @type {any} */
    // @ts-ignore
    const gsapAny = gsap;
    /**
     * Runs staggered entrance animations for the contents of a section.
     * @param {HTMLElement} section
     */
    const animateEntrance = (section) => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) return;

        const tl = gsap.timeline();

        // 1. Stagger animate title
        const title = section.querySelector(".section-title");
        if (title) {
            tl.fromTo(title,
                { opacity: 0, y: 30, filter: "blur(5px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "power2.out" }
            );
        }

        // 2. Stagger animate text contents / hero content
        const texts = section.querySelectorAll(".about-text p, .hero-content > *, .contact-content > *");
        const textsArray = Array.from(texts);
        if (textsArray.length > 0) {
            tl.fromTo(textsArray,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08 },
                "-=0.45"
            );
        }

        // 3. Stagger animate main visual items (grid items, cards, image containers)
        const items = section.querySelectorAll(".skill-item, .project-card, .about-img, .hero-image-container");
        const itemsArray = Array.from(items);
        if (itemsArray.length > 0) {
            tl.fromTo(itemsArray,
                { opacity: 0, y: 35, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.2)", stagger: 0.06 },
                "-=0.4"
            );
        }
    };

    /**
     * Transitions between sections.
     * @param {number} index - The index of the target section.
     * @param {string} direction - The direction of animation ("up" or "down").
     */
    const gotoSection = (index, direction) => {
        if (index < 0 || index >= sections.length || isAnimating) return;

        isAnimating = true;
        const currentSection = sections[currentIndex];
        const nextSection = sections[index];

        const tl = gsap.timeline({
            defaults: { duration: 1, ease: "power4.inOut" },
            onComplete: () => {
                isAnimating = false;
                currentIndex = index;
                animateEntrance(nextSection);
            }
        });

        // Standard fade transition
        const yOffset = 60;

        // Out
        tl.to(currentSection, {
            opacity: 0,
            y: direction === "down" ? -yOffset : yOffset,
            visibility: "hidden"
        })
            // In
            .fromTo(nextSection, {
                opacity: 0,
                y: direction === "down" ? yOffset : -yOffset,
                visibility: "visible"
            }, {
                opacity: 1,
                y: 0,
                visibility: "visible"
            }, "<");

        updateNavigation(index);
    };

    /**
     * Updates URL hash and Active State
     * @param {number} index - Index of the active section
     */
    const updateNavigation = (index) => {
        const id = sections[index].id;
        // Check if hash is already correct to prevent redundant history entries
        if (window.location.hash.substring(1) !== id) {
            history.pushState(null, "", `#${id}`);
        }

        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            // @ts-ignore
            link.style.color = href === `#${id}` ? "var(--accent)" : "var(--text-primary)";
        });
    };

    // --- INITIAL LOAD ---
    /**
     * Initializes the page state based on the URL hash.
     */
    const init = () => {
        const hash = window.location.hash.substring(1);
        let startIndex = sections.findIndex(sec => sec.id === hash);
        if (startIndex === -1) startIndex = 0;

        currentIndex = startIndex;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Desktop: Initial GSAP State (Hidden/Visible)
        sections.forEach((sec, i) => {
            if (i === startIndex) {
                gsap.set(sec, { opacity: 1, visibility: "visible", y: 0 });
            } else {
                gsap.set(sec, { opacity: 0, visibility: "hidden" });
            }
        });

        // Header entrance animation
        if (!reduceMotion) {
            const tl = gsap.timeline();
            tl.from(".logo", { y: -30, opacity: 0, duration: 0.8, ease: "power3.out" })
                .from(".nav-link", { y: -30, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }, "-=0.6");
        }

        // Animate reveal items for the active section (optional, adds premium feel)
        animateEntrance(sections[startIndex]);

        updateNavigation(startIndex);
    };
    init();

    // --- SCROLL OBSERVER (Desktop Only) ---
    // @ts-ignore
    Observer.create({
        target: window,
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        onDown: () => !isAnimating && gotoSection(currentIndex - 1, "up"),
        onUp: () => !isAnimating && gotoSection(currentIndex + 1, "down"),
        tolerance: 10,
        preventDefault: true,
        ignore: ".projects-container, .projects-container *, .about-text"
    });


    // --- EVENT LISTENERS ---

    // URL Reactivity (Back/Forward Button Support)
    window.addEventListener("popstate", () => {
        const hash = window.location.hash.substring(1);
        let targetIndex = sections.findIndex(sec => sec.id === hash);
        // Default to home if hash is empty or not found
        if (targetIndex === -1) targetIndex = 0;

        if (targetIndex !== currentIndex && !isAnimating) {
            const direction = targetIndex > currentIndex ? "down" : "up";
            gotoSection(targetIndex, direction);
        }
    });

    // Navigation Links
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            // Desktop: Use GSAP Transition
            e.preventDefault();
            const href = link.getAttribute("href");
            if (!href) return;

            const targetId = href.substring(1);
            const targetIndex = sections.findIndex(sec => sec.id === targetId);

            if (targetIndex !== -1 && targetIndex !== currentIndex) {
                const direction = targetIndex > currentIndex ? "down" : "up";
                gotoSection(targetIndex, direction);
            }
        });
    });

    // Logo -> Home
    if (logo) {
        logo.addEventListener("click", () => {
            if (currentIndex !== 0) gotoSection(0, "up");
        });
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            hamburger.classList.toggle("toggle");
        });
    }

    // --- RESIZE HANDLER ---
    let lastWidth = window.innerWidth;
    window.addEventListener("resize", () => {
        const newWidth = window.innerWidth;
        const wasMobile = lastWidth <= 900;
        const nowMobile = newWidth <= 900;

        if (wasMobile !== nowMobile) {
            window.location.reload();
        }
        lastWidth = newWidth;
    });
});
