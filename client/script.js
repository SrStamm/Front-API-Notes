// Instancias
let showRegisterBtn = document.getElementById("showRegister");
let registerForm = document.getElementById("registerForm");
let registerElement = document.getElementById("registerFormElement");

let showLoginBtn = document.getElementById("showLogin");
let loginForm = document.getElementById("loginForm");
let loginElement = document.getElementById("loginFormElement");

let notesSection = document.getElementById("notesSection");

let messageContainer = document.getElementById("messageContainer");

// Funciones
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
  messageContainer.textContent = message;
  messageContainer.className = `alert alert-${type}`;
  messageContainer.style.display = "block";

  setTimeout(() => {
    messageContainer.style.display = "none";
    messageContainer.textContent = "";
  }, 5000);
}

// Enviar formulario
registerElement.addEventListener("submit", function (event) {
  event.preventDefault();

  const datos = {
    username: document.getElementById("newUsername").value,
    email: document.getElementById("newEmail").value,
    password: document.getElementById("newPassword").value,
  };

  fetch("http://localhost:8000/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.detail || "Error al enviar el formulario");
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Respuesta del servidor:", data);

      registerForm.style.display = "none";
      loginForm.style.display = "block";
    })
    .catch((error) => {
      console.error("Hubo un problema con la operación fetch:", error.message);
      showMessage(`Error: ${error.message}`, "error");
    });
});

loginElement.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("current-password").value;

  // Codifica los datos
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

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

      loginForm.style.display = "none";
      notesSection.style.display = "block";
    } else {
      showMessage("Error: Problemas con el Servidor", "error");
    }
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    showMessage(`Error: ${error.message}`, "error");
  }
});
