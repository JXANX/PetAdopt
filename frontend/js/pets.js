// Obtenemos el token del almacenamiento local para validar que el usuario esté logueado
const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

// Configuración de la URL de la API según el entorno
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api'
    : '/api';

const petGrid = document.getElementById('petGrid');

/**
 * Función principal para traer la lista de mascotas desde el servidor.
 * Se encarga de construir las "cards" dinámicamente.
 */
async function fetchPets() {
    try {
        const response = await fetch(`${API_URL}/pets`);
        const pets = await response.json();

        petGrid.innerHTML = '';
        if (pets.length === 0) {
            petGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">No hay mascotas registradas todavía. ¡Sé el primero en agregar una! 🐾</p>';
            return;
        }

        pets.forEach(pet => {
            // Ajuste para la carga de imágenes en local vs producción
            const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:3001'
                : '';

            // Si la mascota no tiene foto, usamos una imagen amigable por defecto
            const photoSrc = pet.photoUrl ? `${API_BASE}${pet.photoUrl}` : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop';

            const card = document.createElement('div');
            card.className = 'pet-card';
            card.innerHTML = `
                <img src="${photoSrc}" alt="${pet.name}" class="pet-image">
                <div class="pet-info">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <h3>${pet.name}</h3>
                        <span class="badge badge-${pet.status}">${pet.status === 'available' ? 'Disponible' : pet.status === 'pending' ? 'En espera' : 'Adoptado'}</span>
                    </div>
                    <p class="breed">${pet.species} • ${pet.breed || 'Mestizo'} • ${pet.age} años</p>
                    <p style="font-size: 0.875rem; color: var(--text); margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${pet.description || 'Este peludito busca un hogar lleno de amor. ¡Pregunta por él!'}
                    </p>
                    <div class="pet-footer">
                        ${pet.status === 'available'
                    ? `<button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;" onclick="requestAdoption(${pet.id}, '${pet.name}')">Adoptar 🐾</button>`
                    : ''
                }
                        <button class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;" onclick="location.href='pet-form.html?id=${pet.id}'">Detalles</button>
                    </div>
                </div>
            `;
            petGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error al cargar mascotas:', error);
    }
}

// --- Gestión de Borrado (Solo si es necesario) ---
let petToDelete = null;
const modal = document.getElementById('deleteModal');
const closeBtn = document.querySelector('.close-modal');

window.deletePet = (id) => {
    petToDelete = id;
    modal.style.display = 'flex';
};

closeBtn.onclick = () => modal.style.display = 'none';
document.getElementById('cancelDelete').onclick = () => modal.style.display = 'none';

document.getElementById('confirmDelete').onclick = async () => {
    if (!petToDelete) return;
    try {
        const response = await fetch(`${API_URL}/pets/${petToDelete}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            modal.style.display = 'none';
            fetchPets();
        }
    } catch (error) {
        alert('Hubo un problema al eliminar el registro.');
    }
};

// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

// --- Lógica del Proceso de Adopción ---
let petToAdopt = null;
const adoptModal = document.getElementById('adoptModal');
const closeAdoptBtn = document.querySelector('.close-adopt-modal');
const adoptForm = document.getElementById('adoptForm');

// Muestra el modal de adopción con el nombre de la mascota
window.requestAdoption = (petId, petName) => {
    petToAdopt = petId;
    document.querySelector('#adoptModal h2').textContent = `Adoptar a ${petName} 🐾`;
    document.getElementById('adoptMessage').value = '';
    adoptModal.style.display = 'flex';
};

closeAdoptBtn.onclick = () => adoptModal.style.display = 'none';
document.getElementById('cancelAdopt').onclick = () => adoptModal.style.display = 'none';

// Envía la solicitud al backend
adoptForm.onsubmit = async (e) => {
    e.preventDefault();
    if (!petToAdopt) return;

    const message = document.getElementById('adoptMessage').value;

    try {
        const response = await fetch(`${API_URL}/adoptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ petId: petToAdopt, message })
        });

        if (response.ok) {
            alert('¡Tu solicitud ha sido enviada! El administrador la revisará pronto. 🐾');
            adoptModal.style.display = 'none';
            fetchPets(); // Refrescamos para ver el estado 'En espera'
        } else {
            const error = await response.json();
            alert('Aviso: ' + error.message);
        }
    } catch (error) {
        alert('No pudimos conectar con el servidor en este momento.');
    }
};

// Iniciamos la carga
fetchPets();
