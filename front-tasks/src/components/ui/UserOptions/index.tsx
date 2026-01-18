import Button from "../../common/Button";
import { AuthContext } from "../../../providers/AuthProvider";
import { useContext } from "react";

import "./UserOptions.css";

function UserOptions() {
  const authContext = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      authContext?.logout();
    } catch (error) {
      console.error("Error al intentar conectar con el servidor:", error);
    }
  };

  return (
    <>
      <ol className="user-options-container">
        <li>
          <Button
            className="btn-error btn-long"
            text="Cerrar sesion"
            onClick={handleLogout}
          />
        </li>
        <li>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </li>
      </ol>
    </>
  );
}

export default UserOptions;
