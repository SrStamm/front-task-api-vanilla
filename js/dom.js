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

export function unauthorized() {
  // No autorizado, se oculta todo
  document.querySelector(".principal-layout").style.display = "none";

  // Muestra el formulario de login
  document.getElementById("formLogContainer").style.display = "flex";
}

export function loginSucces() {
  document.querySelector(".principal-layout").style.display = "flex";
  showSections("inicioSection");

  document.getElementById("formLogContainer").style.display = "none";
}

export function showGroups(groups) {
  const groupTemplate = document.getElementById("groupTemplate");
  const groupContainer = document.getElementById("groupList");

  groupContainer.innerHTML = "";

  if (groups <= 0) {
    groupContainer.textContent = "No eres parte de ningun grupo.";
  } else {
    groups.forEach((group) => {
      // Copia el template
      const clonTemplate = groupTemplate.content.cloneNode(true);

      // Accede a cada parte del template
      const groupName = clonTemplate.querySelector(".groupName");
      const groupDescription = clonTemplate.querySelector(".groupDescription");
      const card = clonTemplate.querySelector(".card");

      // Actualiza con los datos obtenidos
      groupName.textContent = group.name;
      groupDescription.textContent = group.description || "Sin descripción";

      // Añadir evento de clic para mostrar/ocultar descripción
      card.addEventListener("click", function () {
        // Si ya está expandida, contraer
        if (this.classList.contains("expanded")) {
          this.classList.remove("expanded");
          // Eliminar el placeholder
          const placeholder = this.nextElementSibling;
          if (
            placeholder &&
            placeholder.classList.contains("card-placeholder")
          ) {
            placeholder.remove();
          }
        } else {
          // Contrae cualquier otra card expandida
          document
            .querySelectorAll(".card.expanded")
            .forEach((expandedCard) => {
              expandedCard.classList.remove("expanded");
              const placeholder = expandedCard.nextElementSibling;
              if (
                placeholder &&
                placeholder.classList.contains("card-placeholder")
              ) {
                placeholder.remove();
              }
            });

          // Expande esta card
          this.classList.add("expanded");

          // Crear un placeholder para mantener el espacio en el grid
          const placeholder = document.createElement("div");
          placeholder.classList.add("card-placeholder");
          placeholder.style.height = `${this.offsetHeight}px`;
          this.parentNode.insertBefore(placeholder, this.nextSibling);
        }
      });

      // Agrega los datos
      groupContainer.appendChild(clonTemplate);
    });
  }
}

// Cerrar cards expandidas al hacer clic fuera de ellas
document.addEventListener("click", function (event) {
  const expandedCards = document.querySelectorAll(".card.expanded");
  if (expandedCards.length > 0) {
    const isClickInsideCard = Array.from(expandedCards).some((card) =>
      card.contains(event.target),
    );

    if (!isClickInsideCard) {
      expandedCards.forEach((card) => {
        card.classList.remove("expanded");
        const placeholder = card.nextElementSibling;
        if (placeholder && placeholder.classList.contains("card-placeholder")) {
          placeholder.remove();
        }
      });
    }
  }
});

// Prevenir que el clic en la card propague y cierre la card
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    if (event.target.closest(".card")) {
      event.stopPropagation();
    }
  });
});

// setupLogoutBotton
// Encontrar el boton, agregar un evento y llamar a la funcion de auth.js
