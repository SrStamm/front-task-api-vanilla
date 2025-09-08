// Renderiza una lista de usuarios
export function renderUsers(target, username, groupId, userId) {
  // Accede al template de users
  const userTemplate = document.getElementById("userList");
  const clonTemplate = userTemplate.content.cloneNode(true);

  // Obtiene cada parte del template
  const userNameTemplate = clonTemplate.querySelector(".userName");
  const addBtn = clonTemplate.getElementById("addUser");

  // Modifica cada parte
  userNameTemplate.textContent = username;

  // Setea los datos
  addBtn.dataset.userId = userId;
  addBtn.dataset.groupId = groupId;
  addBtn.dataset.target = target;

  return clonTemplate;
}

export function renderUsersFromGroup(
  target,
  username,
  groupId,
  projectId,
  userId,
) {
  // Accede al template de users
  const userTemplate = document.getElementById("userList");
  const clonTemplate = userTemplate.content.cloneNode(true);

  // Obtiene cada parte del template
  const userNameTemplate = clonTemplate.querySelector(".userName");
  const addBtn = clonTemplate.getElementById("addUser");

  // Modifica cada parte
  userNameTemplate.textContent = username;

  // Setea los datos
  addBtn.dataset.userId = userId;
  addBtn.dataset.groupId = groupId;
  addBtn.dataset.projectId = projectId;
  addBtn.dataset.target = target;

  return clonTemplate;
}

export function newRenderUsers(username, groupId, userId) {
  headerContent = `
      <h3>Usuarios</h3>
    `;

  bodyContent = `
      <ul id="listUser">
        <div class="body-template">
          <p>${username}</p>
        </div>
        <div class="actionTemplate">
          <button
            type="button"
            class="btn btn-sm"
            id="addUserToGroup"
            data-group-id="${groupId}"
            data-user-id="${userId}"
          >
            Agregar
          </button>
        </div>
      </ul>
    `;

  return { header: headerContent, body: bodyContent };
}

export function renderUserInProject(
  groupId,
  projectId,
  userId,
  username,
  permission,
) {
  const contentHtml = `
  <li class="user-item">
    <div class="user-info">
      <div class="user-details">
        <p class="user-name">${username}</p>
        <p class="currentPermission user-role"> ${permission}</p>
      </div>
    <div class="user-actions">
      <select class="permission-select" data-group-id="${groupId}" data-project-id="${projectId}"
          data-user-id="${userId}" data-permission="${permission}"  style="display: none" disabled>
        <option value="read" ${permission === "read" ? "selected" : ""}>Lectura</option>
        <option value="write" ${permission === "write" ? "selected" : ""}>Escritura</option>
        <option value="admin" ${permission === "admin" ? "selected" : ""}>Administrador</option>
      </select>
      <button type="button" class="btn btn-vsm btn-outline-error manage-btn" id="deleteUserProject"
        data-group-id="${groupId}" data-project-id="${projectId}" data-user-id="${userId}" > Eliminar </button>
      <button type="button" class="btn btn-vsm btn-secondary" id="editPermissionProject"
        data-group-id="${groupId}" data-project-id="${projectId}" data-user-id="${userId}" > Editar </button>
    </div>
  </li>
`;

  return contentHtml;
}
