// Función para incluir componentes HTML
async function includeHTML(elementId, path) {
    try {
        const response = await fetch(path);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error cargando ${path}:`, error);
    }
}

// Cargar header y footer cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    includeHTML('header-container', '/components/header.html');
    includeHTML('footer-container', '/components/footer.html');
}); 