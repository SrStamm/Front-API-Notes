// Instancias

let loginButton = document.getElementById('ingresar')
let registerButton = document.getElementById('registerBtn');
let noteButton = document.getElementById('noteBtn');
let showLoginFormButton = document.getElementById('loginBtn');
let showLogoutFormButton = document.getElementById('logoutBtn');

let loginFormElement = document.getElementById('loginForm');
let notesSectionElement = document.getElementById('notesSection');
let registerFormElement = document.getElementById('registerForm');

// Funciones

function Login() {
    loginFormElement.style.display = 'block';
    notesSectionElement.style.display = 'none';
    registerFormElement.style.display = 'none';
    showLoginFormButton.style.display = 'none';
    showLogoutFormButton.style.display = 'none';
    noteButton.style.display = 'none';
    registerButton.style.display = 'block';
}


function Register() {
    loginFormElement.style.display = 'none'
    notesSectionElement.style.display = 'none'
    registerFormElement.style.display = 'block'
    showLoginFormButton.style.display = 'block';
    showLogoutFormButton.style.display = 'none';
    registerButton.style.display = 'none';
    noteButton.style.display = 'none';
}

function Notes() {
    loginFormElement.style.display = 'none';
    registerFormElement.style.display = 'none';
    notesSectionElement.style.display = 'block';
    showLoginFormButton.style.display = 'none';
    registerButton.style.display = 'none';
    noteButton.style.display = 'block';
    showLogoutFormButton.style.display = 'block';
}

function userLogin() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('current-password').value;

    if (username === 'mirko_dev' && password === '5555') {
        console.log('Inicio de sesión exitoso');
        Notes();
    } else {
        console.log(username);
        console.log(password);
        alert('Usuario o contraseña incorrecta');
    }
}

function logOut() {
    loginFormElement.style.display = 'block';
    registerFormElement.style.display = 'none';
    notesSectionElement.style.display = 'none';
    showLoginFormButton.style.display = 'none';
    registerButton.style.display = 'block';
    noteButton.style.display = 'none';
    showLogoutFormButton.style.display = 'none';
}

// Eventos

showLoginFormButton.addEventListener('click', Login);

registerButton.addEventListener('click', Register);

loginButton.addEventListener('click', userLogin);

showLogoutFormButton.addEventListener('click', logOut);