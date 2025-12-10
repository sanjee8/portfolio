import { useEffect } from "react";

export default function useScrollNavigation() {
    useEffect(() => {
        // ---------- ANIM FADE-IN DES SECTIONS ----------
        const animSections = document.querySelectorAll(".section-animate");
        const animObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio > 0.4) {
                        entry.target.classList.add("in-view");
                    }
                });
            },
            { threshold: [0.4] }
        );
        animSections.forEach((sec) => animObserver.observe(sec));

        // ---------- LOGIQUE DE SCROLL "HINT + RESCROLL" ----------
        const sections = Array.from(document.querySelectorAll("section"));
        let isAnimating = false;
        let armedDownIndex = null;
        let armedUpIndex = null;
        const SCROLL_DURATION = 1100; // ms

        function smoothScrollTo(targetY, duration = SCROLL_DURATION) {
            const startY = window.scrollY;
            const distance = targetY - startY;
            const startTime = performance.now();

            isAnimating = true;

            function easeInOutQuad(t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            }

            function step(now) {
                const elapsed = now - startTime;
                const t = Math.min(elapsed / duration, 1);
                const eased = easeInOutQuad(t);
                window.scrollTo(0, startY + distance * eased);

                if (t < 1) {
                    requestAnimationFrame(step);
                } else {
                    isAnimating = false;
                }
            }

            requestAnimationFrame(step);
        }

        function getCurrentSectionIndex() {
            const scrollY = window.scrollY;
            const vh = window.innerHeight;
            const mid = scrollY + vh / 2;

            let index = sections.findIndex((sec) => {
                const top = sec.offsetTop;
                const bottom = top + sec.offsetHeight;
                return mid >= top && mid < bottom;
            });

            if (index === -1) index = 0;
            return index;
        }

        function hideAllHints() {
            document
                .querySelectorAll(".section-next-hint, .section-prev-hint")
                .forEach((h) => h.classList.remove("is-visible"));
        }

        // ne pas montrer les hints au chargement
        hideAllHints();

        function handleWheel(e) {
            if (isAnimating) {
                e.preventDefault();
                return;
            }

            const delta = e.deltaY;
            if (Math.abs(delta) < 5) return;

            const directionDown = delta > 0;
            const scrollY = window.scrollY;
            const vh = window.innerHeight;
            const currentIndex = getCurrentSectionIndex();
            const currentSection = sections[currentIndex];
            const sectionTop = currentSection.offsetTop;
            const sectionHeight = currentSection.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            const hintNext = currentSection.querySelector(".section-next-hint");
            const hintPrev = currentSection.querySelector(".section-prev-hint");

            if (directionDown) {
                // reset logique "up"
                armedUpIndex = null;
                if (hintPrev) hintPrev.classList.remove("is-visible");

                // --- CAS SPÉCIAL : ACCUEIL ---
                if (currentIndex === 0) {
                    const nextSection = sections[1];
                    if (!nextSection) return;

                    if (armedDownIndex !== 0) {
                        e.preventDefault();
                        armedDownIndex = 0;
                        if (hintNext) hintNext.classList.add("is-visible");
                        return;
                    } else {
                        e.preventDefault();
                        armedDownIndex = null;
                        if (hintNext) hintNext.classList.remove("is-visible");
                        smoothScrollTo(nextSection.offsetTop);
                        return;
                    }
                }

                // --- AUTRES SECTIONS ---
                if (currentIndex >= sections.length - 1) return;

                let lockY = sectionBottom - vh;
                if (lockY < sectionTop) {
                    lockY = sectionTop;
                }

                if (scrollY < lockY - 10) {
                    armedDownIndex = null;
                    if (hintNext) hintNext.classList.remove("is-visible");
                    return;
                }

                if (armedDownIndex !== currentIndex) {
                    e.preventDefault();
                    armedDownIndex = currentIndex;
                    if (hintNext) hintNext.classList.add("is-visible");
                    smoothScrollTo(lockY);
                    return;
                } else {
                    e.preventDefault();
                    const nextSection = sections[currentIndex + 1];
                    if (!nextSection) return;
                    armedDownIndex = null;
                    if (hintNext) hintNext.classList.remove("is-visible");
                    smoothScrollTo(nextSection.offsetTop);
                    return;
                }
            } else {
                // Scroll vers le haut : logique miroir
                armedDownIndex = null;
                if (hintNext) hintNext.classList.remove("is-visible");

                if (currentIndex === 0) return;

                const prevIndex = currentIndex - 1;
                const prevSection = sections[prevIndex];

                let lockTopY = sectionTop;
                if (scrollY > lockTopY + 10) {
                    armedUpIndex = null;
                    if (hintPrev) hintPrev.classList.remove("is-visible");
                    return;
                }

                if (armedUpIndex !== currentIndex) {
                    e.preventDefault();
                    armedUpIndex = currentIndex;
                    if (hintPrev) hintPrev.classList.add("is-visible");
                    smoothScrollTo(lockTopY);
                    return;
                } else {
                    e.preventDefault();
                    armedUpIndex = null;
                    if (hintPrev) hintPrev.classList.remove("is-visible");
                    smoothScrollTo(prevSection.offsetTop);
                    return;
                }
            }
        }

        window.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            animObserver.disconnect();
            window.removeEventListener("wheel", handleWheel);
        };
    }, []);
}
