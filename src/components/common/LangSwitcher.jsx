import React from "react";

export default function LangSwitcher({ lang, onChangeLang, className = "" }) {
    const isActive = (code) => (lang === code ? "is-active" : "");

    return (
        <div className={`lang-switcher ${className}`}>
            <button
                type="button"
                className={`lang-btn ${isActive("fr")}`}
                onClick={() => onChangeLang("fr")}
            >
                FR
            </button>
            <button
                type="button"
                className={`lang-btn ${isActive("en")}`}
                onClick={() => onChangeLang("en")}
            >
                EN
            </button>
        </div>
    );
}
