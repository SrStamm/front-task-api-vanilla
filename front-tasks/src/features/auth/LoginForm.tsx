import { Link } from "react-router-dom";
import "./LoginForm.css";
import Button from "../../components/common/Button/index.tsx";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider.tsx";

const url = import.meta.env.VITE_URL;

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);

  const usernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await fetch(url + "login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (res.ok) {
        const data = await res.json();
        authContext?.login(data.access_token);
      } else {
        const dataError = await res.json();
        console.log("Error: ", dataError.detail);
      }
    } catch (error) {
      console.error("Error al intentar conectar con el servidor:", error);
    }
  };

  return (
    <>
      <h2>Ingresar</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="input-base"
            placeholder="Ingrese su nombre de usuario"
            required
            onChange={usernameChange}
            value={username}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Contraseña:</label>
          <input
            type="password"
            className="input-base"
            placeholder="Ingresa tu contraseña"
            required
            onChange={passwordChange}
            value={password}
          />
        </div>
        <div className="btn-container">
          <Button className="btn-primary" text="Ingresar" />
        </div>
        <p>
          No tienes una cuenta?
          <span className="register-link">
            <Link to="/register">Registrate aquí</Link>
          </span>
        </p>
      </form>
    </>
  );
}

export default LoginForm;
