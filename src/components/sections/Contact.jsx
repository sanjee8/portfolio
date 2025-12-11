// src/components/sections/Contact.jsx
import React, { useState } from "react";
import copy from "../../i18n/copy";

const PROFILE = {
    email: "rsanjee19@gmail.com",
    github: "https://github.com/sanjee8",
    linkedin: "https://www.linkedin.com/in/ramsanjeevan-rammohan/",
    cvUrl: "/CV_Rammohan.pdf", // adapte le chemin si besoin
};

function CvModal({ cvUrl, onClose, lang }) {
    const title = lang === "fr" ? "Mon CV" : "My resume";
    const downloadLabel = lang === "fr" ? "Télécharger le CV" : "Download CV";
    const closeLabel = lang === "fr" ? "Fermer" : "Close";

    React.useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    const onBackdropClick = (e) => {
        if (e.target.classList.contains("cv-modal-backdrop")) {
            onClose();
        }
    };

    return (
        <div className="cv-modal-backdrop" onClick={onBackdropClick}>
            <div className="cv-modal">
                <div className="cv-modal-header">
                    <h3>{title}</h3>
                    <div className="cv-modal-actions">
                        <a href={cvUrl} download className="cv-modal-download">
                            {downloadLabel}
                        </a>
                        <button
                            type="button"
                            className="cv-modal-close"
                            onClick={onClose}
                            aria-label={closeLabel}
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="cv-modal-body">
                    <iframe
                        src={cvUrl}
                        title={title}
                        className="cv-modal-iframe"
                    />
                </div>
            </div>
        </div>
    );
}

export default function Contact({ lang }) {
    const { contact } = copy[lang];
    const [isCvOpen, setIsCvOpen] = useState(false);

    return (
        <section id="contact" className="section-animate">
            <div className="section-inner">
                <h3>{contact.sectionLabel}</h3>
                <h2 className="section-title">{contact.title}</h2>
                <p>{contact.intro}</p>

                {/* Boutons avec grands icônes flat */}
                <div className="contact-grid">
                    {/* GitHub */}
                    <a
                        href={PROFILE.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-bigbtn"
                    >
                        <svg viewBox="0 0 24 24" className="contact-bigicon">
                            <path
                                fill="currentColor"
                                d="M12 2C6.47 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 9.68.5.09.68-.22.68-.48
                   0-.24-.01-.87-.01-1.71-2.48.55-3-1.22-3-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63
                   1 .07 1.53 1.05 1.53 1.05.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-1.98-.23-4.06-1.02-4.06-4.55
                   0-1.01.35-1.83.93-2.47-.09-.23-.4-1.17.09-2.44 0 0 .75-.25 2.46.95A8.2 8.2 0 0 1 12 7.07c.76 0
                   1.52.11 2.23.33 1.7-1.2 2.45-.95 2.45-.95.49 1.27.18 2.21.09 2.44.58.64.93 1.46.93 2.47
                   0 3.54-2.09 4.32-4.08 4.55.36.32.68.94.68 1.9
                   0 1.37-.01 2.47-.01 2.81 0 .26.18.57.69.47A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
                            />
                        </svg>
                        <span>{contact.buttonGithub || "GitHub"}</span>
                    </a>

                    {/* CV -> ouvre le modal */}
                    <button
                        type="button"
                        className="contact-bigbtn contact-bigbtn--button"
                        onClick={() => setIsCvOpen(true)}
                    >
                        <svg viewBox="0 0 24 24" className="contact-bigicon">
                            <path
                                fill="currentColor"
                                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 2.5L18.5 9H14Z"
                            />
                            <path fill="currentColor" d="M8 13h8v1.5H8Zm0 3h5v1.5H8Z" />
                        </svg>
                        <span>{contact.buttonCV || "CV"}</span>
                    </button>

                    {/* LinkedIn */}
                    <a
                        href={PROFILE.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-bigbtn"
                    >
                        <svg viewBox="0 0 24 24" className="contact-bigicon">
                            <path
                                fill="currentColor"
                                d="M6.09 6.5A2.09 2.09 0 1 1 4 4.41 2.09 2.09 0 0 1 6.09 6.5ZM4.25 8.5h3.7V20h-3.7ZM10 8.5h3.55v1.57h.05A3.9 3.9 0 0 1 17 8.18c3.7 0
                4.38 2.44 4.38 5.6V20H17.7v-5.1c0-1.22 0-2.79-1.7-2.79s-2 1.33-2 2.7V20H10Z"
                            />
                        </svg>
                        <span>{contact.buttonLinkedIn || "LinkedIn"}</span>
                    </a>

                    {/* Email direct */}
                    <a
                        href={`mailto:${PROFILE.email}`}
                        className="contact-bigbtn"
                    >
                        <svg viewBox="0 0 24 24" className="contact-bigicon">
                            <path
                                fill="currentColor"
                                d="M4 4h16a2 2 0 0 1 2 2v.35l-10 6.25L2 6.35V6a2 2 0 0 1 2-2Zm0 4.44V18h16V8.44l-7.6 4.74a2 2 0 0 1-2.1 0Z"
                            />
                        </svg>
                        <span>{contact.buttonEmail || contact.mailLabel || "Email"}</span>
                    </a>
                </div>


            </div>

            <div className="section-prev-hint" data-prev={contact.prevName}>
                <span className="arrow">▲</span>
                <span className="label">{contact.prevLabel}</span>
                <span className="prev-name">{contact.prevName}</span>
            </div>

            {isCvOpen && (
                <CvModal
                    cvUrl={PROFILE.cvUrl}
                    onClose={() => setIsCvOpen(false)}
                    lang={lang}
                />
            )}
        </section>
    );
}
