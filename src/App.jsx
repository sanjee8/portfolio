import React, { useEffect } from "react";
import * as THREE from "three";

function App() {
    useEffect(() => {
        // ---------- FOND ÉTOILÉ ----------
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.domElement.style.position = "fixed";
        renderer.domElement.style.top = "0";
        renderer.domElement.style.left = "0";
        renderer.domElement.style.zIndex = "-1";
        document.body.insertBefore(renderer.domElement, document.body.firstChild);

        const starCount = 3500;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        const color = new THREE.Color();

        for (let i = 0; i < starCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 3000;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 3000;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 3000;

            color.setHSL(0.6 + Math.random() * 0.15, 0.6, 0.7 + Math.random() * 0.3);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 1.8 + 0.4;
        }

        const starsGeometry = new THREE.BufferGeometry();
        starsGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );
        starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        starsGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        const starsMaterial = new THREE.PointsMaterial({
            vertexColors: true,
            size: 1.8,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
        });

        const starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);

        camera.position.z = 5;

        let animationId;
        function animate() {
            animationId = requestAnimationFrame(animate);

            starField.rotation.x += 0.0003;
            starField.rotation.y += 0.0005;
            starField.material.opacity =
                0.85 + Math.sin(Date.now() * 0.001) * 0.1;

            renderer.render(scene, camera);
        }

        animate();

        function handleResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener("resize", handleResize);

        // ---------- BARRE DE PROGRESSION ----------
        const progressBar = document.getElementById("scroll-progress");
        function handleScrollProgress() {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? scrollTop / docHeight : 0;
            if (progressBar) {
                progressBar.style.transform = `scaleX(${progress})`;
            }
        }
        window.addEventListener("scroll", handleScrollProgress);

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

        // Navigation par clic sur le menu
        document.querySelectorAll(".fluid-nav a").forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const id = link.getAttribute("href")?.replace("#", "");
                const target = id ? document.getElementById(id) : null;
                if (target) {
                    const targetY = target.offsetTop;
                    armedDownIndex = null;
                    armedUpIndex = null;
                    hideAllHints();
                    smoothScrollTo(targetY);
                }
            });
        });

        // --- LANG SWITCHER ---
        const langBtns = document.querySelectorAll(".lang-btn");
        langBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                langBtns.forEach((b) => b.classList.remove("is-active"));
                btn.classList.add("is-active");
                // TODO : système de traduction plus tard
            });
        });

        // ---------- TABS COMPÉTENCES ----------
        const skillsTabs = document.querySelectorAll(".skills-tab");
        const skillsPanels = document.querySelectorAll(".skills-panel");

        skillsTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const target = tab.getAttribute("data-tab");
                if (!target) return;

                skillsTabs.forEach((t) => t.classList.remove("is-active"));
                tab.classList.add("is-active");

                skillsPanels.forEach((panel) => {
                    if (panel.getAttribute("data-tab") === target) {
                        panel.classList.add("is-active");
                    } else {
                        panel.classList.remove("is-active");
                    }
                });
            });
        });

        // Accueil : ne pas montrer le hint au début
        window.addEventListener("load", hideAllHints);

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

        // ------- CLEANUP quand le composant est démonté -------
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScrollProgress);
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("load", hideAllHints);
            animObserver.disconnect();
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, []);

    // --------- JSX : ton HTML converti ----------
    return (
        <>
            <div id="scroll-progress"></div>

            <header>
                <h1>Sanjeevan</h1>
                <nav className="fluid-nav">
                    <a href="#home">Accueil</a>
                    <a href="#about">À propos</a>
                    <a href="#experience">Expériences</a>
                    <a href="#skills">Compétences</a>
                    <a href="#contact">Contact</a>
                </nav>
                <div className="lang-switcher">
                    <button className="lang-btn is-active" data-lang="fr">
                        FR
                    </button>
                    <button className="lang-btn" data-lang="en">
                        EN
                    </button>
                </div>
            </header>

            <main>
                {/* ACCUEIL */}
                <section id="home">
                    <div className="section-inner hero-text">
                        <h2>
                            <span className="hero-title-main">Software&nbsp;Engineer</span>
                            <span className="hero-title-intro">
                — je conçois des expériences web robustes, performantes et
                soignées
              </span>
                        </h2>

                        <div className="hero-links fluid-nav">
                            <a href="#about">À propos</a>
                            <a href="#experience">Expériences</a>
                            <a href="#skills">Compétences</a>
                            <a href="#contact">Contact</a>
                        </div>
                    </div>

                    <div className="section-next-hint" data-next="À propos">
                        <span className="label">Continuer à défiler</span>
                        <span className="next-name">— À propos</span>
                        <span className="arrow">▼</span>
                    </div>
                </section>

                {/* À PROPOS */}
                <section id="about" className="section-animate">
                    <div className="section-inner">
                        <div>
                            <h3>À propos</h3>
                            <h2 className="section-title">Qui je suis.</h2>

                            <blockquote>
                                « Programs must be written for people to read, and only
                                incidentally for machines to execute. »
                                <span>— Harold Abelson</span>
                            </blockquote>

                            <p>
                                Ingénieur en informatique, je navigue entre backend, frontend et
                                product pour construire des outils utiles, lisibles et
                                maintenables. J’aime comprendre le métier, discuter avec les
                                utilisateurs, puis traduire ça en expériences web propres et
                                fiables.
                            </p>
                            <p>
                                J’accorde beaucoup d’importance à la qualité du code, aux détails
                                d’UX, et au fait de livrer des choses qui tiennent la route dans
                                le temps, que ce soit pour une banque, une association ou un
                                projet perso.
                            </p>
                        </div>

                        <div className="about-photo">
                            <div className="about-photo-inner">
                                <img
                                    src="assets/profile-pro.jpg"
                                    alt="Portrait professionnel de Sanjeevan"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="section-prev-hint" data-prev="Accueil">
                        <span className="arrow">▲</span>
                        <span className="label">Revenir</span>
                        <span className="prev-name">— Accueil</span>
                    </div>

                    <div className="section-next-hint" data-next="Expériences">
                        <span className="label">Continuer à défiler</span>
                        <span className="next-name">— Expériences</span>
                        <span className="arrow">▼</span>
                    </div>
                </section>

                {/* EXPÉRIENCES */}
                <section id="experience" className="section-animate">
                    <div className="section-inner">
                        <h3>Expériences</h3>
                        <h2 className="section-title">Mon parcours.</h2>

                        <p>
                            Un mélange d’expériences en entreprise, de projets associatifs et
                            de formation qui m’ont appris autant la technique que le sens du
                            service.
                        </p>

                        <div className="xp-cosmic">
                            <div className="xp-cosmic-rail"></div>

                            {/* CACEIS */}
                            <article className="xp-cosmic-item xp-type-alt xp-main">
                                <div className="xp-marker"></div>
                                <div className="xp-card">
                                    <div className="xp-card-inner">
                                        <div className="xp-meta">
                                            <span className="xp-meta-date">2023 – 2025</span>
                                            <span className="xp-meta-type">Alternance</span>
                                            <span>· CACEIS Bank</span>
                                            <span>· Clearing &amp; Executive Services</span>
                                        </div>
                                        <h4 className="xp-role">
                                            Ingénieur logiciel — outils internes &amp; supervision
                                        </h4>
                                        <div className="xp-company">CACEIS Bank</div>

                                        <div className="xp-badges">
                                            <span>Outils internes</span>
                                            <span>Automatisation</span>
                                            <span>Support métier</span>
                                        </div>

                                        <div className="xp-body">
                                            <ul>
                                                <li>
                                                    Conception d’un convertisseur de fichiers plats vers
                                                    Excel utilisé par les comptables.
                                                </li>
                                                <li>
                                                    Optimisation et sécurisation des scripts de déploiement
                                                    Git de l’équipe.
                                                </li>
                                                <li>
                                                    Supervision des jobs (statistiques, erreurs) pour
                                                    améliorer la fiabilité du SI.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            {/* Stains Espoir */}
                            <article className="xp-cosmic-item xp-type-benevole">
                                <div className="xp-marker"></div>
                                <div className="xp-card">
                                    <div className="xp-card-inner">
                                        <div className="xp-meta">
                                            <span className="xp-meta-date">2023 – aujourd’hui</span>
                                            <span className="xp-meta-type">Bénévolat</span>
                                            <span>· Stains Espoir</span>
                                        </div>
                                        <h4 className="xp-role">
                                            Lead technique — plateforme associative
                                        </h4>
                                        <div className="xp-company">Stains Espoir</div>

                                        <div className="xp-badges">
                                            <span>Symfony</span>
                                            <span>Gestion associative</span>
                                            <span>Produit en production</span>
                                        </div>

                                        <div className="xp-body">
                                            <ul>
                                                <li>
                                                    Portail pour suivre enfants, parents, autorisations de
                                                    sortie et inscriptions.
                                                </li>
                                                <li>
                                                    Exports CSV/XLSX, notifications e-mail, gestion RGPD,
                                                    accompagnement des bénévoles.
                                                </li>
                                                <li>
                                                    Outil utilisé au quotidien pour organiser les activités
                                                    et les sorties.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            {/* ASV / actions locales */}
                            <article className="xp-cosmic-item xp-type-benevole">
                                <div className="xp-marker"></div>
                                <div className="xp-card">
                                    <div className="xp-card-inner">
                                        <div className="xp-meta">
                                            <span className="xp-meta-date">2020 – aujourd’hui</span>
                                            <span className="xp-meta-type">Bénévolat</span>
                                            <span>· ASV Volley &amp; actions locales</span>
                                        </div>
                                        <h4 className="xp-role">
                                            Encadrant &amp; organisateur — sport &amp; jeunesse
                                        </h4>
                                        <div className="xp-company">
                                            ASV Volley &amp; actions locales
                                        </div>

                                        <div className="xp-badges">
                                            <span>Organisation</span>
                                            <span>Communication</span>
                                            <span>Association</span>
                                        </div>

                                        <div className="xp-body">
                                            <ul>
                                                <li>
                                                    Encadrement de jeunes lors d’entraînements, sorties et
                                                    événements sportifs.
                                                </li>
                                                <li>
                                                    Création de supports numériques (affiches, formulaires,
                                                    posts réseaux sociaux).
                                                </li>
                                                <li>
                                                    Participation à l’animation du quartier et à la vie
                                                    associative locale.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            {/* École d’ingé */}
                            <article className="xp-cosmic-item xp-type-formation">
                                <div className="xp-marker"></div>
                                <div className="xp-card">
                                    <div className="xp-card-inner">
                                        <div className="xp-meta">
                                            <span className="xp-meta-date">Diplômé 2025</span>
                                            <span className="xp-meta-type">Formation</span>
                                            <span>· Sup Galilée</span>
                                            <span>· Université Sorbonne Paris Nord</span>
                                        </div>
                                        <h4 className="xp-role">Ingénieur en informatique</h4>
                                        <div className="xp-company">
                                            Sup Galilée — Université Sorbonne Paris Nord
                                        </div>

                                        <div className="xp-badges">
                                            <span>Développement logiciel</span>
                                            <span>Architecture</span>
                                            <span>Projets</span>
                                        </div>

                                        <div className="xp-body">
                                            <ul>
                                                <li>
                                                    Formation en développement logiciel, architectures et
                                                    bases de données.
                                                </li>
                                                <li>
                                                    Projets de groupe avec contraintes métier et travail en
                                                    équipe.
                                                </li>
                                                <li>
                                                    Alternance pour connecter théorie et pratique sur des cas
                                                    réels.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>

                    <div className="section-prev-hint" data-prev="À propos">
                        <span className="arrow">▲</span>
                        <span className="label">Revenir</span>
                        <span className="prev-name">— À propos</span>
                    </div>

                    <div className="section-next-hint" data-next="Compétences">
                        <span className="label">Continuer à défiler</span>
                        <span className="next-name">— Compétences</span>
                        <span className="arrow">▼</span>
                    </div>
                </section>

                {/* COMPÉTENCES */}
                <section id="skills" className="section-animate">
                    <div className="section-inner">
                        <h3>Compétences</h3>
                        <h2 className="section-title">Ce que je peux apporter.</h2>

                        <p className="skills-intro">
                            Plutôt que de lister des buzzwords, voici les technologies et
                            compétences sur lesquelles je suis réellement à l’aise au
                            quotidien.
                        </p>

                        {/* TABS */}
                        <div className="skills-tabs" role="tablist">
                            <button className="skills-tab is-active" data-tab="backend" role="tab">
                                Backend &amp; APIs
                            </button>
                            <button className="skills-tab" data-tab="frontend" role="tab">
                                Frontend &amp; UI
                            </button>
                            <button className="skills-tab" data-tab="tools" role="tab">
                                Outils &amp; DevOps
                            </button>
                            <button className="skills-tab" data-tab="soft" role="tab">
                                Soft skills
                            </button>
                        </div>

                        {/* PANELS */}
                        <div className="skills-panels">
                            {/* BACKEND */}
                            <div className="skills-panel is-active" data-tab="backend">
                                <div className="skill-chip skill-chip--backend">
                                    <div className="skill-header">
                                        <span className="skill-name">Java / Spring</span>
                                        <span className="skill-level-label">Solide</span>
                                    </div>
                                    <div className="skill-sub">
                                        Services backend, logique métier, APIs REST.
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "80%" }}></span>
                                    </div>
                                </div>

                                <div className="skill-chip skill-chip--backend">
                                    <div className="skill-header">
                                        <span className="skill-name">PHP / Symfony</span>
                                        <span className="skill-level-label">Avancé</span>
                                    </div>
                                    <div className="skill-sub">
                                        Plateformes web structurées, projet Stains Espoir.
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "85%" }}></span>
                                    </div>
                                </div>

                                <div className="skill-chip skill-chip--backend">
                                    <div className="skill-header">
                    <span className="skill-name">
                      SQL (PostgreSQL, Oracle, MySQL)
                    </span>
                                        <span className="skill-level-label">Confortable</span>
                                    </div>
                                    <div className="skill-sub">
                                        Modélisation, requêtes, exports, supervision de jobs.
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "75%" }}></span>
                                    </div>
                                </div>

                                <div className="skill-chip skill-chip--backend">
                                    <div className="skill-header">
                                        <span className="skill-name">APIs REST</span>
                                        <span className="skill-level-label">Confortable</span>
                                    </div>
                                    <div className="skill-sub">
                                        Conception d’API propres, claires et documentées.
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "72%" }}></span>
                                    </div>
                                </div>
                            </div>

                            {/* FRONTEND */}
                            <div className="skills-panel" data-tab="frontend">
                                <div className="skill-chip skill-chip--frontend">
                                    <div className="skill-header">
                                        <span className="skill-name">HTML / CSS</span>
                                        <span className="skill-level-label">Avancé</span>
                                    </div>
                                    <div className="skill-sub">
                                        Mise en page soignée, animations légères, responsive.
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "85%" }}></span>
                                    </div>
                                </div>

                                <div className="skill-chip skill-chip--frontend">
                                    <div className="skill-header">
                                        <span className="skill-name">JavaScript / TypeScript</span>
                                        <span className="skill-level-label">Confortable</span>
                                    </div>
                                    <div className="skill-sub">
                                        Logique front, interactions, petits composants.
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "75%" }}></span>
                                    </div>
                                </div>

                                <div className="skill-chip skill-chip--frontend">
                                    <div className="skill-header">
                                        <span className="skill-name">React</span>
                                        <span className="skill-level-label">Bon niveau</span>
                                    </div>
                                    <div className="skill-sub">
                                        App perso de sport tracking, composants réutilisables.
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "70%" }}></span>
                                    </div>
                                </div>

                                <div className="skill-chip skill-chip--frontend">
                                    <div className="skill-header">
                                        <span className="skill-name">Angular (notions)</span>
                                        <span className="skill-level-label">En progression</span>
                                    </div>
                                    <div className="skill-sub">
                                        Bases du framework et logique de composants.
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "55%" }}></span>
                                    </div>
                                </div>
                            </div>

                            {/* OUTILS / DEVOPS */}
                            <div className="skills-panel" data-tab="tools">
                                <div className="skill-chip skill-chip--tools">
                                    <div className="skill-header">
                    <span className="skill-name">
                      Git / GitLab / GitHub
                    </span>
                                        <span className="skill-level-label">Avancé</span>
                                    </div>
                                    <div className="skill-sub">
                                        Branches, MR, scripts de déploiement, revue de code.
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "85%" }}></span>
                                    </div>
                                </div>

                                <div className="skill-chip skill-chip--tools">
                                    <div className="skill-header">
                                        <span className="skill-name">Linux / CLI</span>
                                        <span className="skill-level-label">Confortable</span>
                                    </div>
                                    <div className="skill-sub">
                                        Environnements de dev, scripts, supervision de jobs.
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "75%" }}></span>
                                    </div>
                                </div>

                                <div className="skill-chip skill-chip--tools">
                                    <div className="skill-header">
                                        <span className="skill-name">CI &amp; déploiement</span>
                                        <span className="skill-level-label">Confortable</span>
                                    </div>
                                    <div className="skill-sub">
                                        Builds, déploiements sur hébergement, gestion des erreurs.
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "70%" }}></span>
                                    </div>
                                </div>

                                <div className="skill-chip skill-chip--tools">
                                    <div className="skill-header">
                                        <span className="skill-name">Monitoring &amp; logs</span>
                                        <span className="skill-level-label">En pratique</span>
                                    </div>
                                    <div className="skill-sub">
                                        Suivi des erreurs, analyse des jobs, logs applicatifs.
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "65%" }}></span>
                                    </div>
                                </div>
                            </div>

                            {/* SOFT SKILLS */}
                            <div className="skills-panel" data-tab="soft">
                                <div className="skill-chip skill-chip--soft">
                                    <div className="skill-header">
                    <span className="skill-name">
                      Communication avec les métiers
                    </span>
                                        <span className="skill-level-label">Clé</span>
                                    </div>
                                    <div className="skill-sub">
                                        Capacité à traduire un besoin métier en solution concrète.
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "85%" }}></span>
                                    </div>
                                </div>

                                <div className="skill-chip skill-chip--soft">
                                    <div className="skill-header">
                                        <span className="skill-name">Esprit d’équipe</span>
                                        <span className="skill-level-label">Fort</span>
                                    </div>
                                    <div className="skill-sub">
                                        Habitué au travail en groupe (associatif et entreprise).
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "80%" }}></span>
                                    </div>
                                </div>

                                <div className="skill-chip skill-chip--soft">
                                    <div className="skill-header">
                    <span className="skill-name">
                      Autonomie &amp; initiative
                    </span>
                                        <span className="skill-level-label">Fort</span>
                                    </div>
                                    <div className="skill-sub">
                                        Capable de prendre un sujet, le structurer et le pousser.
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "80%" }}></span>
                                    </div>
                                </div>

                                <div className="skill-chip skill-chip--soft">
                                    <div className="skill-header">
                    <span className="skill-name">
                      Pédagogie &amp; vulgarisation
                    </span>
                                        <span className="skill-level-label">Naturel</span>
                                    </div>
                                    <div className="skill-sub">
                                        Expérience avec les jeunes, bénévolat, accompagnement.
                                    </div>
                                    <div className="skill-level-bar">
                                        <span style={{ width: "78%" }}></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section-prev-hint" data-prev="Expériences">
                        <span className="arrow">▲</span>
                        <span className="label">Revenir</span>
                        <span className="prev-name">— Expériences</span>
                    </div>

                    <div className="section-next-hint" data-next="Contact">
                        <span className="label">Continuer à défiler</span>
                        <span className="next-name">— Contact</span>
                        <span className="arrow">▼</span>
                    </div>
                </section>

                {/* CONTACT */}
                <section id="contact" className="section-animate">
                    <div className="section-inner">
                        <h3>Contact</h3>
                        <h2 className="section-title">On discute ?</h2>
                        <p>
                            Si vous cherchez un profil capable de comprendre vos enjeux, de
                            prendre en main un existant parfois un peu chaotique et de livrer
                            des solutions propres, je serai ravi d’en parler.
                        </p>

                        <p className="contact-line">
                            Mail :{" "}
                            <a href="mailto:ton.email@exemple.com">
                                ton.email@exemple.com
                            </a>
                        </p>
                        <p className="contact-line">
                            GitHub :{" "}
                            <a
                                href="https://github.com/sanjee8"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                github.com/sanjee8
                            </a>
                        </p>
                    </div>

                    <div className="section-prev-hint" data-prev="Compétences">
                        <span className="arrow">▲</span>
                        <span className="label">Revenir</span>
                        <span className="prev-name">— Compétences</span>
                    </div>
                </section>
            </main>
        </>
    );
}

export default App;
