// Validar sesión
const token = localStorage.getItem('token');

if (!token)
    window.location.href = 'login.html';


// usar config.js
const API_URL = API_BASE;


const profileForm =
    document.getElementById('profileForm');

const successMsg =
    document.getElementById('profile-success-message');



async function fetchProfile() {

    try {

        // MVP: usamos datos guardados localmente
        const username =
            localStorage.getItem('username');


        document
            .getElementById('p-username')
            .value =
            username;


        document
            .getElementById('profileUsername')
            .textContent =
            username;

    }
    catch (error) {

        console.error(
            'Error fetching profile:',
            error
        );

    }

}



profileForm.addEventListener(
    'submit',
    async (e) => {

        e.preventDefault();


        // aquí luego puedes conectar PUT /api/profile real
        successMsg.style.display =
            'block';


        setTimeout(() => {

            successMsg.style.display =
                'none';

        }, 3000);

    }
);



document
    .getElementById('logoutBtn')
    .addEventListener(
        'click',
        () => {

            localStorage.clear();

            window.location.href =
                'login.html';

        }
    );



fetchProfile();