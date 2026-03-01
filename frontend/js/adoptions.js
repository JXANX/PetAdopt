// Validar sesión
const token = localStorage.getItem('token');

if (!token)
    window.location.href = 'login.html';


// usar config.js correctamente
const API_URL = CONFIG.API_URL;


const adoptionTable = document.getElementById("adoptionTableBody");


// cargar solicitudes
async function fetchAdoptions() {

    try {

        const response = await fetch(`${API_URL}/adoptions`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok)
            throw new Error("Error al cargar solicitudes");

        const adoptions = await response.json();

        adoptionTable.innerHTML = "";

        if (adoptions.length === 0) {

            adoptionTable.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;padding:2rem;">
                        No hay solicitudes pendientes 🐾
                    </td>
                </tr>
            `;

            return;
        }

        adoptions.forEach(adoption => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${adoption.pet?.name || "—"}</td>
                <td>${adoption.user?.username || "—"}</td>
                <td>${adoption.message || "Sin mensaje"}</td>
                <td>${adoption.status}</td>
                <td>
                    ${adoption.status === "pending" ? `
                        <button onclick="processAdoption(${adoption.id}, 'approved')">
                            Aprobar
                        </button>
                        <button onclick="processAdoption(${adoption.id}, 'rejected')">
                            Rechazar
                        </button>
                    ` : "Procesada"}
                </td>
            `;

            adoptionTable.appendChild(row);

        });

    }
    catch (error) {

        console.error(error);
        alert("Error al cargar solicitudes");

    }

}



// aprobar / rechazar
window.processAdoption = async (id, status) => {

    try {

        const response = await fetch(`${API_URL}/adoptions/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({ status })

        });

        if (!response.ok)
            throw new Error("Error al procesar");

        fetchAdoptions();

    }
    catch (error) {

        console.error(error);
        alert("Error al procesar solicitud");

    }

};



// logout
document.getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.clear();
        window.location.href = "login.html";

    });


// iniciar
fetchAdoptions();