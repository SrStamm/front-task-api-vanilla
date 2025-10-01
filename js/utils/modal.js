// Move showSections, showModal, and occultModal in this file
// These functions are still general utilities for managing the display of different sections and modals

export const modal = {
  // Mostrar secciones del dashboard
  showSections(sectionId) {
    // Oculta todas las secciones de contenido
    document.querySelectorAll(".dashboard-section").forEach((section) => {
      section.style.display = "none";
    });

    // Muestra la seccion que corresponde al ID
    document.getElementById(sectionId).style.display = "grid";
  },

  // Mostrar modal
  showModal(modalId) {
    const modalContainer = document.getElementById(modalId);
    modalContainer.classList.remove("hidden"); // Asegura que sea visible
    setTimeout(() => {
      modalContainer.classList.add("show"); // Activa la animación
    }, 10); // Pequeño retraso para que la transición ocurra
  },

  occultModal(modalId) {
    const modalGroupContainer = document.getElementById(modalId);
    modalGroupContainer.classList.remove("show"); // Quita la clase para fade-out
    setTimeout(() => {
      modalGroupContainer.classList.add("hidden"); // Oculta después de la animación
    }, 300); // Espera la duración de la transición (0.3s)
  },

  updateModalContent(header, body, footer, addClass, removeClass) {
    const modalContainer = document.getElementById("genericModal");
    const modalDiv = modalContainer.querySelector(".modal");

    // Remueve todas las clases de modales en tamaños

    modalDiv.classList.remove("modal-small", "modal-med", "modal-large");

    if (!addClass) {
      console.log("No se proporcionó una clase para agregar al modal.");
    } else {
      modalDiv.classList.add(addClass);
    }

    if (!removeClass) {
      console.log("No se proporcionó una clase para agregar al modal.");
    } else {
      modalDiv.classList.remove(removeClass);
    }

    if (header) {
      modalContainer.querySelector(".modal-header").innerHTML = header;
    }
    if (body) {
      modalContainer.querySelector(".modal-body").innerHTML = body;
    }
    if (footer) {
      modalContainer.querySelector(".modal-actions").innerHTML = footer;
    }
  },
};
