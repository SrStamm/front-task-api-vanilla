// Manejo de formularios de login y register
// Llamadas a la API
// Manejo de los tokens

import { loginSucces } from "./dom.js";

const url = "http://localhost:8000";

// Links de los formularios
const registerLink = document.getElementById("registerLink");
const loginLink = document.getElementById("loginLink");

registerLink.addEventListener("click", function (event) {
  event.preventDefault();

  document.getElementById("loginSection").style.display = "none";
  document.getElementById("registerSection").style.display = "block";
});

loginLink.addEventListener("click", function (event) {
  event.preventDefault();

  document.getElementById("loginSection").style.display = "block";
  document.getElementById("registerSection").style.display = "none";
});

// Botones
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

loginBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  // Obtiene los datos ingresados
  const username = document.getElementById("usernameLogin").value;
  const password = document.getElementById("passwordLogin").value;

  // Codifica los datos
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  try {
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

    // Cambia al inicio de sesión
    document.querySelector("#formLogContainer").style.display = "none";
    document.querySelector(".principal-layout").style.display = "flex";

    // Muestra la seccion principal del dashboard
    loginSucces();
  } catch (error) {
    console.error("Error al iniciar sesión: ", error);
  }
});

registerBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  // Obtiene los datos ingresados
  const data = {
    username: document.getElementById("usernameRegister").value,
    email: document.getElementById("emailRegister").value,
    password: document.getElementById("passwordRegister").value,
  };

  try {
    const response = await fetch(url + "/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

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
});
