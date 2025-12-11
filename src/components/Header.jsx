import React, { useState } from "react";
import copy from "../i18n/copy";
import LangSwitcher from "../components/common/LangSwitcher";

export default function Header({ lang, onChangeLang }) {
    const { nav } = copy[lang];
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        setMobileOpen(false);

        const target = document.getElementById(targetId);
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const offset = window.scrollY + rect.top;

        window.scrollTo({
            top: offset,
            behavior: "smooth",
        });
    };

    const toggleMobile = () => setMobileOpen((prev) => !prev);
    const closeMobile = () => setMobileOpen(false);

    return (
        <>
            {/* HEADER GLOBAL */}
            <header className="site-header">
                <h1 className="site-logo">R Rammohan</h1>

                <nav className="desktop-nav">
                    <a href="#home" onClick={(e) => handleNavClick(e, "home")}>
                        {nav.home}
                    </a>
                    <a href="#about" onClick={(e) => handleNavClick(e, "about")}>
                        {nav.about}
                    </a>
                    <a href="#experience" onClick={(e) => handleNavClick(e, "experience")}>
                        {nav.experience}
                    </a>
                    <a href="#skills" onClick={(e) => handleNavClick(e, "skills")}>
                        {nav.skills}
                    </a>
                    <a href="#contact" onClick={(e) => handleNavClick(e, "contact")}>
                        {nav.contact}
                    </a>
                </nav>

                <div className="desktop-lang">
                    <LangSwitcher lang={lang} onChangeLang={onChangeLang} />
                </div>

                {/* BOUTON BURGER (desktop: caché en CSS) */}
                <button
                    type="button"
                    className={`nav-toggle ${mobileOpen ? "is-open" : ""}`}
                    onClick={toggleMobile}
                    aria-label="Navigation"
                >
                    <span className="nav-toggle-line nav-toggle-line--top"></span>
                    <span className="nav-toggle-line nav-toggle-line--middle"></span>
                    <span className="nav-toggle-line nav-toggle-line--bottom"></span>
                </button>
            </header>

            {/* OVERLAY MOBILE */}
            <div
                className={`mobile-nav-overlay ${mobileOpen ? "is-open" : ""}`}
                onClick={closeMobile}
            >
                <div
                    className="mobile-nav-inner"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mobile-nav-header">
                        <div className="mobile-logo">R Rammohan</div>

                        <button
                            type="button"
                            className={`nav-toggle nav-toggle--close ${
                                mobileOpen ? "is-open" : ""
                            }`}
                            onClick={toggleMobile}
                            aria-label="Fermer la navigation"
                        >
                            <span className="nav-toggle-line nav-toggle-line--top"></span>
                            <span className="nav-toggle-line nav-toggle-line--middle"></span>
                            <span className="nav-toggle-line nav-toggle-line--bottom"></span>
                        </button>
                    </div>

                    <nav className="mobile-nav">
                        <a href="#home" onClick={(e) => handleNavClick(e, "home")}>
                            {nav.home}
                        </a>
                        <a href="#about" onClick={(e) => handleNavClick(e, "about")}>
                            {nav.about}
                        </a>
                        <a href="#experience" onClick={(e) => handleNavClick(e, "experience")}>
                            {nav.experience}
                        </a>
                        <a href="#skills" onClick={(e) => handleNavClick(e, "skills")}>
                            {nav.skills}
                        </a>
                        <a href="#contact" onClick={(e) => handleNavClick(e, "contact")}>
                            {nav.contact}
                        </a>
                    </nav>

                    <div className="mobile-lang">
                        <LangSwitcher lang={lang} onChangeLang={onChangeLang} />
                    </div>
                </div>
            </div>
        </>
    );
}
