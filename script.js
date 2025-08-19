// URL del servidor
const url = "http://localhost:8000";

// variable global
let currentNoteId = 0;

// Botones
let showRegisterBtn = document.getElementById("showRegister");
let showLoginBtn = document.getElementById("showLogin");
let logoutBtn = document.getElementById("logoutBtn");
let userBtn = document.getElementById("userBtn");
let addNoteBtn = document.getElementById("addNoteBtn");
let cancelNoteBtn = document.getElementById("cancelNoteBtn");
let myNotesBtn = document.getElementById("noteBtn");
let notesSharedToMe = document.getElementById("sharedNotesBtn");
let saveNoteBtn = document.getElementById("saveNoteBtn");
let actualUserBtn = document.getElementById("actualUserBtn");

// Formularios
let registerForm = document.getElementById("registerForm");
let registerElement = document.getElementById("registerFormElement");
let noteForm = document.getElementById("noteForm");

let loginForm = document.getElementById("loginForm");
let loginElement = document.getElementById("loginFormElement");

let notesSection = document.getElementById("notesSection");
let noteFormElement = document.getElementById("noteFormElement");

let userSection = document.getElementById("usersSection");

let messageContainer = document.getElementById("messageContainer");

// Funciones
function loginAcccessSuccess() {
  loginForm.style.display = "none";
  notesSection.style.display = "block";
  logoutBtn.style.display = "block";
  userBtn.style.display = "block";
  notesSharedToMe.style.display = "block";
  actualUserBtn.style.display = "block";
}

function unauthorizedAccess() {
  loginForm.style.display = "block";

  notesSection.style.display = "none";
  logoutBtn.style.display = "none";
  userBtn.style.display = "none";
  actualUserBtn.style.display = "none";
}

function occultNotes() {
  notesSection.style.display = "none";
  myNotesBtn.style.display = "none";
}

showRegisterBtn.addEventListener("click", () => {
  loginForm.style.display = "none";
  registerForm.style.display = "block";
});

showLoginBtn.addEventListener("click", () => {
  registerForm.style.display = "none";
  loginForm.style.display = "block";
});

// Mostrar advertencia personalizada
function showMessage(message, type = "error") {
  // Vacia por si habia un mensaje antes
  messageContainer.style.display = "none";
  messageContainer.textContent = "";

  // Actualiza el mensaje y lo muestra
  messageContainer.textContent = message;
  messageContainer.className = `alert alert-${type}`;
  messageContainer.style.display = "block";

  setTimeout(() => {
    messageContainer.style.display = "none";
    messageContainer.textContent = "";
  }, 4000);
}

// Verifica el estado de la sesión del Usuario
async function checkUserSession() {
  const token = localStorage.getItem("authToken");

  try {
    if (!token) {
      return false;
    }

    const response = await fetch(url + "/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error al verificar el estado:", error);
    showMessage("Debe iniciar sesión nuevamente", "error");
  }
}

// Evento que se ejecuta al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  const response = await checkUserSession();

  if (response == false) {
    loginForm.style.display = "block";
    occultNotes();
  } else {
    loginAcccessSuccess();
    showNotes();
  }
});

// Enviar formulario
registerElement.addEventListener("submit", async (event) => {
  event.preventDefault();

  const datos = {
    username: document.getElementById("newUsername").value,
    email: document.getElementById("newEmail").value,
    password: document.getElementById("newPassword").value,
  };

  try {
    const response = await fetch(url + "/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al enviar el formulario");
    }

    const data = await response.json();
    console.log("Respuesta del servidor:", data);

    showMessage(
      "Usuario creado exitosamente! Ya puedes acceder al servicio.",
      "success",
    );
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  } catch (error) {
    console.error("Hubo un problema con la operación fetch:", error.message);
    showMessage(`Error: ${error.message}`, "error");
  }
});

loginElement.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Elimina el token almacenado, si existe
  localStorage.removeItem("authToken");

  // Obtiene la información del formulario
  const username = document.getElementById("username").value;
  const password = document.getElementById("current-password").value;

  // Codifica los datos
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  // Realiza la llamada al servidor
  try {
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Credenciales incorrectas");
    }

    const data = await response.json();
    console.log("Respuesta del servidor", data);

    // Almacena el token
    if (data.access_token) {
      localStorage.setItem("authToken", data.access_token);
      showMessage("Inicio de sesión exitoso!", "success");

      loginAcccessSuccess();
      showNotes();
    } else {
      showMessage("Error: Problemas con el Servidor", "error");
    }
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    if (error.message == "NetworkError when attempting to fetch resource.") {
      showMessage("Error interno");
    } else {
      showMessage(`Error: ${error.message}`, "error");
    }
  }
});

logoutBtn.addEventListener("click", async () => {
  token = localStorage.getItem("authToken");

  try {
    const response = await fetch(url + "/logout", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al cerrar sesión");
    }

    localStorage.removeItem("authToken");

    loginForm.style.display = "block";
    occultNotes();
    noteForm.style.display = "none";
    logoutBtn.style.display = "none";
    occultUsers();

    showMessage("Sesión cerrada correctamente", "success");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    showMessage(`Error: ${error.message}`, "error");
  }
});

// Notas
async function showNotes() {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(url + "/notes/personal/", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al obtener las notas");
    }

    // Obtiene las notas
    let listNotes = await response.json();

    let notesContainer = document.getElementById("notesContainer");

    notesContainer.innerHTML = "";

    // Obtiene el template de la nota
    const noteTemplate = document.getElementById("noteTemplate");

    listNotes.forEach((notes) => {
      const clonTemplate = noteTemplate.content.cloneNode(true);

      // Accede a cada parte del template
      const textNote = clonTemplate.querySelector(".note-text");
      const categoryNote = clonTemplate.querySelector("#noteCategoryBadge");

      // Actualiza
      textNote.textContent = notes.text;
      categoryNote.textContent = notes.category;

      // Botones

      let editNotesBtn = clonTemplate.querySelector(".editBtn");
      let deleteNoteBtn = clonTemplate.querySelector(".deleteBtn");
      let shareNoteBtn = clonTemplate.querySelector(".shareBtn");

      // Eliminar nota
      deleteNoteBtn.addEventListener("click", async () => {
        try {
          const response = await fetch(url + `/notes/${notes.id}`, {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.error("Error al eliminar la nota");
          }

          showMessage("Nota eliminada exitosamente.", "success");
          showNotes();
        } catch (error) {
          showMessage("No se pudo eliminar la nota", "error");
        }
      });

      editNotesBtn.addEventListener("click", async () => {
        occultNotes();
        noteForm.style.display = "block";
        myNotesBtn.style.display = "block";
        actualUserBtn.style.display = "block";

        currentNoteId = notes.id;

        document.querySelector("#noteText").value = notes.text;
        document.querySelector("#noteCategory").value = notes.category;
        document.querySelector("#formTitle").textContent = "Editando Nota";
        document.querySelector("#saveNoteBtn").textContent = "Editar";
      });

      shareNoteBtn.addEventListener("click", async () => {
        occultNotes();
        userSection.style.display = "block";
        myNotesBtn.style.display = "block";
        actualUserBtn.style.display = "block";
        userBtn.style.display = "none";
        showUsers();

        currentNoteId = notes.id;
      });

      notesContainer.appendChild(clonTemplate);
    });
  } catch (error) {
    console.error("Error al acceder a las notas:", error);
    if (error.message == "Invalid token") {
      showMessage(`Sesion expirada. Inicie sesión nuevamente`, "error");
      unauthorizedAccess();
    } else {
      showMessage(`Error Interno`, "error");
      unauthorizedAccess();
    }
  }
}

addNoteBtn.addEventListener("click", async () => {
  noteForm.style.display = "block";
  notesSection.style.display = "none";
  myNotesBtn.style.display = "block";
  actualUserBtn.style.display = "block";
});

saveNoteBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  if (currentNoteId == 0) {
    saveNote();
  } else {
    editNote();
    noteForm.style.display = "none";
    notesSection.style.display = "block";
    myNotesBtn.style.display = "none";
    actualUserBtn.style.display = "block";
    showNotes();
  }
});

async function saveNote() {
  token = localStorage.getItem("authToken");

  data = {
    text: document.getElementById("noteText").value,
    category: document.getElementById("noteCategory").value,
  };

  if (!data.text) {
    showMessage("Se debe agregar el texto", "error");
    throw new Error("Error: Falta el texto");
  }
  if (!data.category) {
    showMessage("Se debe seleccionar una categoria", "error");
    throw new Error("Error: Falta la categoria");
  }

  try {
    const response = await fetch(url + "/notes/", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Error: ", response);
      throw new Error("Error: No se pudo crear la nota");
    }

    showMessage("Nota creada con éxito!", "success");
    document.getElementById("noteFormElement").reset();
  } catch (error) {
    console.log("Error: ", error);
    showMessage("Error al crear la nota");
  }
}

async function editNote() {
  token = localStorage.getItem("authToken");

  data = {
    text: document.getElementById("noteText").value,
    category: document.getElementById("noteCategory").value,
  };

  try {
    const response = await fetch(url + `/notes/${currentNoteId}`, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Error: ", response);
      throw new Error("Error: No se pudo editar la nota");
    }

    showMessage("Nota editada con éxito!", "success");
  } catch (error) {
    console.log("Error: ", error);
    showMessage("Error al editar la nota");
  }
}

cancelNoteBtn.addEventListener("click", () => {
  document.getElementById("noteFormElement").reset();
  noteForm.style.display = "none";
  myNotesBtn.style.display = "none";
  actualUserBtn.style.display = "block";

  notesSection.style.display = "block";
  showNotes();
});

myNotesBtn.addEventListener("click", () => {
  document.getElementById("noteFormElement").reset();
  noteForm.style.display = "none";
  myNotesBtn.style.display = "none";
  actualUserBtn.style.display = "block";
  notesSharedToMe.style.display = "block";

  const container = document.getElementById("notesSection");
  container.querySelector("h2").textContent = "Mis Notas";
  addNoteBtn.style.display = "block";

  notesSection.style.display = "block";
  showNotes();
  occultUsers();
  userBtn.style.display = "block";
});

notesSharedToMe.addEventListener("click", () => {
  const container = document.getElementById("notesSection");
  container.querySelector("h2").textContent = "Notas compartidas";
  document.getElementById("notesContainer").innerHTML = "";
  document.getElementById("addNoteBtn").style.display = "none";
  notesSharedToMe.style.display = "none";
  myNotesBtn.style.display = "block";
  occultUsers();
  actualUserBtn.style.display = "none";
  document.getElementById("actualUserSection").style.display = "none";

  showSharedNotes();
});

async function showSharedNotes() {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(url + "/notes/shared/", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al obtener las notas");
    }

    // Obtiene las notas
    let listNotes = await response.json();

    let notesContainer = document.getElementById("notesContainer");

    notesContainer.innerHTML = "";

    // Obtiene el template de la nota
    const noteTemplate = document.getElementById("noteTemplate");

    for (let notes of listNotes) {
      const clonTemplate = noteTemplate.content.cloneNode(true);

      // Accede a cada parte del template
      const textNote = clonTemplate.querySelector(".note-text");
      const categoryNote = clonTemplate.querySelector("#noteCategoryBadge");
      const originalUserId = clonTemplate.querySelector("#noteOriginalUserID");

      // Obtiene información del usuario que compartio la nota
      const userData = await getUserWhitId(notes.original_user_id);

      // Actualiza
      textNote.textContent = notes.text;
      categoryNote.textContent = notes.category;
      originalUserId.textContent = userData.username;

      // Botones
      let editNotesBtn = clonTemplate.querySelector(".editBtn");
      let deleteNoteBtn = clonTemplate.querySelector(".deleteBtn");
      let shareNoteBtn = clonTemplate.querySelector(".shareBtn");

      if (notes.original_user_id >= 0) {
        editNotesBtn.style.display = "none";
        deleteNoteBtn.style.display = "none";
        shareNoteBtn.style.display = "none";
      }

      notesContainer.appendChild(clonTemplate);
    }
  } catch (error) {
    console.error("Error al acceder a las notas:", error);
    if (error.message == "Invalid token") {
      showMessage(`Sesion expirada. Inicie sesión nuevamente`, "error");
      unauthorizedAccess();
    } else {
      showMessage(`Error Interno`, "error");
    }
  }
}

// Usuarios
async function showUsers() {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(url + "/users/all-users/", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error("Error:", errorData.message);
    }

    // Obtiene la lista de Usuarios
    const userList = await response.json();

    let userTableBody = document.getElementById("usersTableBody");

    userTableBody.innerHTML = "";

    // Obtiene el template de la nota
    const userTemplate = document.getElementById("userTemplate");

    userList.forEach((user) => {
      const clonTemplate = userTemplate.content.cloneNode(true);

      // Accede a cada parte del template
      clonTemplate.querySelector(".userId").textContent = user.user_id;
      clonTemplate.querySelector(".userName").textContent = user.username;

      shareBtn = clonTemplate.querySelector(".shadeUserBtn");

      shareBtn.addEventListener("click", async () => {
        if (currentNoteId == 0) {
          showMessage(
            "Error: Primero se debe seleccionar la nota a compartir",
            "error",
          );
          throw new Error(
            "Error: Primero se debe seleccionar la nota a compartir",
          );
        }

        data = { note_id: currentNoteId, shared_user_id: user.user_id };

        const response = await fetch(
          url + `/notes/${data.note_id}/shared/${data.shared_user_id}`,
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },

            body: JSON.stringify(data),
          },
        );

        if (!response.ok) {
          console.error("Error: ", response);
          const errorData = await response.json();
          if (errorData.detail == "Ya se ha compartido esta nota") {
            showMessage("Está nota ya fue compartida al usuario", "error");
            throw new Error("Error: Esta nota ya fue compartida");
          }
          throw new Error("Error: No se pudo compartir la nota");
        }

        showMessage("Nota compartida con éxito!", "success");
        userSection.style.display = "none";
        notesSection.style.display = "block";
        showNotes();
      });

      userTableBody.appendChild(clonTemplate);
    });
  } catch (error) {}
}

async function getUserWhitId(id) {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(url + `/users/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al obtener el usuario");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    showMessage("Error interno", "error");
  }
}

function occultUsers() {
  userSection.style.display = "none";
  userBtn.style.display = "none";
}

userBtn.addEventListener("click", () => {
  userSection.style.display = "block";
  showUsers();

  occultNotes();
  userBtn.style.display = "none";
  notesSharedToMe.style.display = "none";
  myNotesBtn.style.display = "block";
  noteForm.style.display = "none";
});

// Actual user
actualUserBtn.addEventListener("click", async () => {
  occultNotes();
  occultUsers();

  notesSharedToMe.style.display = "block";
  myNotesBtn.style.display = "block";
  document.getElementById("actualUserSection").style.display = "block";
  await showActualUser();
  await getAllSessions();
});

async function showActualUser() {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(url + "/users/me", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error");
    }

    const data = await response.json();

    document.getElementById("actualUsername").textContent = data.username;
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function getAllSessions() {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(url + "/sessions", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const dataError = await response.json();
      throw new Error("Error: ", dataError.message);
    }

    const data = await response.json();

    let userTableBody = document.getElementById("sessionTableBody");

    userTableBody.innerHTML = "";

    // Obtiene el template de la nota
    const userTemplate = document.getElementById("userSessionTemplate");

    data.forEach((session) => {
      const clonTemplate = userTemplate.content.cloneNode(true);

      // Accede a cada parte del template
      clonTemplate.querySelector(".sessionId").textContent = session.session_id;
      clonTemplate.querySelector(".active").textContent = session.is_active;

      userTableBody.appendChild(clonTemplate);
    });
  } catch (error) {
    console.error("Error: ", error);
  }
}
