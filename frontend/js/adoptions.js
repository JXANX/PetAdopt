// Validar sesión
const token = localStorage.getItem('token');

if (!token)
    window.location.href = 'login.html';


// usar config.js correctamente
const API_URL = CONFIG.API_URL;


const adoptionTable = document.getElementById("adoptionTableBody");


// almacenar cambios pendientes
let pendingChanges = [];


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
                <td>${adoption.Pet?.name || "—"}</td>
                <td>${adoption.User?.username || "—"}</td>
                <td>${new Date(adoption.createdAt).toLocaleDateString()}</td>
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



// marcar aprobación o rechazo (NO envía todavía)
window.processAdoption = (id, status) => {

    const existing = pendingChanges.find(a => a.id === id);

    if (existing) {
        existing.status = status;
    } else {
        pendingChanges.push({ id, status });
    }

    alert("Cambio marcado. Pulsa 'Procesar Cambios' para guardar.");
};



// botón procesar cambios (BATCH)
document.getElementById("batchProcessBtn")
    .addEventListener("click", async () => {

        if (pendingChanges.length === 0) {
            alert("No hay cambios pendientes.");
            return;
        }

        try {

            const response = await fetch(`${API_URL}/adoptions/batch`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    requests: pendingChanges
                })
            });

            if (!response.ok)
                throw new Error();

            alert("Solicitudes procesadas correctamente ✅");

            pendingChanges = [];
            fetchAdoptions();

        }
        catch (error) {

            console.error(error);
            alert("Error al procesar solicitudes");

        }

    });



// logout
document.getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.clear();
        window.location.href = "login.html";

    });


// iniciar
fetchAdoptions();