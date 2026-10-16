import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button/index.tsx";
import { useEffect, useState } from "react";
import type { CreateUser } from "../../types/User.ts";
import { getApiErrorMessage } from "../../utils/errors.ts";

const url = import.meta.env.VITE_URL;

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  useEffect(() => {
    setError(null);
    setIsPending(false);
  }, []);

  const navigate = useNavigate();

  const usernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const newUserData: CreateUser = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const res = await fetch(url + "user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorData}`);
      }

      navigate("/login");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <div className="form-group">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="input-base"
            placeholder="Ingresa un nombre de usuario"
            required
            value={username}
            onChange={usernameChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="input-base"
            placeholder="Ingrese su email"
            required
            minLength={6}
            value={email}
            onChange={emailChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Contraseña:</label>
          <input
            type="password"
            className="input-base"
            placeholder="Ingresa una contraseña"
            required
            minLength={6}
            value={password}
            onChange={passwordChange}
          />
        </div>
        <div className="btn-container">
          <Button
            className="btn-primary"
            text=" Registrarse"
            type="submit"
            disabled={isPending}
          />
        </div>
      </form>
      <p>
        Ya tienes una cuenta?
        <Link to={"/login"}> Ingresa aquí</Link>
      </p>
    </>
  );
}

export default RegisterForm;
