
function formatFecha(fechaStr) {
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    // Aseguramos que la fecha se interprete en la zona horaria local
    const [year, month, day] = fechaStr.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    return `${fecha.getDate().toString().padStart(2, '0')}-${meses[fecha.getMonth()]}`;
}