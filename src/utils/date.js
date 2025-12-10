export function formatDateToMonthYear(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
        month: "long",
        year: "numeric"
    }).format(date);
}
