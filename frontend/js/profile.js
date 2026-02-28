const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api'
    : '/api';

const profileForm = document.getElementById('profileForm');
const successMsg = document.getElementById('profile-success-message');

async function fetchProfile() {
    try {
        // En una app real tendríamos /api/profile
        // Para este MVP vamos a simularlo con los datos del token o simplemente permitir editar campos
        const username = localStorage.getItem('username');
        document.getElementById('p-username').value = username;
        document.getElementById('profileUsername').textContent = username;

    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Aquí iría la lógica de PUT /api/profile
    // Como simplificación pedagógica, mostramos el éxito
    successMsg.style.display = 'block';
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

fetchProfile();
