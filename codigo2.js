// Instancias

let loginButton = document.getElementById('ingresar')
let registerButton = document.getElementById('registerBtn');
let noteButton = document.getElementById('noteBtn');
let showLoginFormButton = document.getElementById('loginBtn');
let showLogoutFormButton = document.getElementById('logoutBtn');
let newNotebtn = document.getElementById('newNoteBtn');

let loginFormElement = document.getElementById('loginForm');
let registerFormElement = document.getElementById('registerForm');
let showNewNote = document.getElementById('noteForm');
let createNewNote = document.getElementById('createNoteBtn');

// Funciones

function Notes() {
    loginFormElement.style.display = 'none';
    registerFormElement.style.display = 'none';
    showLoginFormButton.style.display = 'none';
    registerButton.style.display = 'none';
    noteButton.style.display = 'block';
    showLogoutFormButton.style.display = 'block';
}

// Eventos

showLoginFormButton.addEventListener('click', () => {
    loginFormElement.style.display = 'block';
    registerFormElement.style.display = 'none';
    showLoginFormButton.style.display = 'none';
    registerButton.style.display = 'block';
});

registerButton.addEventListener('click', () => {
    loginFormElement.style.display = 'none'
    registerFormElement.style.display = 'block'
    showLoginFormButton.style.display = 'block';
    registerButton.style.display = 'none';
});

loginButton.addEventListener('click', () => {
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
});

showLogoutFormButton.addEventListener('click', () => {
    loginFormElement.style.display = 'block';
    registerButton.style.display = 'block';
    noteButton.style.display = 'none';
    showLogoutFormButton.style.display = 'none';
});

newNotebtn.addEventListener('click', () => {
    noteButton.style.display = 'none';
    showLogoutFormButton.style.display = 'none';
    showNewNote.style.display = 'block';
    newNotebtn.style.display = 'none';

});

createNewNote.addEventListener('click', () => {
    let noteText = document.getElementById('noteText').value;
    let noteCategory = document.getElementById('noteCategory').value;
    let noteTags = document.getElementById('noteTags').value;

    console.log('Nota creada exitosamente!');
    console.log(`Texto: ${noteText}`);
    console.log(`Categoria: ${noteCategory}`);
    console.log(`Categoria: ${noteTags}`);

    noteButton.style.display = 'block';
    showLogoutFormButton.style.display = 'block';
    showNewNote.style.display = 'none';
});