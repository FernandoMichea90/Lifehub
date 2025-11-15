const API_URL = "/api";

// Función para formatear fechas al formato corto (ej: 30-may)
function formatFecha(fechaStr) {
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const fecha = new Date(fechaStr);
    return `${fecha.getDate().toString().padStart(2, '0')}-${meses[fecha.getMonth()]}`;
}

// Variable global para almacenar la instancia del gráfico
let caloriasChart = null;

// Cargar y mostrar calorías
async function cargarCalorias() {
    try {
        const res = await fetch(`${API_URL}/calorias/`);
        const calorias = await res.json();
        
        // Actualizar tabla
        const tbody = document.getElementById('caloriasTableBody');
        tbody.innerHTML = calorias.map(c => `
            <tr class="border-b">
                <td class="px-4 py-2">${formatFecha(c.fecha)}</td>
                <td class="px-4 py-2">${c.calorias}</td>
                <td class="px-4 py-2">
                    <button onclick="editarCaloria('${c.fecha}', ${c.calorias})" 
                            class="text-blue-500 hover:text-blue-700 mr-2">
                        Editar
                    </button>
                    <button onclick="eliminarCaloria('${c.fecha}')" 
                            class="text-red-500 hover:text-red-700">
                        Eliminar
                    </button>
                </td>
            </tr>
        `).join('');                

        // Actualizar gráfico
        actualizarGrafico(calorias);





    } catch (error) {
        console.error('Error al cargar calorías:', error);
        alert('Error al cargar los datos');
    }
}

// Agregar nueva caloría
async function agregarCaloria(event) {
    event.preventDefault();
    const form = event.target;
    const data = {
        fecha: form.fecha.value,
        calorias: parseInt(form.calorias.value)
    };

    try {
        await fetch(`${API_URL}/calorias/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        form.reset();
        await cargarCalorias();
    } catch (error) {
        console.error('Error al agregar calorías:', error);
        alert('Error al agregar el registro');
    }
}

// Editar caloría
function editarCaloria(fecha, calorias) {
    const form = document.getElementById('caloriasForm');
    form.fecha.value = fecha;
    form.calorias.value = calorias;
    
    // Cambiar el botón de submit
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Actualizar';
    
    // Cambiar el evento del formulario
    form.onsubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_URL}/calorias/${fecha}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fecha: form.fecha.value,
                    calorias: parseInt(form.calorias.value)
                })
            });

            form.reset();
            submitBtn.textContent = 'Agregar';
            form.onsubmit = agregarCaloria;
            await cargarCalorias();
        } catch (error) {
            console.error('Error al actualizar calorías:', error);
            alert('Error al actualizar el registro');
        }
    };
}

// Eliminar caloría
async function eliminarCaloria(fecha) {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;

    try {
        await fetch(`${API_URL}/calorias/${fecha}`, {
            method: 'DELETE'
        });

        await cargarCalorias();
    } catch (error) {
        console.error('Error al eliminar calorías:', error);
        alert('Error al eliminar el registro');
    }
}

// Actualizar gráfico
function actualizarGrafico(calorias) {
    const ctx = document.getElementById('caloriasChart').getContext('2d');
    
    // Destruir el gráfico anterior si existe
    if (caloriasChart) {
        caloriasChart.destroy();
    }
    
    // Crear nuevo gráfico
    caloriasChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: calorias.map(c => formatFecha(c.fecha)),
            datasets: [{
                label: 'Calorías',
                data: calorias.map(c => c.calorias),
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
            scales: { y: { beginAtZero: false } }
        }
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarCalorias();
    document.getElementById('caloriasForm').addEventListener('submit', agregarCaloria);
}); 