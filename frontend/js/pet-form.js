const token = localStorage.getItem('token');

if (!token)
    window.location.href = 'login.html';


// usar config.js correctamente
const API_URL = CONFIG.API_URL;

const petForm = document.getElementById('petForm');

const urlParams = new URLSearchParams(window.location.search);
const petId = urlParams.get('id');


// modo editar
if (petId) {

    document
        .getElementById('formTitle')
        .textContent = 'Editar Mascota 🐾';

    fetchPetData(petId);
}


// cargar datos
async function fetchPetData(id) {

    try {

        const response = await fetch(`${API_URL}/pets/${id}`);

        if (!response.ok)
            throw new Error("Error al cargar mascota");

        const pet = await response.json();

        document.getElementById('name').value = pet.name;
        document.getElementById('species').value = pet.species;
        document.getElementById('age').value = pet.age;
        document.getElementById('breed').value = pet.breed || '';
        document.getElementById('description').value = pet.description || '';

    }
    catch (error) {

        console.error(error);
        alert("Error al cargar datos");

    }

}


// guardar
petForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append('name', document.getElementById('name').value);
    formData.append('species', document.getElementById('species').value);
    formData.append('age', document.getElementById('age').value);
    formData.append('breed', document.getElementById('breed').value);
    formData.append('description', document.getElementById('description').value);

    const photo = document.getElementById('photo').files[0];

    if (photo) {
        formData.append('photo', photo);
    }

    try {

        const url = petId
            ? `${API_URL}/pets/${petId}`
            : `${API_URL}/pets`;

        const method = petId ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message);
        }

        window.location.href = "pets.html";

    }
    catch (error) {

        console.error(error);
        alert(error.message || "Error de conexión");

    }

});


// logout
document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.clear();
        window.location.href = "login.html";

    });