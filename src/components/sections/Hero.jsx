import React from "react";
import copy from "../../i18n/copy";
import { hideAllScrollHints } from "../../utils/scrollHints";

export default function Hero({ lang }) {
    const { hero } = copy[lang];

    const handleClick = (e, id) => {
        e.preventDefault();
        hideAllScrollHints();
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section id="home">
            <div className="section-inner hero-text">
                <h2>
                    <span className="hero-title-main">{hero.titleMain}</span>
                    <span className="hero-title-intro">{hero.subtitle}</span>
                </h2>

                <div className="hero-links fluid-nav">
                    <a href="#about" onClick={(e) => handleClick(e, "about")}>
                        {hero.ctaAbout}
                    </a>
                    <a href="#experience" onClick={(e) => handleClick(e, "experience")}>
                        {hero.ctaExperience}
                    </a>
                    <a href="#skills" onClick={(e) => handleClick(e, "skills")}>
                        {hero.ctaSkills}
                    </a>
                    <a href="#contact" onClick={(e) => handleClick(e, "contact")}>
                        {hero.ctaContact}
                    </a>
                </div>
            </div>

            <div className="section-next-hint" data-next={hero.hintNextName}>
                <span className="label">{hero.hintNextLabel}</span>
                <span className="next-name">{hero.hintNextName}</span>
                <span className="arrow">▼</span>
            </div>
        </section>
    );
}
