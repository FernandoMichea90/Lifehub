// import { formatFecha } from './utils.js';
const API_URL = "/api";



function formatFecha(fechaStr) {
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    // Aseguramos que la fecha se interprete en la zona horaria local
    const [year, month, day] = fechaStr.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    return `${fecha.getDate().toString().padStart(2, '0')}-${meses[fecha.getMonth()]}`;
}

// Función para formatear números con separador de miles y decimales
function formatSaldo(saldo) {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(saldo);
}

// Variable global para almacenar la instancia del gráfico
let saldosChart = null;

// Cargar y mostrar saldos
async function cargarSaldos() {
    try {
        const res = await fetch(`${API_URL}/saldos/recientes`);
        const res2 = await fetch(`${API_URL}/saldos/`);
        const saldos = await res.json();
        const saldos2 = await res2.json();
        
        
        // Actualizar tabla
        const tbody = document.getElementById('saldosTableBody');
        tbody.innerHTML = saldos.map(s => `
            <tr class="border-b">
                <td class="px-4 py-2">${formatFecha(s.fecha)}</td>
                <td class="px-4 py-2">${formatSaldo(s.monto)}</td>
                <td class="px-4 py-2">
                    <button onclick="editarSaldo('${s.fecha}', ${s.monto})" 
                            class="text-blue-500 hover:text-blue-700 mr-2">
                        Editar
                    </button>
                    <button onclick="eliminarSaldo('${s.fecha}')" 
                            class="text-red-500 hover:text-red-700">
                        Eliminar
                    </button>
                </td>
            </tr>
        `).join('');

        // Actualizar gráfico
        actualizarGrafico(saldos2);
    } catch (error) {
        console.error('Error al cargar saldos:', error);
        alert('Error al cargar los datos');
    }
}

// Agregar nuevo saldo
async function agregarSaldo(event) {
    event.preventDefault();
    const form = event.target;
    const data = {
        fecha: form.fecha.value,
        monto: parseFloat(form.saldo.value)
    };

    try {
        await fetch(`${API_URL}/saldos/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        form.reset();
        await cargarSaldos();
    } catch (error) {
        console.error('Error al agregar saldo:', error);
        alert('Error al agregar el registro');
    }
}

// Editar saldo
function editarSaldo(fecha, saldo) {
    const form = document.getElementById('saldosForm');
    form.fecha.value = fecha;
    form.saldo.value = saldo;
    
    // Cambiar el botón de submit
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Actualizar';
    
    // Cambiar el evento del formulario
    form.onsubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_URL}/saldos/${fecha}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fecha: form.fecha.value,
                    saldo: parseFloat(form.saldo.value)
                })
            });

            form.reset();
            submitBtn.textContent = 'Agregar';
            form.onsubmit = agregarSaldo;
            await cargarSaldos();
        } catch (error) {
            console.error('Error al actualizar saldo:', error);
            alert('Error al actualizar el registro');
        }
    };
}

// Eliminar saldo
async function eliminarSaldo(fecha) {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;

    try {
        await fetch(`${API_URL}/saldos/${fecha}`, {
            method: 'DELETE'
        });

        await cargarSaldos();
    } catch (error) {
        console.error('Error al eliminar saldo:', error);
        alert('Error al eliminar el registro');
    }
}

// Actualizar gráfico
function actualizarGrafico(saldos) {
    const ctx = document.getElementById('saldosChart').getContext('2d');
    
    // Destruir el gráfico anterior si existe
    if (saldosChart) {
        saldosChart.destroy();
    }
    
    // Crear nuevo gráfico
    saldosChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: saldos.map(s => formatFecha(s.fecha)),
            datasets: [{
                label: 'Saldo',
                data: saldos.map(s => s.monto),
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
                y: { 
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return formatSaldo(value);
                        }
                    }
                }
            }
        }
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    alert('saldos.js cargado');
    cargarSaldos();
    document.getElementById('saldosForm').addEventListener('submit', agregarSaldo);
}); 