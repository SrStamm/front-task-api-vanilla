// Validación del token y manejo de sesion
// Contiene la logica del refresh y logout

import { getCurrentUser, logoutFetch, refreshFetch } from "./api.js";
import { unauthorized, loginSucces, showMessage } from "./dom.js";

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
export async function refresh() {
  try {
    const response = await refreshFetch();

    const data = await response.json();

    if (data.access_token) {
      // Elimina los token
      localStorage.removeItem("authToken");
      localStorage.removeItem("refrToken");

      // Guarda los nuevos tokens
      localStorage.setItem("authToken", data.access_token);
      localStorage.setItem("refrToken", data.refresh_token);
    }
  } catch (error) {
    if (error.message == "Token Not Authorized") {
      console.error("Refresh Token no valido");
    }
  }
}

// Funcion centrar para cerrar sesion
// Debe limpiar los tokens y cambiar el dom, ademas de ejecutar la funcion de logout de api.js
export async function logout() {
  let response = await logoutFetch();

  if (response.detail == "Closed all sessions") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refrToken");
    unauthorized();
    showMessage("Sesión cerrada", "info");
  }

  return response;
}
