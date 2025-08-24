// Exclusivo para llamadas de la API
// Una función fetchData(endpoint, method, body) que maneje las peticiones
// Funciones especificas como getProjects() o getTasks() que usen la función anterior

const url = "http://localhost:8000";

async function fetchData(endpoint, method, body, token) {
  const response = await fetch(url + endpoint, {
    method: method,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: body,
  });

  // Verifica que no haya ningún error
  if (!response.ok) {
    const dataError = await response.json();
    throw new Error(dataError.detail);
  }

  // Obtiene los datos y los devuelve
  const data = await response.json();
  return data;
}

//
//  --- Lógica de Grupos ---
//

export async function getGroups() {
  const token = localStorage.getItem("authToken");
  return await fetchData("/group/me", "GET", null, token);
}

export async function createGroup(groupData) {
  const token = localStorage.getItem("authToken");
  return await fetchData("/group", "POST", JSON.stringify(groupData), token);
}

//
// --- Lógica de Proyectos ---
//

export async function getProjects() {
  const token = localStorage.getItem("authToken");
  return await fetchData("/projects/me", "GET", null, token);
}

//
// --- Lógica de Usuarios ---
//

//
// --- Lógica de Tareas ---
//

//
// --- Lógica de Comentarios ---
//
