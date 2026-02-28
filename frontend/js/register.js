const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3001/api'
        : '/api';

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, phone, password })
        });

        const data = await response.json();

        if (response.ok) {
            errorMessage.style.display = 'none';
            successMessage.textContent = '¡Registro exitoso! Redirigiendo al inicio de sesión...';
            successMessage.style.display = 'block';

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            errorMessage.textContent = data.message || 'Error al registrar el usuario.';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'Error al conectar con el servidor.';
        errorMessage.style.display = 'block';
    }
});
