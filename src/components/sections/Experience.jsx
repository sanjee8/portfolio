// src/components/sections/Experience.jsx
import React, { useEffect, useState } from "react";
import copy from "../../i18n/copy";
import { formatDateToMonthYear } from "../../utils/date";

const API_URL = "http://localhost:1337/api";

export default function Experience({ lang }) {
    const { experience } = copy[lang];
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    // Helper générique pour récupérer champ_fr / champ_en
    const t = (obj, base) => {
        if (!obj) return "";
        const keyLang = `${base}_${lang}`;
        if (obj[keyLang]) return obj[keyLang];
        if (obj[base]) return obj[base];
        return "";
    };

    useEffect(() => {
        async function loadExperiences() {
            try {
                const res = await fetch(`${API_URL}/experiences?populate=tags`);
                const json = await res.json();
                const data = json.data || [];

                const sorted = [...data].sort((a, b) => {
                    const aCurrent = !!a.isCurrent;
                    const bCurrent = !!b.isCurrent;

                    if (aCurrent !== bCurrent) {
                        return bCurrent - aCurrent; // true avant false
                    }

                    const aEnd = a.endDate || a.startDate || "";
                    const bEnd = b.endDate || b.startDate || "";

                    // dates au format ISO -> comparaison string OK
                    if (aEnd < bEnd) return 1;
                    if (aEnd > bEnd) return -1;
                    return 0;
                });

                setExperiences(sorted);
            } catch (e) {
                console.error("Erreur chargement expériences", e);
            } finally {
                setLoading(false);
            }
        }
        loadExperiences();
    }, []);

    if (loading) {
        return (
            <section id="experience" className="section-animate">
                <div className="section-inner">
                    <h3>{experience.sectionLabel}</h3>
                    <h2 className="section-title">{experience.title}</h2>
                    <p>{experience.intro}</p>
                </div>
            </section>
        );
    }

    // Extraction propre des listes Strapi Rich Text
    const extractListItemsFromRichText = (blocks) => {
        if (!Array.isArray(blocks)) return [];

        const items = [];

        blocks.forEach((block) => {
            if (block.type === "list" && Array.isArray(block.children)) {
                block.children.forEach((li) => {
                    if (li.type === "list-item" && Array.isArray(li.children)) {
                        li.children.forEach((child) => {
                            if (typeof child.text === "string") {
                                const line = child.text.trim();
                                if (line) items.push(line);
                            }
                        });
                    }
                });
            }
        });

        return items;
    };

    const renderBullets = (bulletsRaw) => {
        if (!bulletsRaw) return null;

        // Cas : tableau simple de strings
        if (Array.isArray(bulletsRaw) && bulletsRaw.every((b) => typeof b === "string")) {
            if (!bulletsRaw.length) return null;
            return (
                <div className="xp-body">
                    <ul>
                        {bulletsRaw.map((line, idx) => (
                            <li key={idx}>{line}</li>
                        ))}
                    </ul>
                </div>
            );
        }

        // Cas Rich Text
        const items = extractListItemsFromRichText(bulletsRaw);
        if (!items.length) return null;

        return (
            <div className="xp-body">
                <ul>
                    {items.map((line, idx) => (
                        <li key={idx}>{line}</li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <section id="experience" className="section-animate">
            <div className="section-inner">
                <h3>{experience.sectionLabel}</h3>
                <h2 className="section-title">{experience.title}</h2>
                <p>{experience.intro}</p>

                <div className="xp-cosmic">
                    <div className="xp-cosmic-rail"></div>

                    {experiences.map((exp) => {
                        const tags = exp.tags ?? [];
                        const currentLabel = experience.currentLabel;
                        const isCurrent = !!exp.isCurrent;

                        const typeClass =
                            exp.type === "formation"
                                ? "xp-type-formation"
                                : exp.type === "benevolat"
                                    ? "xp-type-benevole"
                                    : "xp-type-alt";

                        const title = t(exp, "title");
                        const summary = t(exp, "summary");

                        const bulletsLang =
                            exp[`bullets_${lang}`] ||
                            exp.bullets_fr ||
                            exp.bullets_en ||
                            exp.bullets;

                        return (
                            <article
                                key={exp.id}
                                className={`xp-cosmic-item ${typeClass} ${
                                    exp.highlight ? "xp-main" : ""
                                }`}
                            >
                                <div className="xp-marker"></div>

                                <div className="xp-card">
                                    <div className="xp-card-inner">
                                        {/* Métadonnées */}
                                        <div className="xp-meta">
                                            <span className="xp-meta-date">
                                                {formatDateToMonthYear(exp.startDate)} –{" "}
                                                {isCurrent
                                                    ? currentLabel
                                                    : formatDateToMonthYear(exp.endDate)}
                                            </span>

                                            {exp.type && (
                                                <span className="xp-meta-type">
                                                    {exp.type.toUpperCase()}
                                                </span>
                                            )}

                                            {exp.company && <span>· {exp.company}</span>}
                                            {exp.team && <span>· {exp.team}</span>}
                                        </div>

                                        {/* Titre */}
                                        {title && <h4 className="xp-role">{title}</h4>}

                                        {/* Société */}
                                        {exp.company && (
                                            <div className="xp-company">{exp.company}</div>
                                        )}

                                        {/* Tags */}
                                        {tags.length > 0 && (
                                            <div className="xp-badges">
                                                {tags.map((t) => (
                                                    <span key={t.id}>{t.label}</span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Summary */}
                                        {summary && (
                                            <p className="xp-summary" style={{ opacity: 0.9 }}>
                                                {summary}
                                            </p>
                                        )}

                                        {/* Bullets */}
                                        {renderBullets(bulletsLang)}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            {/* Hints navigation */}
            <div className="section-prev-hint" data-prev={experience.prevName}>
                <span className="arrow">▲</span>
                <span className="label">{experience.prevLabel}</span>
                <span className="prev-name">{experience.prevName}</span>
            </div>

            <div className="section-next-hint" data-next={experience.nextName}>
                <span className="label">{experience.nextLabel}</span>
                <span className="next-name">{experience.nextName}</span>
                <span className="arrow">▼</span>
            </div>
        </section>
    );
}
