// Gestiona todo lo relacionado con autenticación, envio de forms y registro, gestión de almacen de token

import { showLoginForm, showRegisterForm } from "./dom.js";

// Links de los formularios
const registerLink = document.getElementById("registerLink");
const loginLink = document.getElementById("loginLink");

registerLink.addEventListener("click", function (event) {
  event.preventDefault();

  showRegisterForm();
});

loginLink.addEventListener("click", function (event) {
  event.preventDefault();

  showLoginForm();
});
