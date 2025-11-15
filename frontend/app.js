// Configura aquí la URL de tu backend
const API_URL = "/api";  // Ahora usamos el proxy de Nginx

// Función para formatear fechas al formato corto (ej: 30-may)
function formatFecha(fechaStr) {
    console.log(fechaStr);
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    // Aseguramos que la fecha se interprete en la zona horaria local
    const [year, month, day] = fechaStr.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    console.log(`fecha: ${fecha.getDate().toString().padStart(2, '0')}-${meses[fecha.getMonth()]}`);
    return `${fecha.getDate().toString().padStart(2, '0')}-${meses[fecha.getMonth()]}`;
}

// Función para formatear moneda
function formatMoneda(valor) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(valor);
}

async function fetchSaldos() {
    const res = await fetch(`${API_URL}/saldos/`);
    return await res.json();
}

async function fetchCalorias() {
    const res = await fetch(`${API_URL}/calorias/`);
    return await res.json();
}

async function fetchDashboard() {
    const res = await fetch(`${API_URL}/dashboard/resumen`);
    return await res.json();
}

async function actualizarResumen() {
    try {
        const resumen = await fetchDashboard();
        
        // Actualizar saldos
        // document.getElementById('promedio-saldos').textContent = formatMoneda(resumen.saldos.promedio);
        if (resumen.saldos.ultimo_registro) {
            document.getElementById('ultimo-saldos').textContent = formatMoneda(resumen.saldos.ultimo_registro.monto);
        }
        
        // Actualizar calorías
        document.getElementById('promedio-calorias').textContent = Math.round(resumen.calorias.promedio);
        if (resumen.calorias.ultimo_registro) {
            document.getElementById('ultimo-calorias').textContent = resumen.calorias.ultimo_registro.calorias;
        }
        
        // Actualizar última actualización
        const ultimaFecha = resumen.saldos.ultimo_registro?.fecha || resumen.calorias.ultimo_registro?.fecha;
        if (ultimaFecha) {
            document.getElementById('ultima-actualizacion').textContent = formatFecha(ultimaFecha);
        }
    } catch (error) {
        console.error('Error al cargar el resumen:', error);
    }
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

window.addEventListener('DOMContentLoaded', () => {
    renderCharts();
    actualizarResumen();
}); 