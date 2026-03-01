const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${CONFIG.API_URL}/register`, {
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