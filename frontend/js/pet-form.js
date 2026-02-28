const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api'
    : '/api';

const petForm = document.getElementById('petForm');
const urlParams = new URLSearchParams(window.location.search);
const petId = urlParams.get('id');

if (petId) {
    document.getElementById('formTitle').textContent = 'Editar Mascota 🐾';
    fetchPetData(petId);
}

async function fetchPetData(id) {
    try {
        const response = await fetch(`${API_URL}/pets/${id}`);
        const pet = await response.json();

        document.getElementById('name').value = pet.name;
        document.getElementById('species').value = pet.species;
        document.getElementById('age').value = pet.age;
        document.getElementById('breed').value = pet.breed || '';
        document.getElementById('description').value = pet.description || '';
    } catch (error) {
        console.error('Error fetching pet:', error);
    }
}

petForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('species', document.getElementById('species').value);
    formData.append('age', document.getElementById('age').value);
    formData.append('breed', document.getElementById('breed').value);
    formData.append('description', document.getElementById('description').value);

    const photoFile = document.getElementById('photo').files[0];
    if (photoFile) {
        formData.append('photo', photoFile);
    }

    try {
        const url = petId ? `${API_URL}/pets/${petId}` : `${API_URL}/pets`;
        const method = petId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (response.ok) {
            window.location.href = 'pets.html';
        } else {
            const err = await response.json();
            alert(`Error: ${err.message}`);
        }
    } catch (error) {
        alert('Error al guardar datos.');
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});
