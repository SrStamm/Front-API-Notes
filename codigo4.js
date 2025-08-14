// Instancias
let loginButton = document.getElementById('ingresar');
let registerButton = document.getElementById('registerBtn');
let noteButton = document.getElementById('noteBtn');
let showLoginFormButton = document.getElementById('loginBtn');
let showLogoutFormButton = document.getElementById('logoutBtn');
let newNotebtn = document.getElementById('newNoteBtn');

let loginFormElement = document.getElementById('loginForm');
let createUser = document.getElementById('registrarse');
let readUser = document.getElementById('userBtn');
let registerFormElement = document.getElementById('registerForm');
let showNewNote = document.getElementById('noteForm');
let createNewNote = document.getElementById('createNoteBtn');
let notesSection = document.getElementById('notesSection'); // Obtener la sección de notas

// Funciones

function Notes() {
    showNewNote.style.display = 'none';
    loginFormElement.style.display = 'none';
    registerFormElement.style.display = 'none';
    showLoginFormButton.style.display = 'none';
    registerButton.style.display = 'none';
    noteButton.style.display = 'none';
    showLogoutFormButton.style.display = 'block';
    notesSection.style.display = 'block'; // Mostrar la sección de notas
    createNewNote.style.display = 'block';
    newNotebtn.style.display = 'block';

    showUserNotes();
}

// Eventos

showLoginFormButton.addEventListener('click', () => {
    loginFormElement.style.display = 'block';
    registerFormElement.style.display = 'none';
    showLoginFormButton.style.display = 'none';
    registerButton.style.display = 'block';
});

registerButton.addEventListener('click', () => {
    loginFormElement.style.display = 'none';
    registerFormElement.style.display = 'block';
    showLoginFormButton.style.display = 'block';
    registerButton.style.display = 'none';
});


// Funcion que muestra las notas del usuario
function showUserNotes() {
    const notesContainer = document.getElementById('notesContainer');
    const noteTemplate = document.getElementById('noteTemplate');

    fetch('http://127.0.0.1:8000/notes/personal/',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('access_token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json();
    })
    .then(notes => {
        notesContainer.innerHTML = '';
        notes.forEach(note => {
            const noteCard = noteTemplate.content.cloneNode(true);
            const categoryElement = noteCard.querySelector('.note-category');
            const textElement = noteCard.querySelector('.note-text');
            const dateElement = noteCard.querySelector('.note-date');

            categoryElement.textContent = note.category;
            textElement.textContent = note.text;
            const date = new Date(note.created_at);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            dateElement.textContent = formattedDate;

            const editButton = noteCard.querySelector('.editBtn');
            const deleteButton = noteCard.querySelector('.deleteBtn');
            const shareButton = noteCard.querySelector('.shareBtn');

            editButton.addEventListener('click', () => console.log('Editar nota:', note.id));
            deleteButton.addEventListener('click', () => console.log('Eliminar nota:', note.id));
            shareButton.addEventListener('click', () => console.log('Compartir nota:', note.id));

            notesContainer.appendChild(noteCard);
        });
    })
    .catch(error => console.log('Error al mostrar las notas: ', error));
}

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay un token al cargar la página para mostrar las notas directamente
    if (localStorage.getItem('access_token')) {
        Notes();
    } else {
        // Si no hay token, mostrar el formulario de login
        loginFormElement.style.display = 'block';
        showLoginFormButton.style.display = 'none';
    }
});

// Funcion que crea una nueva nota
function createUserNotes() {
    let text = document.getElementById('noteText').value;
    let category = document.getElementById('noteCategory').value;

    fetch('http://127.0.0.1:8000/notes/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                text: text,
                category: category
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            console.log('Nota creada exitosamente!');
            document.getElementById('noteFormElement').reset();
            Notes();
        })
        .catch(error => console.log('Error al crear la nota: ', error));
};


// Evento que logea un usuario 
loginButton.addEventListener('click', () => {
    let username = document.getElementById('username').value;
    let password = document.getElementById('current-password').value;

    fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            username: username,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(json => {
        window.localStorage.setItem('access_token', json.access_token);
        window.localStorage.setItem('refresh_token', json.refresh_token);
        window.localStorage.setItem('token_type', 'Bearer');
        Notes();
        let token = json
    })
    .catch(error => console.log('Error:', error));
});


// Evento que crea un nuevo usuario
createUser.addEventListener('click', () => {
    let username = document.getElementById('newUsername').value;
    let password = document.getElementById('newPassword').value;
    let email = document.getElementById('newEmail').value;

    fetch('http://127.0.0.1:8000/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password,
            email: email
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(json => {
        loginFormElement.style.display = 'block';
        registerFormElement.style.display = 'none';
        showLoginFormButton.style.display = 'none';
        registerButton.style.display = 'block';
    })
    .catch(error => console.log('Error:', error));
});


// Evento que cierra sesion
showLogoutFormButton.addEventListener('click', () => {
    fetch('http://127.0.0.1:8000/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('access_token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(json => {
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('refresh_token');
        window.localStorage.removeItem('token_type');
        loginFormElement.style.display = 'block';
        registerButton.style.display = 'block';
        noteButton.style.display = 'none';
        showLogoutFormButton.style.display = 'none';
        notesSection.style.display = 'none'; // Ocultar la sección de notas al cerrar sesión
    })
    .catch(error => console.log('Error:', error));
});

newNotebtn.addEventListener('click', () => {
    noteButton.style.display = 'block';
    showLogoutFormButton.style.display = 'none';
    showNewNote.style.display = 'block';
    newNotebtn.style.display = 'none';
    notesSection.style.display = 'none';
});

createNewNote.addEventListener('click', () => {
    createUserNotes();
    noteButton.style.display = 'block';
    showLogoutFormButton.style.display = 'block';
    showNewNote.style.display = 'none';
    newNotebtn.style.display = 'block'; // Mostrar el botón de "Nueva Nota" de nuevo
});

noteButton.addEventListener('click', () => {
    Notes();
});