// Archivo como 'punto de entrada' despues del login
// Carga inicial de secciones y datos del panel
// Gestiona eventos del sidebar y los paneles

import {
  showSections,
  showModal,
  occultModal,
  showGroupDetailsModal,
  renderGroup,
  renderUsers,
} from "./dom.js";
import {
  addUserToGroup,
  createGroup,
  deleteGroup,
  getGroups,
  getUsers,
} from "./api.js";
import { logout } from "./auth.js";

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

export async function loadGroup() {
  try {
    // Llama a la funcion que obtendra los grupos
    const groups = await getGroups();

    // Si fue exitosa, los muestra
    // showGroups(groups);

    const groupContainer = document.getElementById("groupList");
    groupContainer.innerHTML = "";

    if (groups <= 0) {
      groupContainer.textContent = "No eres parte de ningun grupo.";
    } else {
      groups.forEach((group) => {
        let clone = renderGroup("groupTemplate", group);

        // Añadir evento de clic para mostrar/ocultar descripción
        let card = clone.querySelector(".card");
        card.addEventListener("click", function (event) {
          if (event.target.classList.contains("btn-manage")) {
            event.stopPropagation(); // Evita que se dispare la expansión
            // Función que muestra el modal
            showModal("modalInfoGroup");
            const modal = showGroupDetailsModal(group);

            // Se conecta con los botones
            const deleteBtn = modal.querySelector("#deleteGroup");
            const addUserBtn = modal.querySelector("#addUserGroup");

            // Agregar acciones a los botones
            deleteBtn.onclick = async () => {
              await deleteGroupAction(group.group_id);
              occultModal("modalInfoGroup");
              await loadGroup();
            };
            addUserBtn.onclick = async () => {
              showModal("allUsersList");

              // Accede al modal
              const modal = document.getElementById("allUsersList");
              const userList = modal.querySelector(".listUser");
              let allUsers = await getUsers();
              allUsers.forEach((user) => {
                let renderizedUser = renderUsers(user.user_id, user.username);

                // Configurar botones
                const addBtn = renderizedUser.querySelector("#addUserToGroup");
                addBtn.onclick = () => {
                  addUserToGroup(group.group_id, user.user_id);
                  occultModal("allUsersList");
                };

                // Agrega el usuario renderizado
                userList.appendChild(renderizedUser);
              });
            };
            return;
          }

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

        groupContainer.appendChild(clone);
      });
    }
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

async function deleteGroupAction(groupId) {
  try {
    let result = await deleteGroup(groupId);
    console.log("Grupo eliminado:", result);
  } catch (error) {
    console.log(`Error al eliminar el grupo ${groupId}: `, error);
  }
}

// Evento de logout
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {
  try {
    let response = await logout();

    if (response.detail == "Closed all sessions") {
      unauthorized();
    }
  } catch (error) {
    console.log("Error: ", error);
  }
});
