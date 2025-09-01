// Modulo de llamadas API
// Centraliza lógica Fetch, manejo de token y errores

import { refresh } from "./auth.js";
import { unauthorized } from "./dom.js";
import { showMessage } from "./utils/utils.js";

const url = "http://localhost:8000";

async function fetchData(endpoint, method, body, token) {
  if (!token) {
    throw new Error(`No hay ningún token.`);
  }

  let response = await fetch(url + endpoint, {
    method: method,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: body,
  });

  // Verifica que no haya ningún error
  if (response.status === 401) {
    try {
      // Nuevo token
      let newToken = await refresh();

      if (newToken.success) {
        // Reintennto de fecth
        let newResponse = await fetch(url + endpoint, {
          method: method,
          headers: {
            Authorization: "Bearer " + newToken,
            "Content-Type": "application/json",
          },
          body: body,
        });

        if (newResponse.status === 401 || !newResponse.ok) {
          const errorData = await response.json();
          showMessage(
            "Sesion expirada. Por favor, vuelve a iniciar sesion",
            "error",
          );
          throw new Error(errorData.detail || "Error desconocido");
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error en refresh");
      }
    } catch (error) {
      unauthorized();
      console.log("Error en fetchData 401: ", error);
      throw new Error(`Error: `, error.message);
    }
  }

  // Lanza excepción por otro error
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `HTTP ${errorData.status}: ${errorData.detail || "Error desconocido"}`,
    );
  }

  // Obtiene los datos y los devuelve
  let data = await response.json();
  return data;
}

//
//  --- Lógica de autorizacion ---
//

export async function loginFetch(userData) {
  return await fetch(url + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: userData,
  });
}

export async function registerFetch(userData) {
  console.log("Registering user:", userData);
  return await fetch(url + "/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
}

export async function refreshFetch() {
  // Obtiene los tokens
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No se encontro el token");
  }
  const refreshToken = localStorage.getItem("refrToken");

  // Lo prepara para enviarlo
  const bodyData = { refresh: refreshToken };

  return fetchData("/refresh", "POST", JSON.stringify(bodyData), token);
}

export async function logoutFetch() {
  const token = localStorage.getItem("authToken");

  return fetchData("/logout", "POST", null, token);
}

//
//  --- Lógica de Grupos ---
//

export async function getGroups() {
  const token = localStorage.getItem("authToken");
  return await fetchData("/group/me", "GET", null, token);
}

export async function getUsersInGroup(groupId) {
  const token = localStorage.getItem("authToken");
  return await fetchData(`/group/${groupId}/users`, "GET", null, token);
}

export async function createGroup(groupData) {
  const token = localStorage.getItem("authToken");
  return await fetchData("/group", "POST", JSON.stringify(groupData), token);
}

export async function deleteGroup(groupId) {
  const token = localStorage.getItem("authToken");
  return await fetchData(`/group/${groupId}`, "DELETE", null, token);
}

export async function deleteUserFromGroup(groupId, userId) {
  const token = localStorage.getItem("authToken");
  return await fetchData(`/group/${groupId}/${userId}`, "DELETE", null, token);
}

export async function addUserToGroup(groupId, userId) {
  const token = localStorage.getItem("authToken");
  return await fetchData(`/group/${groupId}/${userId}`, "POST", null, token);
}

//
// --- Lógica de Proyectos ---
//

export async function getProjects() {
  const token = localStorage.getItem("authToken");
  return await fetchData("/projects/me", "GET", null, token);
}

export async function createProject(projectData, groupId) {
  const token = localStorage.getItem("authToken");
  return await fetchData(
    `/project/${groupId}`,
    "POST",
    JSON.stringify(projectData),
    token,
  );
}

export async function deleteProject(projectId, groupId) {
  const token = localStorage.getItem("authToken");
  return await fetchData(
    `/project/${groupId}/${projectId}`,
    "DELETE",
    null,
    token,
  );
}

//
// --- Lógica de Usuarios ---
//

export async function getCurrentUser() {
  const token = localStorage.getItem("authToken");
  return await fetchData("/user/me", "GET", null, token);
}

export async function getUsers() {
  const token = localStorage.getItem("authToken");
  return await fetchData("/user", "GET", null, token);
}

//
// --- Lógica de Tareas ---
//

//
// --- Lógica de Comentarios ---
//
