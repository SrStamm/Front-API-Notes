// Instancias
let loginButton = document.getElementById('ingresar');
let registerButton = document.getElementById('registerBtn');
let noteButton = document.getElementById('noteBtn');
let showLoginFormButton = document.getElementById('loginBtn');
let showLogoutFormButton = document.getElementById('logoutBtn');
let newNotebtn = document.getElementById('addNoteBtn');
let createNewNote = document.getElementById('saveNoteBtn');
let loginFormElement = document.getElementById('loginForm');
let createUser = document.getElementById('registrarse');
let readUser = document.getElementById('userBtn');
let registerFormElement = document.getElementById('registerForm');
let showNewNote = document.getElementById('noteForm');
let notesSection = document.getElementById('notesSection'); // Obtener la sección de notas

let ws = null
document.getElementById('sharedNotesBtn').addEventListener('click', showSharedNotes);

// Funciones

function getUserIdFromToken(token) {
    try {
        // Corregir decodificación base64 URL-safe
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return parseInt(payload.sub);
    } catch (error) {
        console.error("Error decodificando token:", error);
        return null;
    }
}

function connectWebSocket(userId) {
    if (ws) ws.close();
    
    // Usar wss:// en producción y añadir token como query parameter
    const token = localStorage.getItem('access_token');
    ws = new WebSocket(`ws://127.0.0.1:8000/ws/${userId}?token=${token}`);

    ws.onopen = () => {
        console.log("WebSocket conectado");
        showMessage("Conexión en tiempo real activa", 'success');
    };

    ws.onerror = (error) => {
        console.error("Error WebSocket:", error);
        showMessage("Error de conexión. Recarga la página.", 'error');
    };
}



function Notes() {
    showNewNote.style.display = 'none';
    loginFormElement.style.display = 'none';
    registerFormElement.style.display = 'none';
    usersSection.style.display = 'none'; // Ocultar sección de usuarios
    showLoginFormButton.style.display = 'none';
    registerButton.style.display = 'none';
    noteButton.style.display = 'none';
    showLogoutFormButton.style.display = 'block';
    readUser.style.display = 'block'; // Mostrar botón de usuarios
    notesSection.style.display = 'block';
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


function readAllUsers() {
        const userTemplate = document.querySelector('userTemplate');
        const tableBody = document.getElementById('usersTableBody')

        fetch('http://127.0.0.1:8000/users/all-users/', {
            method: 'GET',
            headers: {
                'content-type' : 'application/json',
                'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('access_token')}`
            }
        })
        .then(response => {
            if(!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`)
            }
            return response.json();
        })
        .then(users => {
            tableBody.innerHTML = ""; // limpia la tabla
            users.forEach(user => {
            const row = document.createElement("tr");
            

            row.innerHTML = `
                <td>${user.user_id}</td>
                <td>${user.username}</td>
                <td>
                    <button class="btn btn-warning btn-sm shadeUserBtn">
                        <i class="fas fa-envelope"></i> Compartir
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error al mostrar los usuarios:', error);
    });
};

// Funcion que muestra las notas del usuario
function showUserNotes() {
    const notesContainer = document.getElementById('notesContainer');
    const noteTemplate = document.getElementById('noteTemplate');

    fetch('http://127.0.0.1:8000/notes/personal/', {
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
            
            // Elementos corregidos
            const categoryElement = noteCard.querySelector('.badge'); // Cambiado de '#noteCategoryBadge' a '.badge'
            const textElement = noteCard.querySelector('.note-text');
            const dateElement = noteCard.querySelector('.note-date');
            const tagsContainer = noteCard.querySelector('.tags');

            // Asignar valores
            categoryElement.textContent = note.category || 'General';
            categoryElement.className = 'badge ' + getCategoryClass(note.category); // Añadir clase según categoría
            textElement.textContent = note.text;
            
            const date = new Date(note.created_at);
            dateElement.textContent = date.toLocaleString();

            // En la sección de tags:
            if (note.tags && note.tags.length > 0) {
                tagsContainer.innerHTML = '';
                note.tags.forEach(tag => {
                    const tagElement = document.createElement('span');
                    tagElement.className = 'tag';
                    tagElement.textContent = tag;
                    tagsContainer.appendChild(tagElement);
                });
            }

            // Botones de acción
            const editButton = noteCard.querySelector('.editBtn');
            const deleteButton = noteCard.querySelector('.deleteBtn');
            const shareButton = noteCard.querySelector('.shareBtn');

            editButton.addEventListener('click', () => editNote(note.id));
            deleteButton.addEventListener('click', () => deleteNote(note.id));
            shareButton.addEventListener('click', () => shareNote(note.id));

            notesContainer.appendChild(noteCard);
        });
    })
    .catch(error => {
        console.error('Error al mostrar las notas:', error);
        showMessage('Error al cargar las notas', 'error');
    });
}

// Funciones auxiliares
function translateCategory(category) {
    const categories = {
        'work': 'Trabajo',
        'study': 'Estudio',
        'personal': 'Personal',
        'unknown': 'General'
    };
    return categories[category.toLowerCase()] || 'General';
}

function getCategoryClass(category) {
    const classes = {
        'work': 'badge-primary',
        'study': 'badge-success',
        'personal': 'badge-warning',
        'ideas': 'badge-secondary',
        'general': 'badge-light',
        'unknown': 'badge-light'
    };
    return classes[category.toLowerCase()] || 'badge-light';
}

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

// Funcion que sirve para eliminar notas
function deleteNote(noteId) {
    fetch(`http://127.0.0.1:8000/notes/${noteId}`, {
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('access_token')}`
        }}
    ).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        Notes();
    })
};


function shareNote(noteId) {
    const sharedUserId = prompt("Ingrese el ID del usuario con quien desea compartir la nota:");
    if (!sharedUserId) return;

    const permission = prompt("¿Qué permiso desea otorgar? (READ o WRITE)", "READ");
    if (!permission || (permission !== "READ" && permission !== "WRITE")) {
        showMessage("Permiso inválido. Solo se permite READ o WRITE.", "error");
        return;
    }

    fetch(`http://127.0.0.1:8000/notes/${noteId}/shared/${sharedUserId}?permission=${permission}`, {
        method: 'POST',
        headers: {
            'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('access_token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.detail || "Error al compartir la nota.");
            });
        }
        return response.json();
    })
    .then(data => {
        showMessage(data.detail || "Nota compartida exitosamente.", "success");
    })
    .catch(error => {
        console.error("Error al compartir la nota:", error);
        showMessage(`Error: ${error.message}`, "error");
    });
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
async function createUserNotes() {
    const noteId = document.getElementById('noteId').value;
    const method = noteId ? 'PATCH' : 'POST';
    const url = noteId ? `http://127.0.0.1:8000/notes/${noteId}` : 'http://127.0.0.1:8000/notes/';

    const tags = document.getElementById('noteTags').value.split(',').map(t => t.trim()).filter(t => t);

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                text: document.getElementById('noteText').value,
                category: document.getElementById('noteCategory').value,
                tags: tags
            })
        });

        if (!response.ok) throw new Error('Error guardando nota');
        
        document.getElementById('noteFormElement').reset();
        Notes();
        showMessage(noteId ? 'Nota actualizada' : 'Nota creada', 'success');

    } catch (error) {
        showMessage(error.message, 'error');
    }
}


document.getElementById('cancelNoteBtn').addEventListener('click', () => {
    document.getElementById('noteFormElement').reset();
    showNewNote.style.display = 'none';
    notesSection.style.display = 'block';
    newNotebtn.style.display = 'block';
});


function showSharedNotes() {
    const notesContainer = document.getElementById('notesContainer');
    const noteTemplate = document.getElementById('noteTemplate');

    fetch('http://127.0.0.1:8000/notes/shared/', {
        headers: {
            'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('access_token')}`
        }
    })
    .then(response => response.json())
    .then(notes => {
        notesContainer.innerHTML = '';
        notes.forEach(note => {
            // Mismo código de renderizado que showUserNotes
            // pero con datos de nota compartida
        });
    });
}

// Evento que logea un usuario 
loginButton.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('current-password').value;

    fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.detail || "Error en credenciales");
            });
        }
        return response.json();
    })
    .then(data => {
        // Guardar tokens
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('token_type', 'Bearer');

        // Obtener user_id (depende de cómo lo devuelva tu backend)
        const user_id = data.user_id || getUserIdFromToken(data.access_token);
        
        if (!user_id) throw new Error("No se pudo obtener el user_id");

        // Conectar WebSocket
        connectWebSocket(user_id);

        // Mostrar interfaz
        Notes();
    })
    .catch(error => {
        showMessage(error.message, 'error');
    });
});


async function editNote(noteId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/notes/${noteId}`, {
            headers: {
                'Authorization': `${localStorage.getItem('token_type')} ${localStorage.getItem('access_token')}`
            }
        });
        
        if (!response.ok) throw new Error('Error obteniendo nota');
        const note = await response.json();

        // Rellenar formulario
        document.getElementById('noteId').value = note.id;
        document.getElementById('noteText').value = note.text;
        document.getElementById('noteCategory').value = note.category;
        document.getElementById('noteTags').value = note.tags?.join(', ') || '';

        // Mostrar formulario en modo edición
        document.getElementById('formTitle').innerHTML = '<i class="fas fa-edit"></i> Editar Nota';
        document.getElementById('saveNoteBtn').innerHTML = '<i class="fas fa-save"></i> Actualizar';
        showNewNote.style.display = 'block';
        notesSection.style.display = 'none';

    } catch (error) {
        showMessage('Error al cargar la nota', 'error');
    }
}


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
        showLogoutFormButton.style.display = 'none';
        noteButton.style.display = 'none';
        notesSection.style.display = 'none'; 
        readUser.style.display = 'none';
        usersSection.style.display = 'none'; // Ocultar sección de usuarios

    })
    .catch(error => console.log('Error:', error));
});

// Modifica cuando se quiere crear una nota
newNotebtn.addEventListener('click', () => {
    noteButton.style.display = 'block';
    showLogoutFormButton.style.display = 'none';
    showNewNote.style.display = 'block';
    newNotebtn.style.display = 'none';
    notesSection.style.display = 'none';
    usersSection.style.display = 'none'; // Ocultar sección de usuarios
});

// Modifica cuando se termina de crear una nota
createNewNote.addEventListener('click', () => {
    createUserNotes();
    noteButton.style.display = 'block';
    showLogoutFormButton.style.display = 'block';
    showNewNote.style.display = 'none';
    newNotebtn.style.display = 'block'; // Mostrar el botón de "Nueva Nota" de nuevo
    usersSection.style.display = 'none'; // Ocultar sección de usuarios
});

// Modifica cuando se quiere leer las notas
noteButton.addEventListener('click', () => {
    Notes();
});

readUser.addEventListener('click', () => {
    usersSection.style.display = 'block';
    readUser.style.display = 'none';
    showNewNote.style.display = 'none';
    loginFormElement.style.display = 'none';
    registerFormElement.style.display = 'none';
    showLoginFormButton.style.display = 'none';
    registerButton.style.display = 'none';
    noteButton.style.display = 'block';
    showLogoutFormButton.style.display = 'block';
    notesSection.style.display = 'none';
    newNotebtn.style.display = 'none';

    readAllUsers();
})



function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.className = `alert alert-${type}`;
    messageContainer.textContent = message;
    messageContainer.style.display = 'block';

    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}