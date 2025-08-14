// Instancias
let showRegisterBtn = document.getElementById("showRegister");
let registerForm = document.getElementById("registerForm");
let showLoginBtn = document.getElementById("showLogin");
let loginForm = document.getElementById("loginForm");

// Funciones
showRegisterBtn.addEventListener("click", () => {
  loginForm.style.display = "none";
  registerForm.style.display = "block";
});

showLoginBtn.addEventListener("click", () => {
  registerForm.style.display = "none";
  loginForm.style.display = "block";
});
