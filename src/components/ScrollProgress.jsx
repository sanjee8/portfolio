import { useEffect, useRef } from "react";

export default function ScrollProgress() {
    const barRef = useRef(null);

    useEffect(() => {
        function handleScroll() {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? scrollTop / docHeight : 0;
            if (barRef.current) {
                barRef.current.style.transform = `scaleX(${progress})`;
            }
        }

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // init

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return <div id="scroll-progress" ref={barRef} />;
}
