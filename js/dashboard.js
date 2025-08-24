// Este sería el "punto de entrada" una vez el usuario este autenticado
// Verificar si esta autenticado
// Si lo está, carga el dashboard y las primeras secciones
// Manejar los eventos del sidebar para mostrar las secciones
// Llama a las funciones de `api.js` para obtener los datos iniciales y a los de `dom.js` para renderizarlos

import { showSections, showGroups } from "./dom.js";
import { getGroups } from "./api.js";

// sidebar Secciones
const startSection = document.getElementById("sidebarInicioSection");
const groupSection = document.getElementById("sidebarGroupSection");
const projectSection = document.getElementById("sidebarProjectSection");
const taskSection = document.getElementById("sidebarTaskSection");
const chatSection = document.getElementById("sidebarChatSection");

startSection.addEventListener("click", function () {
  showSections("inicioSection");
});

groupSection.addEventListener("click", function () {
  showSections("groupSection");
  loadGroup();
});

projectSection.addEventListener("click", function () {
  showSections("projectSection");
});

taskSection.addEventListener("click", function () {
  showSections("taskSection");
});

chatSection.addEventListener("click", function () {
  showSections("chatSection");
});

async function loadGroup() {
  try {
    // Llama a la funcion que obtendra los grupos
    const groups = await getGroups();

    // Si fue exitosa, los muestra
    showGroups(groups);
  } catch (error) {
    console.error("No se pudo cargar la lista de grupos: ", error.message);
  }
}
