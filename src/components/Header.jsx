import React from "react";
import copy from "../i18n/copy";
import { hideAllScrollHints } from "../utils/scrollHints";

export default function Header({ lang, onLangChange }) {
    const { nav } = copy[lang];

    const handleNavClick = (e, targetId) => {
        e.preventDefault();

        // 1) On cache tous les hints "Revenir / Continuer"
        hideAllScrollHints();

        // 2) Scroll smooth vers la section
        const el = document.getElementById(targetId);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header>
            <h1>R Rammohan</h1>
            <nav className="fluid-nav">
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
            <div className="lang-switcher">
                <button
                    className={`lang-btn ${lang === "fr" ? "is-active" : ""}`}
                    onClick={() => onLangChange("fr")}
                >
                    FR
                </button>
                <button
                    className={`lang-btn ${lang === "en" ? "is-active" : ""}`}
                    onClick={() => onLangChange("en")}
                >
                    EN
                </button>
            </div>
        </header>
    );
}
