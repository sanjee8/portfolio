import React from "react";
import copy from "../../i18n/copy";

export default function Contact({ lang }) {
    const { contact } = copy[lang];

    return (
        <section id="contact" className="section-animate">
            <div className="section-inner">
                <h3>{contact.sectionLabel}</h3>
                <h2 className="section-title">{contact.title}</h2>
                <p>{contact.intro}</p>

                <p className="contact-line">
                    {contact.mailLabel} :{" "}
                    <a href="mailto:ton.email@exemple.com">ton.email@exemple.com</a>
                </p>
                <p className="contact-line">
                    {contact.githubLabel} :{" "}
                    <a
                        href="https://github.com/sanjee8"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        github.com/sanjee8
                    </a>
                </p>
            </div>

            <div className="section-prev-hint" data-prev={contact.prevName}>
                <span className="arrow">▲</span>
                <span className="label">{contact.prevLabel}</span>
                <span className="prev-name">{contact.prevName}</span>
            </div>
        </section>
    );
}
