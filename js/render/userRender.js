// Renderiza una lista de usuarios
export function renderUsers(username, groupId, userId) {
  // Accede al template de users
  const userTemplate = document.getElementById("userList");
  const clonTemplate = userTemplate.content.cloneNode(true);

  // Obtiene cada parte del template
  const userNameTemplate = clonTemplate.querySelector(".userName");
  const addBtn = clonTemplate.getElementById("addUserToGroup");

  // Modifica cada parte
  userNameTemplate.textContent = username;

  // Setea los datos
  addBtn.dataset.userId = userId;
  addBtn.dataset.groupId = groupId;

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
