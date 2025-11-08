import { Link } from "react-router-dom";
import "./LoginForm.css";

function LoginForm() {
  return (
    <>
      <h2>Ingresar</h2>
      <form>
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input
            type="text"
            id="usernameLogin"
            className="input-base"
            placeholder="Ingrese su nombre de usuario"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Contraseña:</label>
          <input
            type="password"
            id="passwordLogin"
            className="input-base"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>
        <div className="btn-container">
          <button className="btn btn-primary" id="loginBtn" data-action="login">
            Ingresar
          </button>
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
