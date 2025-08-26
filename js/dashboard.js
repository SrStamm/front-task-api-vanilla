// Este sería el "punto de entrada" una vez el usuario este autenticado
// Verificar si esta autenticado
// Si lo está, carga el dashboard y las primeras secciones
// Manejar los eventos del sidebar para mostrar las secciones
// Llama a las funciones de `api.js` para obtener los datos iniciales y a los de `dom.js` para renderizarlos

import { showSections, showGroups, showModal, occultModal } from "./dom.js";
import { createGroup, getGroups } from "./api.js";

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

export async function loadGroup() {
  try {
    // Llama a la funcion que obtendra los grupos
    const groups = await getGroups();

    // Si fue exitosa, los muestra
    showGroups(groups);
  } catch (error) {
    console.error("No se pudo cargar la lista de grupos: ", error.message);
  }
}

// Botones en dashboard
const createGroupBtn = document.getElementById("createGroupBtn");

createGroupBtn.addEventListener("click", () => {
  showModal("modalGroup");
});

// Botones del modal
const saveGroupBtn = document.getElementById("saveGroup");

// Evento de creación de un grupo
saveGroupBtn.addEventListener("click", async () => {
  let response = await createGroupEvent();

  if (response == "Se ha creado un nuevo grupo de forma exitosa") {
    console.log("Grupo creado exitosamente");
  } else {
    console.log("Error al crear el grupo: ", response.detail);
  }
  occultModal("modalGroup");
  loadGroup();
});

// Funciones completas
async function createGroupEvent() {
  try {
    // Obtiene los datos
    const newGroupName = document.getElementById("newGroupName").value;
    const newGroupDescription = document.getElementById(
      "newGroupDescription",
    ).value;

    let data = {
      name: newGroupName,
      description: newGroupDescription || null,
    };

    let response = await createGroup(data);
    console.log("Respone al crear el grupo: ", response);

    return response.detail;
  } catch (error) {
    console.log("Error en crear un grupo: ", error);
  }
}
