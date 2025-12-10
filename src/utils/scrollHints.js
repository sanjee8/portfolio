export function hideAllScrollHints() {
    const hints = document.querySelectorAll(
        ".section-next-hint, .section-prev-hint"
    );
    hints.forEach((el) => el.classList.remove("is-visible"));
}