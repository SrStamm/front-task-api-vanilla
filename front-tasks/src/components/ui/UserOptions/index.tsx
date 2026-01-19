import Button from "../../common/Button";
import { AuthContext } from "../../../providers/AuthProvider";
import { useContext, useEffect, useRef, useState } from "react";

import "./UserOptions.css";

interface UserOptionsProps {
  close: (arg: boolean) => void;
}

function UserOptions({ close }: UserOptionsProps) {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const authContext = useContext(AuthContext);
  const selectorRef = useRef<HTMLOListElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      selectorRef.current &&
      !selectorRef.current.contains(e.target as Node)
    ) {
      close(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectorRef]);

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
      <ol className="user-options-container" ref={selectorRef}>
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
