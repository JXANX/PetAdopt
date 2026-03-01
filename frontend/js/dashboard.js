const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

if (!token) {
    window.location.href = 'login.html';
}

// logout
document.getElementById('logoutBtn')
    .addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

// mensaje bienvenida
if (username) {
    document.getElementById('welcomeTitle')
        .textContent = `¡Bienvenido, ${username}! 🐾`;
}

// usar config.js correctamente
const API_URL = CONFIG.API_URL;

// cargar estadísticas
async function fetchStats() {
    try {
        const response = await fetch(`${API_URL}/pets/statistics`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok)
            throw new Error("Error");

        const stats = await response.json();

        document.getElementById('stat-total').textContent = stats.total;
        document.getElementById('stat-available').textContent = stats.available;
        document.getElementById('stat-adopted').textContent = stats.adopted;
        document.getElementById('stat-pending').textContent = stats.pending;

    } catch (error) {
        console.error(error);
    }
}

fetchStats();