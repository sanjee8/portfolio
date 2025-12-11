// src/components/sections/Skills.jsx
import React, { useEffect, useState } from "react";
import copy from "../../i18n/copy";
import { API_URL } from "../../config/api";


export default function Skills({ lang }) {
    const { skills: skillsCopy } = copy[lang];

    const [skillsByCategory, setSkillsByCategory] = useState({});
    const [categories, setCategories] = useState([]);
    const [activeSlug, setActiveSlug] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSkills() {
            try {
                const [catRes, skillRes] = await Promise.all([
                    fetch(`${API_URL}/skill-categories?sort=order`),
                    fetch(`${API_URL}/skills?populate=category`),
                ]);

                const catJson = await catRes.json();
                const skillJson = await skillRes.json();

                const catData = catJson.data || [];
                const skillData = skillJson.data || [];

                // Strapi v5 : champs à la racine
                const cats = catData.map((c) => ({
                    id: c.id,
                    slug: c.slug,
                    order: c.order,
                    name_fr: c.name_fr,
                    name_en: c.name_en,
                }));

                // Dictionnaire slug -> []
                const grouped = {};
                cats.forEach((c) => {
                    if (c.slug) {
                        grouped[c.slug] = [];
                    }
                });

                // Répartition des skills par catégorie
                skillData.forEach((s) => {
                    const categoriesForSkill = Array.isArray(s.category)
                        ? s.category
                        : [];

                    categoriesForSkill.forEach((cat) => {
                        const catSlug = cat.slug;
                        if (!catSlug) return;

                        if (!grouped[catSlug]) {
                            grouped[catSlug] = [];
                        }

                        grouped[catSlug].push({
                            ...s,
                            categorySlug: catSlug,
                        });
                    });
                });

                setCategories(cats);
                setSkillsByCategory(grouped);

                // slug actif par défaut = 1ère catégorie
                const defaultSlug = cats[0]?.slug || "";
                setActiveSlug(defaultSlug);
            } catch (e) {
                console.error("Erreur chargement skills", e);
            } finally {
                setLoading(false);
            }
        }

        loadSkills();
    }, []);

    const getCategoryLabel = (cat) => {
        if (!cat) return "";
        if (lang === "en") {
            return cat.name_en || cat.name_fr || cat.slug;
        }
        return cat.name_fr || cat.name_en || cat.slug;
    };

    const getSkillName = (skill) => {
        if (lang === "en") {
            return skill.name_en || skill.name_fr || "";
        }
        return skill.name_fr || skill.name_en || "";
    };

    const getSkillDescription = (skill) => {
        if (lang === "en") {
            return skill.description_en || skill.description_fr || "";
        }
        return skill.description_fr || skill.description_en || "";
    };

    const getSkillLevelLabel = (skill) => {
        if (lang === "en") {
            return skill.levelLabel_en || skill.levelLabel_fr || "";
        }
        return skill.levelLabel_fr || skill.levelLabel_en || "";
    };

    const getSkillCssClass = (catSlug, explicitClass) => {
        if (explicitClass) return explicitClass;

        switch (catSlug) {
            case "backend":
            case "backend-and-ap-is":
                return "skill-chip--backend";
            case "frontend":
                return "skill-chip--frontend";
            case "tools":
                return "skill-chip--tools";
            case "soft":
                return "skill-chip--soft";
            default:
                return "";
        }
    };

    if (loading) {
        return (
            <section id="skills" className="section-animate">
                <div className="section-inner">
                    <h3>{skillsCopy.sectionLabel}</h3>
                    <h2 className="section-title">{skillsCopy.title}</h2>
                    <p className="skills-intro">{skillsCopy.intro}</p>
                    <p>Chargement des compétences…</p>
                </div>
            </section>
        );
    }

    if (!categories.length) {
        return (
            <section id="skills" className="section-animate">
                <div className="section-inner">
                    <h3>{skillsCopy.sectionLabel}</h3>
                    <h2 className="section-title">{skillsCopy.title}</h2>
                    <p className="skills-intro">{skillsCopy.intro}</p>
                    <p>Aucune catégorie de compétences configurée dans le CMS.</p>
                </div>
            </section>
        );
    }

    const activeSkills = activeSlug ? skillsByCategory[activeSlug] || [] : [];

    return (
        <section id="skills" className="section-animate">
            <div className="section-inner">
                <h3>{skillsCopy.sectionLabel}</h3>
                <h2 className="section-title">{skillsCopy.title}</h2>

                <p className="skills-intro">{skillsCopy.intro}</p>

                {/* TABS dynamiques depuis l'API */}
                <div className="skills-tabs" role="tablist">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`skills-tab ${
                                cat.slug === activeSlug ? "is-active" : ""
                            }`}
                            role="tab"
                            onClick={() => setActiveSlug(cat.slug)}
                        >
                            {getCategoryLabel(cat)}
                        </button>
                    ))}
                </div>

                {/* PANELS */}
                <div className="skills-panels">
                    <div className="skills-panel is-active">
                        {activeSkills.map((skill) => {
                            const chipClass = getSkillCssClass(
                                skill.categorySlug,
                                skill.categoryClass
                            );

                            return (
                                <div key={skill.id} className={`skill-chip ${chipClass}`}>
                                    <div className="skill-header">
                    <span className="skill-name">
                      {getSkillName(skill)}
                    </span>
                                        {getSkillLevelLabel(skill) && (
                                            <span className="skill-level-label">
                        {getSkillLevelLabel(skill)}
                      </span>
                                        )}
                                    </div>

                                    {getSkillDescription(skill) && (
                                        <div className="skill-sub">
                                            {getSkillDescription(skill)}
                                        </div>
                                    )}

                                    <div className="skill-level-bar">
                    <span
                        style={{ width: `${skill.levelPercent || 70}%` }}
                    ></span>
                                    </div>
                                </div>
                            );
                        })}

                        {activeSkills.length === 0 && (
                            <p>Aucune compétence pour cette catégorie pour l’instant.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="section-prev-hint" data-prev={skillsCopy.prevName}>
                <span className="arrow">▲</span>
                <span className="label">{skillsCopy.prevLabel}</span>
                <span className="prev-name">{skillsCopy.prevName}</span>
            </div>

            <div className="section-next-hint" data-next={skillsCopy.nextName}>
                <span className="label">{skillsCopy.nextLabel}</span>
                <span className="next-name">{skillsCopy.nextName}</span>
                <span className="arrow">▼</span>
            </div>
        </section>
    );
}
