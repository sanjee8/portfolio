import React, { useState } from "react";
import "./index.css";

import Starfield from "./components/Starfield";
import ScrollProgress from "./components/ScrollProgress";
import Header from "./components/Header";

import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Experience from "./components/sections/Experience";
import Skills from "./components/sections/Skills";
import Contact from "./components/sections/Contact";

import useScrollNavigation from "./hooks/useScrollNavigation";

function App() {
    const [lang, setLang] = useState("fr");

    useScrollNavigation();

    return (
        <>
            <Starfield />
            <ScrollProgress />

            <Header lang={lang} onChangeLang={setLang} />

            <main>
                <Hero lang={lang} />
                <About lang={lang} />
                <Experience lang={lang} />
                <Skills lang={lang} />
                <Contact lang={lang} />
            </main>
        </>
    );
}

export default App;
