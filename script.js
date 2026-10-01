// @ts-check

/**
 * MESUM ABBAS — PORTFOLIO JAVASCRIPT
 * Vanilla JS + GSAP 3 (ScrollTrigger & ScrollToPlugin)
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- GSAP PLUGIN REGISTRATION ---
    // @ts-ignore
    if (typeof gsap !== "undefined") {
        // @ts-ignore
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    } else {
        console.error("GSAP or plugins not loaded properly.");
        return;
    }

    const isMobile = () => window.matchMedia("(max-width: 900px)").matches;
    const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ==========================================================================
    // 1. LIVE KARACHI TIME IN FOOTER
    // ==========================================================================
    const updateLocalTime = () => {
        const timeEl = document.getElementById("local-time");
        if (!timeEl) return;

        const options = {
            timeZone: "Asia/Karachi",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        };

        try {
            const timeString = new Intl.DateTimeFormat("en-US", options).format(new Date());
            timeEl.textContent = `${timeString} PKT`;
        } catch (e) {
            timeEl.textContent = "UTC+5 PKT";
        }
    };

    updateLocalTime();
    setInterval(updateLocalTime, 1000);

    // ==========================================================================
    // 2. MOBILE NAVIGATION TOGGLE
    // ==========================================================================
    const mobileToggle = document.querySelector(".mobile-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener("click", () => {
            const isActive = mobileMenu.classList.contains("active");
            if (isActive) {
                mobileMenu.classList.remove("active");
                mobileToggle.setAttribute("aria-expanded", "false");
            } else {
                mobileMenu.classList.add("active");
                mobileToggle.setAttribute("aria-expanded", "true");
            }
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                mobileToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // ==========================================================================
    // 3. SMOOTH ANCHOR LINK SCROLLING (ScrollToPlugin)
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // @ts-ignore
                gsap.to(window, {
                    duration: 1.1,
                    // @ts-ignore
                    scrollTo: { y: targetElement, offsetY: 70 },
                    ease: "power3.inOut"
                });
            }
        });
    });

    // ==========================================================================
    // 4. SUBTLE ENTRANCE REVEALS FOR SECTIONS
    // ==========================================================================
    if (!prefersReducedMotion()) {
        // Hero elements reveal on load
        // @ts-ignore
        const heroTl = gsap.timeline();
        heroTl.from(".hero-label-group", { opacity: 0, y: 15, duration: 0.6, ease: "power2.out" })
              .from(".hero-title", { opacity: 0, y: 25, duration: 0.8, ease: "power3.out" }, "-=0.4")
              .from(".hero-bio", { opacity: 0, y: 20, duration: 0.7, ease: "power2.out" }, "-=0.5")
              .from(".hero-actions", { opacity: 0, y: 15, duration: 0.6, ease: "power2.out" }, "-=0.4")
              .from(".hero-aside", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" }, "-=0.6");

        // General section reveals
        // @ts-ignore
        const sections = gsap.utils.toArray(".section:not(#projects)");
        sections.forEach((section) => {
            // @ts-ignore
            gsap.from(section.querySelectorAll(".section-header, .about-grid, .skills-category-grid, .contact-grid"), {
                opacity: 0,
                y: 35,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.15,
                scrollTrigger: {
                    // @ts-ignore
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    // ==========================================================================
    // 5. WORK SECTION: DESKTOP PINNED HORIZONTAL SCROLL (ScrollTrigger)
    // ==========================================================================
    const initWorkSection = () => {
        const projectsSection = document.querySelector("#projects");
        const track = document.querySelector(".projects-track");
        const progressBar = document.querySelector(".work-progress-fill");
        const counterCurrent = document.querySelector(".work-counter-current");

        if (!projectsSection || !track) return;

        // If Mobile or Reduced Motion: Vertical Layout (No Pinning)
        if (isMobile() || prefersReducedMotion()) {
            // @ts-ignore
            const panels = gsap.utils.toArray(".project-panel");
            panels.forEach((panel) => {
                // @ts-ignore
                gsap.fromTo(panel,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        ease: "power2.out",
                        scrollTrigger: {
                            // @ts-ignore
                            trigger: panel,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
            return;
        }

        // DESKTOP PINNING LOGIC
        const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

        // @ts-ignore
        gsap.to(track, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: projectsSection,
                pin: true,
                scrub: 0.8,
                end: () => "+=" + (track.scrollWidth - window.innerWidth),
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    // Update bottom progress bar width
                    if (progressBar) {
                        // @ts-ignore
                        progressBar.style.width = `${Math.min(100, Math.max(0, self.progress * 100))}%`;
                    }
                    // Update index counter (01 to 06)
                    if (counterCurrent) {
                        const index = Math.min(6, Math.max(1, Math.floor(self.progress * 6.01) + 1));
                        counterCurrent.textContent = String(index).padStart(2, '0');
                    }
                }
            }
        });
    };

    initWorkSection();

    // Refresh ScrollTrigger on window resize to ensure pinning coordinates stay accurate
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // @ts-ignore
            ScrollTrigger.refresh();
        }, 250);
    });
});
