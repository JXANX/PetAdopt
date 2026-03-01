// Validación de sesión
const token = localStorage.getItem('token');

if (!token)
    window.location.href = 'login.html';


// usar config.js correctamente
const API_URL = CONFIG.API_URL;
const API_ROOT = CONFIG.API_BASE; // para imágenes


const petGrid = document.getElementById('petGrid');


async function fetchPets() {

    try {

        const response = await fetch(`${API_URL}/pets`);

        if (!response.ok)
            throw new Error("Error al cargar mascotas");

        const pets = await response.json();

        petGrid.innerHTML = "";

        if (pets.length === 0) {

            petGrid.innerHTML =
                `<p style="grid-column:1/-1;text-align:center;padding:3rem;">
                No hay mascotas registradas 🐾
            </p>`;

            return;
        }

        pets.forEach(pet => {

            const photoSrc =
                pet.photoUrl
                    ? `${API_ROOT}${pet.photoUrl}`
                    : "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop";

            const card = document.createElement("div");
            card.className = "pet-card";

            card.innerHTML = `
                <img src="${photoSrc}" class="pet-image">

                <div class="pet-info">

                    <h3>${pet.name}</h3>

                    <p>
                        ${pet.species}
                        • ${pet.breed || "Mestizo"}
                        • ${pet.age} años
                    </p>

                    <span class="badge badge-${pet.status}">
                        ${pet.status === "available"
                    ? "Disponible"
                    : pet.status === "pending"
                        ? "En espera"
                        : "Adoptado"
                }
                    </span>

                    <div class="pet-footer">

                        ${pet.status === "available"
                    ? `<button onclick="requestAdoption(${pet.id},'${pet.name}')">
                                    Adoptar 🐾
                               </button>`
                    : ""
                }

                        <button onclick="location.href='pet-form.html?id=${pet.id}'">
                            Detalles
                        </button>

                    </div>

                </div>
            `;

            petGrid.appendChild(card);

        });

    }
    catch (error) {

        console.error(error);
        alert("Error al cargar mascotas");

    }

}



// eliminar
let petToDelete = null;

const modal = document.getElementById("deleteModal");

window.deletePet = (id) => {

    petToDelete = id;
    modal.style.display = "flex";

};


document.getElementById("confirmDelete").onclick = async () => {

    if (!petToDelete) return;

    try {

        const response = await fetch(`${API_URL}/pets/${petToDelete}`, {

            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        if (!response.ok)
            throw new Error();

        modal.style.display = "none";
        fetchPets();

    } catch {
        alert("Error al eliminar");
    }

};



// logout
document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.clear();
        window.location.href = "login.html";

    });



// adopción
let petToAdopt = null;

const adoptModal = document.getElementById("adoptModal");

window.requestAdoption = (id, name) => {

    petToAdopt = id;

    document.querySelector("#adoptModal h2")
        .textContent = `Adoptar a ${name}`;

    adoptModal.style.display = "flex";

};


document.getElementById("adoptForm").onsubmit = async (e) => {

    e.preventDefault();

    const message = document.getElementById("adoptMessage").value;

    try {

        const response = await fetch(`${API_URL}/adoptions`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                petId: petToAdopt,
                message
            })

        });

        if (!response.ok)
            throw new Error();

        alert("Solicitud enviada 🐾");

        adoptModal.style.display = "none";
        fetchPets();

    } catch {
        alert("Error al enviar solicitud");
    }

};


// iniciar
fetchPets();