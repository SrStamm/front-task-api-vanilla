import {
  addUserToGroup,
  createGroup,
  deleteGroup,
  deleteUserFromGroup,
  editGroup,
  editRole,
  getGroups,
  getProjectsFromGroup,
  getUsersInGroup,
} from "../api.js";
import { newRenderGroupInModal, renderGroup } from "../render/groupRender.js";
import { updateModalContent } from "../utils/modal.js";
import {
  showSpinner,
  hideSpinner,
  showMessage,
  showTab,
  initializeTabListeners,
} from "../utils/utils.js";

export async function loadGroup() {
  try {
    // Llama a la funcion que obtendra los grupos
    const groups = await getGroups();

    showSpinner();

    const groupContainer = document.getElementById("groupList");
    groupContainer.innerHTML = "";

    hideSpinner();
    if (groups.length <= 0) {
      groupContainer.textContent = "No eres parte de ningun grupo.";
    } else {
      groups.forEach((group) => {
        let clone = renderGroup("groupTemplate", group);
        groupContainer.appendChild(clone);
      });
    }
  } catch (error) {
    hideSpinner();
    console.error("No se pudo cargar la lista de grupos: ", error);
  }
}

export async function createGroupEvent() {
  try {
    // Obtiene los datos
    const newGroupName = document.getElementById("newGroupName").value;
    const newGroupDescription = document.getElementById(
      "newGroupDescription",
    ).value;

    if (!newGroupName) {
      showMessage("El nombre del grupo es obligatorio", "error");
      return;
    }

    // Crea el grupo)

    let data = {
      name: newGroupName,
      description: newGroupDescription || null,
    };

    let response = await createGroup(data);

    if (response.detail !== "Se ha creado un nuevo grupo de forma exitosa") {
      return { success: false, detail: response.detail };
    } else {
      return { success: true, detail: response.detail };
    }
  } catch (error) {
    console.log("Error en crear un grupo: ", error);
  }
}

export async function editGroupAction(groupId, groupName, groupDescription) {
  try {
    let groupEditData = {
      name: groupName,
    };

    if (groupDescription || groupDescription !== null) {
      groupEditData.description = groupDescription;
    }

    let response = await editGroup(groupId, groupEditData);

    if (response.detail !== "Se ha actualizado la informacion del grupo") {
      throw new Error(response.detail);
    }

    showMessage("Grupo editado exitosamente", "success");

    // Obtener los datos del grupo desde el dataset del modal
    const modalContainer = document.getElementById("genericModal");
    const groupData = JSON.parse(modalContainer.dataset.groupData || "{}");

    // Actualizar la lista de usuarios en el modal de grupo
    const listUser = await getUsersInGroup(groupId);
    groupData.users = listUser;

    const listProject = await getProjectsFromGroup(groupId);
    groupData.projects = listProject;

    // Volver a renderizar la información del grupo
    const content = newRenderGroupInModal(groupData);
    updateModalContent(
      content.header,
      content.body,
      content.footer,
      content.addClass,
      content.removeClass,
    );

    initializeTabListeners();

    showTab("projects-tab");

    // Actualizar el dataset con los nuevos datos
    modalContainer.dataset.groupData = JSON.stringify(groupData);
  } catch (error) {
    showMessage("Error al editar el grupo: ", error.message);
  }
}

export async function deleteGroupAction(groupId) {
  try {
    let result = await deleteGroup(groupId);

    if (result.detail !== "Se ha eliminado el grupo") {
      return { success: false, detail: result.detail };
    } else {
      return { success: true, detail: result.detail };
    }
  } catch (error) {
    return { success: false, detail: error.message };
  }
}

export async function addUserToGroupAction(groupId, userId) {
  try {
    let response = await addUserToGroup(groupId, userId);

    if (response.detail !== "El usuario ha sido agregado al grupo") {
      throw new Error(response.detail);
    }

    showMessage("Usuario agregado exitosamente", "success");

    // Obtener los datos del grupo desde el dataset del modal
    const modalContainer = document.getElementById("genericModal");
    const groupData = JSON.parse(modalContainer.dataset.groupData || "{}");

    // Actualizar la lista de usuarios en el modal de grupo
    const listUser = await getUsersInGroup(groupId);
    groupData.users = listUser;

    const listProject = await getProjectsFromGroup(groupId);
    groupData.projects = listProject;

    // Volver a renderizar la información del grupo
    const content = newRenderGroupInModal(groupData);
    updateModalContent(
      content.header,
      content.body,
      content.footer,
      content.addClass,
      content.removeClass,
    );

    initializeTabListeners();

    showTab("members-tab");

    // Actualizar el dataset con los nuevos datos
    modalContainer.dataset.groupData = JSON.stringify(groupData);

    return { success: true };
  } catch (error) {
    showMessage("Error al añadir el usuario: ", "error");

    return { success: false };
  }
}

export async function deleteUserFromGroupAction(groupId, userId) {
  try {
    let response = await deleteUserFromGroup(groupId, userId);

    if (response.detail !== "El usuario ha sido eliminado del grupo") {
      throw new Error(response.detail);
    }

    showMessage("Usuario eliminado exitosamente", "success");

    // Obtener los datos del grupo desde el dataset del modal
    const modalContainer = document.getElementById("genericModal");
    const groupData = JSON.parse(modalContainer.dataset.groupData || "{}");

    // Actualizar la lista de usuarios en el modal de grupo
    const listUser = await getUsersInGroup(groupId);
    groupData.users = listUser;

    const listProject = await getProjectsFromGroup(groupId);
    groupData.projects = listProject;

    // Volver a renderizar la información del grupo
    const content = newRenderGroupInModal(groupData);
    updateModalContent(
      content.header,
      content.body,
      content.footer,
      content.addClass,
      content.removeClass,
    );

    initializeTabListeners();

    showTab("members-tab");

    // Actualizar el dataset con los nuevos datos
    modalContainer.dataset.groupData = JSON.stringify(groupData);

    return { success: true };
  } catch (error) {
    showMessage("Error al eliminar el usuario: ", error.message);
    return { success: false };
  }
}

export async function editRoleAction(groupId, userId, role) {
  try {
    if (!groupId || !userId || !role) {
      showMessage("Faltan datos para editar el rol", "error");
      return;
    }

    const response = await editRole(groupId, userId, role);

    if (
      response.detail !== "Se ha cambiado los permisos del usuario en el grupo"
    ) {
      throw new Error(response.detail);
    } else {
      // Obtener los datos del grupo desde el dataset del modal
      const modalContainer = document.getElementById("genericModal");
      const groupData = JSON.parse(modalContainer.dataset.groupData || "{}");

      // Actualizar la lista de usuarios en el modal de grupo
      const listUser = await getUsersInGroup(groupId);
      groupData.users = listUser;

      const listProject = await getProjectsFromGroup(groupId);
      groupData.projects = listProject;
      console.lign("Lista de proyectos: ", listProject);

      // Volver a renderizar la información del grupo
      const content = newRenderGroupInModal(groupData);
      updateModalContent(
        content.header,
        content.body,
        content.footer,
        content.addClass,
        content.removeClass,
      );

      initializeTabListeners();

      showTab("members-tab");
      // Actualizar el dataset con los nuevos datos
      modalContainer.dataset.groupData = JSON.stringify(groupData);
      return { success: true, detail: response.detail };
    }
  } catch (error) {
    return { sucess: false, detail: error.message };
  }
}
