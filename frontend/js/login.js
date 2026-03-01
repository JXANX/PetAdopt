const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {

        const response = await fetch(`${API_BASE}/login`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                username,
                password
            })

        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);

            window.location.href = 'dashboard.html';

        } else {

            errorMessage.textContent = data.message;
            errorMessage.style.display = 'block';

        }

    } catch (error) {

        errorMessage.textContent = 'Error al conectar con el servidor.';
        errorMessage.style.display = 'block';

    }

});