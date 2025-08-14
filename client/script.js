// URL del servidor
const url = "http://localhost:8000";

// Botones
let showRegisterBtn = document.getElementById("showRegister");
let showLoginBtn = document.getElementById("showLogin");
let logoutBtn = document.getElementById("logoutBtn");
let userBtn = document.getElementById("userBtn");

// Formularios
let registerForm = document.getElementById("registerForm");
let registerElement = document.getElementById("registerFormElement");

let loginForm = document.getElementById("loginForm");
let loginElement = document.getElementById("loginFormElement");

let notesSection = document.getElementById("notesSection");

let messageContainer = document.getElementById("messageContainer");

// Funciones
function loginAcccessSuccess() {
  loginForm.style.display = "none";
  notesSection.style.display = "block";
  logoutBtn.style.display = "block";
  userBtn.style.display = "block";
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
  }, 4500);
}

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
    showMessage(`Error: ${error.message}`, "error");
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

    loginForm.style.display = "block";
    notesSection.style.display = "none";
    logoutBtn.style.display = "none";
    userBtn.style.display = "none";

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

      notesContainer.appendChild(clonTemplate);
    });
  } catch (error) {}
}
