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
} from "./api.js";
import {
  unauthorized,
  loginSucces,
  showRegisterForm,
  showLoginForm,
} from "./dom.js";
import { showMessage } from "./utils/utils.js";

const url = "http://localhost:8000";

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

// Funcion de login
async function login() {
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
    console.info("Detail: ", responseData.detail);
    return responseData;
  } catch (error) {
    console.error("Error al iniciar sesión: ", error);
    console.error(error.message);
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail);
    }

    const dataResponse = await response.json();
    console.info("Detail: ", dataResponse.detail);

    document.getElementById("loginSection").style.display = "block";
    document.getElementById("registerSection").style.display = "none";
  } catch (error) {
    console.error("Error al crear un usuario: ", error);
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
  } catch (error) {
    if (error.message == "Token Not Authorized") {
      console.error("Refresh Token no valido");
    }
  }
}

// Función de logout
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

// Botones
const logoutBtn = document.getElementById("logoutBtn");
// const loginBtn = document.querySelector('[data-action="login"]');
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.querySelector('[data-action="register"]');

// Logout
logoutBtn.addEventListener("click", async () => {
  try {
    await logout();

    unauthorized();
  } catch (error) {
    console.log("Error: ", error);
  }
});

loginBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  try {
    // await login();

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

    const response = await fetch(url + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail);
    }

    // Obtiene los token de iniciar sesión
    const responseData = await response.json();
    localStorage.setItem("authToken", responseData.access_token);
    localStorage.setItem("refrToken", responseData.refresh_token);

    showMessage("Sesión iniciada con suceso", "success");
    loginSucces();
  } catch (error) {
    console.error("Error al iniciar sesión: ", error);
    console.error(error.message);
  }
});

registerBtn.addEventListener("click", async () => {
  try {
    await register();

    showLoginForm();
  } catch (error) {}
});
