// Validación de sesión
const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api'
    : '/api';

const tableBody = document.getElementById('adoptionTableBody');

// Aquí guardamos los cambios que el admin hace en la tabla antes de enviarlos al servidor
let pendingChanges = {}; // Formato: { requestId: 'approved' | 'rejected' }

/**
 * Carga todas las solicitudes de adopción para que el admin las revise.
 */
async function fetchAdoptions() {
    try {
        const response = await fetch(`${API_URL}/adoptions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const adoptions = await response.json();

        tableBody.innerHTML = '';
        if (adoptions.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No hay solicitudes pendientes de revisión.</td></tr>';
            return;
        }

        adoptions.forEach(req => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${req.Pet.name}</strong> (${req.Pet.species})</td>
                <td>${req.User.username} <br><small style="color: var(--text-muted)">${req.User.email || 'Sin email registrado'}</small></td>
                <td>${new Date(req.requestDate).toLocaleDateString()}</td>
                <td><span id="badge-${req.id}" class="badge badge-${req.status}">${req.status === 'pending' ? 'Pendiente' : req.status === 'approved' ? 'Aprobada' : 'Rechazada'}</span></td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; background: #dcfce7; color: #166534; border: 1px solid #166534;" 
                                onclick="queueChange(${req.id}, 'approved')">Aprobar</button>
                        <button class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; border-color: #fee2e2; color: var(--danger);" 
                                onclick="queueChange(${req.id}, 'rejected')">Rechazar</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar solicitudes:', error);
    }
}

/**
 * "Encola" un cambio localmente para que el admin vea el efecto visual 
 * antes de procesar todo el lote.
 */
window.queueChange = (id, status) => {
    pendingChanges[id] = status;
    const badge = document.getElementById(`badge-${id}`);
    badge.textContent = (status === 'approved' ? 'Aprobar' : 'Rechazar') + '*';
    badge.className = `badge badge-${status}`;
    badge.style.opacity = '0.7'; // Indicamos que es un cambio pendiente de guardar
};

/**
 * Procesa todos los cambios encolados enviándolos en un solo envío al servidor.
 * Este proceso es altamente eficiente gracias al manejo asíncrono en el backend.
 */
document.getElementById('batchProcessBtn').addEventListener('click', async () => {
    const requests = Object.entries(pendingChanges).map(([id, status]) => ({
        id: parseInt(id),
        status
    }));

    if (requests.length === 0) {
        alert('No has realizado ningún cambio para procesar.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/adoptions/batch`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ requests })
        });

        if (response.ok) {
            alert('¡Cambios procesados correctamente! Las mascotas han sido actualizadas. 🐾');
            pendingChanges = {}; // Limpiamos la cola
            fetchAdoptions();   // Recargamos la tabla
        } else {
            alert('Hubo un error al procesar las solicitudes.');
        }
    } catch (error) {
        alert('Error de conexión con el servidor.');
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

// Carga inicial
fetchAdoptions();
