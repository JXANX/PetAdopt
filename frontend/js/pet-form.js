const token = localStorage.getItem('token');

if (!token)
    window.location.href = 'login.html';


// usar config.js
const API_URL = API_BASE;


const petForm =
    document.getElementById('petForm');


const urlParams =
    new URLSearchParams(window.location.search);


const petId =
    urlParams.get('id');


// modo editar
if (petId) {

    document
        .getElementById('formTitle')
        .textContent =
        'Editar Mascota 🐾';

    fetchPetData(petId);

}


// cargar datos
async function fetchPetData(id) {

    try {

        const response =
            await fetch(`${API_URL}/pets/${id}`);


        const pet =
            await response.json();


        document.getElementById('name')
            .value = pet.name;

        document.getElementById('species')
            .value = pet.species;

        document.getElementById('age')
            .value = pet.age;

        document.getElementById('breed')
            .value = pet.breed || '';

        document.getElementById('description')
            .value = pet.description || '';

    }
    catch (error) {

        console.error(error);

    }

}


// guardar
petForm.addEventListener('submit', async (e) => {

    e.preventDefault();


    const formData =
        new FormData();


    formData.append(
        'name',
        document.getElementById('name').value
    );


    formData.append(
        'species',
        document.getElementById('species').value
    );


    formData.append(
        'age',
        document.getElementById('age').value
    );


    formData.append(
        'breed',
        document.getElementById('breed').value
    );


    formData.append(
        'description',
        document.getElementById('description').value
    );


    const photo =
        document.getElementById('photo')
            .files[0];


    if (photo) {

        formData.append(
            'photo',
            photo
        );

    }


    try {

        const url =
            petId
                ? `${API_URL}/pets/${petId}`
                : `${API_URL}/pets`;


        const method =
            petId
                ? "PUT"
                : "POST";


        const response =
            await fetch(url, {

                method,

                headers: {
                    Authorization: `Bearer ${token}`
                },

                body: formData

            });


        if (response.ok) {

            window.location.href =
                "pets.html";

        }
        else {

            const err =
                await response.json();

            alert(err.message);

        }

    }
    catch {

        alert("Error conexión");

    }

});


// logout
document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.clear();

        window.location.href = "login.html";

    });