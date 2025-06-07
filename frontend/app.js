// Configura aquí la URL de tu backend
const API_URL = "/api";  // Ahora usamos el proxy de Nginx

// Aquí irá la lógica de la aplicación frontend 

// Función para formatear fechas al formato corto (ej: 30-may)
function formatFecha(fechaStr) {
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const fecha = new Date(fechaStr);
    return `${fecha.getDate().toString().padStart(2, '0')}-${meses[fecha.getMonth()]}`;
}

async function fetchSaldos() {
    const res = await fetch(`${API_URL}/saldos/`);
    return await res.json();
}

async function fetchCalorias() {
    const res = await fetch(`${API_URL}/calorias/`);
    return await res.json();
}

async function renderCharts() {
    // Saldo Bancario
    const saldos = await fetchSaldos();
    const saldoLabels = saldos.map(s => formatFecha(s.fecha));
    const saldoData = saldos.map(s => s.monto);

    new Chart(document.getElementById('saldoChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: saldoLabels,
            datasets: [{
                label: 'Saldo ($)',
                data: saldoData,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37,99,235,0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#2563eb',
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: false }
            }
        }
    });

    // Calorías
    const calorias = await fetchCalorias();
    const caloriasLabels = calorias.map(c => formatFecha(c.fecha));
    const caloriasData = calorias.map(c => c.calorias);

    new Chart(document.getElementById('caloriasChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: caloriasLabels,
            datasets: [{
                label: 'Calorías',
                data: caloriasData,
                borderColor: '#f59e42',
                backgroundColor: 'rgba(245,158,66,0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#f59e42',
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}

window.addEventListener('DOMContentLoaded', renderCharts); 