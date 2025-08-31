// Move showMessage, showSpinner, and hideSpinner to this file
// General purposes function that can be used anywhere in this app

export function showMessage(message, type = "error") {
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
}

// Obtener referencias a los elementos
const spinnerContainer = document.getElementById("spinner-container");
const spinnerElement = document.querySelector(".spinner"); // Para manejar la clase del spinner

// Función para mostrar el spinner
export function showSpinner() {
  spinnerContainer.style.display = "block"; // Muestra el contenedor
  spinnerElement.classList.remove("spinner-hidden"); // Asegura que el spinner no esté oculto por estilos internos
}

// Función para ocultar el spinner
export function hideSpinner() {
  spinnerContainer.style.display = "none"; // Oculta el contenedor
  spinnerElement.classList.add("spinner-hidden"); // Añade la clase de oculto para asegurar
}
