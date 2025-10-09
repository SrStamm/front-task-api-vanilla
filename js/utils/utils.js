// Move showMessage, showSpinner, and hideSpinner to this file
// General purposes function that can be used anywhere in this app

// Obtener referencias a los elementos
const spinnerContainer = document.getElementById("spinner-container");
const spinnerElement = document.querySelector(".spinner");

export const utils = {
  showMessage(message, type = "error") {
    // Vacia por si habia un mensaje antes
    messageContainer.style.display = "none";
    messageContainer.textContent = "";

    // Actualiza el mensaje y lo muestra
    messageContainer.textContent = message;
    messageContainer.className = `alert alert-${type}`;
    messageContainer.style.display = "block";

    setTimeout(() => {
      messageContainer.style.display = "none";
      messageContainer.textContent = "";
    }, 4000);
  },

  // Función para mostrar el spinner
  showSpinner() {
    spinnerContainer.style.display = "block"; // Muestra el contenedor
    spinnerElement.classList.remove("spinner-hidden"); // Asegura que el spinner no esté oculto por estilos internos
  },

  // Función para ocultar el spinner
  hideSpinner() {
    spinnerContainer.style.display = "none"; // Oculta el contenedor
    spinnerElement.classList.add("spinner-hidden"); // Añade la clase de oculto para asegurar
  },

  showTab(tabId) {
    // Limpia la pestaña
    document.querySelectorAll(".tab-content").forEach((section) => {
      section.classList.remove("active");
    });

    const tab = document.getElementById(tabId);
    tab.classList.add("active");

    // Limpia el boton
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Activa el botón
    const activeBtn = document.querySelector(
      `.tab-btn[data-tab="${tabId.replace("-tab", "")}"]`,
    );
    if (activeBtn) {
      activeBtn.classList.add("active");
    } else {
      console.warn("No se encontró el botón para la pestaña:", tabId);
    }
  },

  initializeTabListeners() {
    const tabsContainer = document.querySelector(".modal-tabs");
    if (tabsContainer) {
      tabsContainer.addEventListener("click", (event) => {
        const target = event.target;

        // Maneja el cambio de pestañas
        if (target.classList.contains("tab-btn")) {
          // Muestra la sección correspondiente
          utils.showTab(target.dataset.tab + "-tab");
        }
      });
    } else {
      console.warn("No se encontró el contenedor de pestañas.");
    }
  },

  setButtonState(button, isLoading, text = null) {
    button.disabled = isLoading;

    if (text !== null) {
      button.textContent = text;
    }

    button.dataset.loading = isLoading;
  },

  getCurrentUserId() {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      return user?.user_id;
    } catch (e) {
      console.error("Error parsing currentUser", e);
      return null;
    }
  },
};
