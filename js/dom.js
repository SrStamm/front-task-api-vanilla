// Centralizar la lógica de manipulación del DOM y el manejo de eventos de la interfaz de usuario
// Funciones para mostrar u ocultar secciones
// Eventos de los enlaces para cambiar entre el formulario de login y registro
// Eventos para los botones de sidebar

export function showSections(sectionId) {
  // Oculta todas las secciones de contenido
  document.querySelectorAll("section").forEach((section) => {
    section.style.display = "none";
  });

  // Muestra la seccion que corresponde al ID
  document.getElementById(sectionId).style.display = "grid";
}

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

