const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api'
    : '/api';

const petGrid = document.getElementById('petGrid');

async function fetchPets() {
    try {
        const response = await fetch(`${API_URL}/pets`);
        const pets = await response.json();

        petGrid.innerHTML = '';
        if (pets.length === 0) {
            petGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">No hay mascotas registradas todavía. ¡Agrega la primera!</p>';
            return;
        }

        pets.forEach(pet => {
            const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:3001'
                : '';
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
                        ${pet.description || 'Sin descripción disponible.'}
                    </p>
                    <div class="pet-footer">
                        <button class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;" onclick="deletePet(${pet.id})">Eliminar</button>
                        <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;" onclick="location.href='pet-form.html?id=${pet.id}'">Editar</button>
                    </div>
                </div>
            `;
            petGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

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
        alert('Error al eliminar mascota');
    }
};

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

fetchPets();
