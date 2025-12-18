import React from "react";
import copy from "../../i18n/copy";

export default function About({ lang }) {
    const { about } = copy[lang];

    return (
        <section id="about" className="section-animate">
            <div className="section-inner">
                <div>
                    <h3>{about.sectionLabel}</h3>
                    <h2 className="section-title">{about.title}</h2>


                    <blockquote>
                        {about.quote }
                        <span>— {about.author}</span>
                    </blockquote>


                    <p>{about.p1}</p>
                    <p>{about.p2}</p>
                </div>

                <div className="about-photo">
                    <div className="about-photo-inner">
                    <img
                            src=""
                            alt="Portrait professionnel de Sanjeevan"
                        />
                    </div>
                </div>
            </div>

            <div className="section-prev-hint" data-prev={about.prevName}>
                <span className="arrow">▲</span>
                <span className="label">{about.prevLabel}</span>
                <span className="prev-name">{about.prevName}</span>
            </div>

            <div className="section-next-hint" data-next={about.nextName}>
                <span className="label">{about.nextLabel}</span>
                <span className="next-name">{about.nextName}</span>
                <span className="arrow">▼</span>
            </div>
        </section>
    );
}
