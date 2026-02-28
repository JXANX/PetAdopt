const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

if (!token) {
    window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

if (username) {
    document.getElementById('welcomeTitle').textContent = `¡Bienvenido, ${username}! 🐾`;
}

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api'
    : '/api';

async function fetchStats() {
    try {
        // Ejemplo de Promise.all en el frontend para cargar datos si hubiera varios endpoints
        // Aquí solo tenemos uno de stats, pero sirve para demostrar el patrón
        const statsResponse = await fetch(`${API_URL}/pets/statistics`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!statsResponse.ok) throw new Error('Failed to fetch stats');

        const stats = await statsResponse.json();

        document.getElementById('stat-total').textContent = stats.total;
        document.getElementById('stat-available').textContent = stats.available;
        document.getElementById('stat-adopted').textContent = stats.adopted;
        document.getElementById('stat-pending').textContent = stats.pending;

    } catch (error) {
        console.error('Error:', error);
    }
}

fetchStats();
