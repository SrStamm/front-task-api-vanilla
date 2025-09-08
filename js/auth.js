// Validación del token y manejo de sesion
// Contiene la logica del refresh y logout

// MERGE login.js and auth.js in this file. Combine both files into a single file.
// CREATE an auth object: Export a single object that contains all the functions related to authentication (validToken, refresh, logout, etc.).
// This will help in organizing the code better.
// DECOUPLE from the DOM: this files directly manipulates the DOM. Instead, it should only handle authentication logic and return status or data.
// The DOM manipulation should be handled in a separate file or layer.
// For example, the main script would then handle the button click and call the `auth.login` function, and based on the result, it would update the DOM accordingly.

import {
  getCurrentUser,
  logoutFetch,
  refreshFetch,
  loginFetch,
  registerFetch,
} from "./api.js";
import { unauthorized, loginSucces } from "./dom.js";
import { showMessage } from "./utils/utils.js";

class Auth {
  // Validar la autenticación del usuario
  async validateToken() {
    try {
      const response = await getCurrentUser();

      return { success: true, message: "Usario validado" };
    } catch (error) {
      unauthorized();
      localStorage.removeItem("authToken");
      localStorage.removeItem("refrToken");
    }
  }

  async refresh() {
    try {
      const response = await refreshFetch();

      const data = await response.json();

      if (data.access_token) {
        // Guarda los nuevos tokens
        localStorage.setItem("authToken", data.access_token);
        localStorage.setItem("refrToken", data.refresh_token);
      }

      return { success: true, message: "Sesión refrescada" };
    } catch (error) {
      if (error.message == "Token Not Authorized") {
        console.error("Refresh Token no valido");
      }
      return {
        success: false,
        message: error.message || "Error al refrescar la sesión",
      };
    }
  }

  async logout() {
    try {
      let response = await logoutFetch();

      if (response.detail == "Closed all sessions") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refrToken");
        return { success: true, message: "Sesión cerrada" };
      }
    } catch (error) {
      showMessage("Ocurrió un error inesperado al cerrar sesión.", "error");
      return {
        success: false,
        message: error.message || "Error al cerrar sesión",
      };
    }
  }

  async login() {
    // Obtiene los datos ingresados
    const username = document.getElementById("usernameLogin").value;
    const password = document.getElementById("passwordLogin").value;

    if (!username || !password) {
      showMessage("Por favor, complete todos los campos", "warning");
      throw new Error("Faltan campos por completar");
    }

    // Codifica los datos
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await loginFetch(formData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }
      // Obtiene los token de iniciar sesión
      const responseData = await response.json();

      return {
        success: true,
        accessToken: responseData.access_token,
        refreshToken: responseData.refresh_token,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async register() {
    // Obtiene los datos ingresados
    let username = document.getElementById("usernameRegister").value;
    let email = document.getElementById("emailRegister").value;
    let password = document.getElementById("passwordRegister").value;

    // Validación de campos
    if (!username || !email || !password) {
      showMessage("Por favor, complete todos los campos", "warning");
      throw new Error("Faltan campos por completar");
    }

    const data = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await registerFetch(data);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }

      const dataResponse = await response.json();

      return { success: true, message: dataResponse.detail };
    } catch (error) {
      console.error("Error al crear un usuario: ", error);
      return { success: false, message: error.message };
    }
  }
}

export const auth = new Auth();

// Funcion que se ejecuta al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  try {
    let validated = await auth.validateToken();
    if (validated.success) {
      loginSucces();
    }
  } catch (error) {}
});
