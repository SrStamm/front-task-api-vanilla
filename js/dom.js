// Manipulación del DOM y renderizado
// Contiene funciones para mostrar/ocultar secciones, modals, y renderizar datos

import { modal } from "./utils/modal.js";

export const domFunctions = {
  unauthorized() {
    // No autorizado, se oculta todo
    document.querySelector(".principal-layout").style.display = "none";

    // Muestra el formulario de login
    document.getElementById("formLogContainer").style.display = "flex";
  },

  loginSucces() {
    document.querySelector(".principal-layout").style.display = "grid";
    modal.showSections("inicioSection");

    document.getElementById("formLogContainer").style.display = "none";
  },

  showLoginForm() {
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("registerSection").style.display = "none";
  },

  showRegisterForm() {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("registerSection").style.display = "block";
  },
};
