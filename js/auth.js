// Eventos de autorización

import { getCurrentUser } from "./api.js";
import { unauthorized, loginSucces } from "./dom.js";

// Validar la autenticación del usuario
export async function validToken() {
  try {
    const response = await getCurrentUser();
    console.log("UserId: ", response.user_id);
    loginSucces();
  } catch (error) {
    unauthorized();
    localStorage.removeItem("authToken");
    localStorage.removeItem("refrToken");
  }
}

// Funcion que se ejecuta al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  validToken();
});

// Funcion de refresh token

// Funcion centrar para cerrar sesion
// Debe limpiar los tokens y cambiar el dom, ademas de ejecutar la funcion de logout de api.js
