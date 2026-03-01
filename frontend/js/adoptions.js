// Validación de sesión
const token = localStorage.getItem('token');

if (!token)
    window.location.href = 'login.html';

// usar config.js
const API_URL = API_BASE;

const tableBody = document.getElementById('adoptionTableBody');

let pendingChanges = {};


// cargar solicitudes
async function fetchAdoptions() {

    try {

        const response = await fetch(`${API_URL}/adoptions`, {

            headers: {
                'Authorization': `Bearer ${token}`
            }

        });

        const adoptions = await response.json();

        tableBody.innerHTML = '';

        if (adoptions.length === 0) {

            tableBody.innerHTML =
                '<tr><td colspan="5">No hay solicitudes</td></tr>';

            return;
        }

        adoptions.forEach(req => {

            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${req.Pet.name}</td>

                <td>${req.User.username}</td>

                <td>${new Date(req.requestDate).toLocaleDateString()}</td>

                <td>
                    <span id="badge-${req.id}">
                        ${req.status}
                    </span>
                </td>

                <td>

                    <button onclick="queueChange(${req.id},'approved')">
                        Aprobar
                    </button>

                    <button onclick="queueChange(${req.id},'rejected')">
                        Rechazar
                    </button>

                </td>
            `;

            tableBody.appendChild(row);

        });

    }
    catch (error) {

        console.error(error);

    }

}


// cola
window.queueChange = (id, status) => {

    pendingChanges[id] = status;

    const badge =
        document.getElementById(`badge-${id}`);

    badge.textContent =
        status + "*";

};


// procesar lote
document
    .getElementById('batchProcessBtn')
    .addEventListener('click', async () => {

        const requests =
            Object.entries(pendingChanges)
                .map(([id, status]) => ({

                    id: parseInt(id),
                    status

                }));


        if (requests.length === 0) {

            alert("Sin cambios");

            return;

        }


        try {

            const response =
                await fetch(`${API_URL}/adoptions/batch`, {

                    method: "PUT",

                    headers: {

                        "Content-Type": "application/json",

                        "Authorization": `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        requests

                    })

                });


            if (response.ok) {

                alert("Guardado");

                pendingChanges = {};

                fetchAdoptions();

            }

        }
        catch {

            alert("Error");

        }

    });


// logout
document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.clear();

        window.location.href = "login.html";

    });


// iniciar
fetchAdoptions();