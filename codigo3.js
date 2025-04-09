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
let notesSection = document.getElementById('notesSection'); // Obtener la sección de notas

// Funciones

// Muestra las notas
function Notes() {
    loginFormElement.style.display = 'none';
    registerFormElement.style.display = 'none';
    showLoginFormButton.style.display = 'none';
    registerButton.style.display = 'none';
    noteButton.style.display = 'none';
    showLogoutFormButton.style.display = 'block';
    notesSection.style.display = 'block';

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
    loginFormElement.style.display = 'none'
    registerFormElement.style.display = 'block'
    showLoginFormButton.style.display = 'block';
    registerButton.style.display = 'none';
});

function deleteNote(note_id){
    return fetch(`http://127.0.0.1:8000/notes/${note_id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('access_token')}`
            }
        }
    )};

function showUserNotes() {
    // Obtiene el container de las notas
    const notesContainer = document.getElementById('notesContainer');
    // Obtiene el template para cada nota
    const noteTemplate = document.getElementById('noteTemplate');

    // Realiza una peticion GET a la API
    fetch('http://127.0.0.1:8000/notes/personal/',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('access_token')}`
        }
    })  //Verifica que la respuesta sea un exito y devuelve un JSON
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json();
    })
    .then(notes => {
        // Limpiar el contenedor de notas antes de renderizar
        notesContainer.innerHTML = ''; 
        
        // Recorre las notas recibidas
        notes.forEach(note => {

            // Clona el contenido del template
            const noteCard = noteTemplate.content.cloneNode(true);

            // Llena los datos del template con la información de la nota
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

            editButton.addEventListener('click', () => {
                console.log('Editar nota:', note.id);

            });

            deleteButton.addEventListener('click', () => {
                console.log('Eliminar nota:', note.id);
                deleteNote(note.id)
                    .then(response => {
                        if (response.ok) {
                            showUserNotes();
                        } else {
                            console.error('Error al eliminar la nota: ', response.status)
                        }
                    })
                    .catch(error => console.error('Error en el fetch de delete: ', error));
            });

            shareButton.addEventListener('click', () => {
                console.log('Compartir nota:', note.id);
            });

            notesContainer.appendChild(noteCard);
        });
    })
    .catch(error => console.log('Error al mostrar las notas: ', error));

    // Se asegura que el contenedor este visible
    notesContainer.style.display = 'block';
};

// Llama a esta función cuando la página cargue para mostrar las notas iniciales
document.addEventListener('DOMContentLoaded', showUserNotes);

function createUserNotes() {
    // Obtiene los datos del formulario
    let text = document.getElementById('noteText').value;
    let category = document.getElementById('noteCategory').value;

    // Prepara los datos para enviarlos
    const data = {
        text: text,
        category: category
        };

    // Envia los datos con POST
    fetch('http://127.0.0.1:8000/notes/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('access_token')}`
        },
        // Los datos los envia en formato JSON
        body: JSON.stringify(data)
    }) 
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        console.log('Nota creada exitosamente!');
        document.getElementById('noteFormElement').reset();
        showUserNotes();
    })
    .catch(error => console.log('Error al crear la nota: ', error));
}




// Funcion que ingresa a un usuario
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
    })
    .catch(error => console.log('Error:', error));
});


// Funcion que termina la sesion de un usuario
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
        notesSection.style.display = 'none';
        newNotebtn.style.display = 'none';
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
    noteButton.style.display = 'none';
    showLogoutFormButton.style.display = 'block';
    showNewNote.style.display = 'none';
    newNotebtn.style.display = 'block';
    Notes();
});

noteButton.addEventListener('click', () => {
    Notes();
    noteButton.style.display = 'none';
    showLogoutFormButton.style.display = 'block';
    showNewNote.style.display = 'none';
    newNotebtn.style.display = 'block';
});


