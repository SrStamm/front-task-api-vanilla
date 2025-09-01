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
import { unauthorized, loginSucces, showLoginForm } from "./dom.js";
import { showMessage } from "./utils/utils.js";

// Validar la autenticación del usuario
export async function validToken() {
  try {
    const response = await getCurrentUser();
    console.log("UserId: ", response.user_id);
    return { success: true, message: "Usario validado" };
  } catch (error) {
    unauthorized();
    localStorage.removeItem("authToken");
    localStorage.removeItem("refrToken");
  }
}

// Funcion que se ejecuta al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  try {
    let validated = await validToken();
    if (validated.success) {
      loginSucces();
    }
  } catch (error) {}
});

// Funcion de login
export async function login() {
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
    localStorage.setItem("authToken", responseData.access_token);
    localStorage.setItem("refrToken", responseData.refresh_token);

    showMessage("Sesión iniciada con suceso", "success");
    return {
      success: true,
      accessToken: responseData.access_token,
      refreshToken: responseData.refresh_token,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Funcion para registrarse
export async function register() {
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

    console.log("Response register: ", response);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail);
    }

    const dataResponse = await response.json();
    console.info("Detail: ", dataResponse.detail);

    return { success: true, message: dataResponse.detail };
  } catch (error) {
    console.error("Error al crear un usuario: ", error);
    return { success: false, message: error.message };
  }
}

// Función de refresh token
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

// Función de logout
export async function logout() {
  let response = await logoutFetch();

  if (response.detail == "Closed all sessions") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refrToken");
    return { success: true, message: "Sesión cerrada" };
  }

  return response;
}

// Botones
const logoutBtn = document.getElementById("logoutBtn");
const registerBtn = document.querySelector('[data-action="register"]');
// const registerBtn = document.querySelector('#registerBtn ');

// Logout
logoutBtn.addEventListener("click", async () => {
  try {
    let response = await logout();

    if (response.success) {
      showMessage("Sesión cerrada", "info");
      unauthorized();
    } else {
      showMessage(error.message, "error");
    }
  } catch (error) {
    showMessage("Ocurrió un error inesperado al cerrar sesión.", "error");
  }
});

registerBtn.addEventListener("click", async () => {
  try {
    let response = await register();

    if (response.success) {
      showMessage(
        "Usuario creado con éxito. Por favor, inicie sesión.",
        "success",
      );
      // Modifica la vista
      showLoginForm();
    } else {
      showMessage(response.message, "error");
    }
  } catch (error) {
    showMessage(
      "Ocurrió un error inesperado al registrar el usuario.",
      "error",
    );
  }
});

// const loginBtn = document.querySelector('[data-action="login"]');
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  try {
    let response = await login();

    if (!response.success) {
      throw new Error(response.message || "Error al iniciar sesión");
    }

    // Obtiene los token de iniciar sesión
    localStorage.setItem("authToken", response.accessToken);
    localStorage.setItem("refrToken", response.refreshToken);

    showMessage("Sesión iniciada con suceso", "success");
    loginSucces();
  } catch (error) {
    console.error(error.message);
    if (error.message === "User not found") {
      showMessage("Usuario no encontrado", "error");
    } else {
      showMessage("Error al iniciar sesión", "error");
    }
  }
});
