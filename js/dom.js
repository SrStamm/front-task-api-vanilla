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

export function showGroups(groups) {
  const groupTemplate = document.getElementById("groupTemplate");
  const groupContainer = document.getElementById("groupSection");

  if (groups <= 0) {
    groupContainer.textContent = "No eres parte de ningun grupo.";
  } else {
    groups.forEach((group) => {
      // Copia el template
      const clonTemplate = groupTemplate.content.cloneNode(true);

      // Accede a cada parte del template
      const groupName = clonTemplate.querySelector(".groupName");
      const groupDescription = clonTemplate.querySelector(".groupDescription");

      // Actualiza con los datos obtenidos
      groupName.textContent = group.name;
      groupDescription.textContent = group.description;

      // Agrega los datos
      groupContainer.appendChild(clonTemplate);
    });
  }
}
