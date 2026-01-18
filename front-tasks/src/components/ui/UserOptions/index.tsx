import Button from "../../common/Button";
import { AuthContext } from "../../../providers/AuthProvider";
import { useContext, useEffect, useState } from "react";

import "./UserOptions.css";

function UserOptions() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const authContext = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      authContext?.logout();
    } catch (error) {
      console.error("Error al intentar conectar con el servidor:", error);
    }
  };

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleChangeTheme = () => {
    if (isDark) {
      setIsDark(false);
      localStorage.setItem("theme", "light");
    } else {
      setIsDark(true);
      localStorage.setItem("theme", "dark");
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
            <input
              type="checkbox"
              aria-label="cambiar tema"
              checked={isDark}
              onChange={handleChangeTheme}
            />
            <span className="slider"></span>
          </label>
        </li>
      </ol>
    </>
  );
}

export default UserOptions;
