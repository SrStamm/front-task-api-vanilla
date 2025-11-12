import { Link } from "react-router-dom";
import Button from "../../components/common/Button/index.tsx";

function RegisterForm() {
  return (
    <>
      <h2>Registro</h2>
      <form>
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="input-base"
            placeholder="Ingresa un nombre de usuario"
            required
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
          />
        </div>
        <div className="form-group">
          <label className="form-label">Contraseña:</label>
          <input
            type="password"
            className="input-base"
            placeholder="Ingresa una nueva contraseña"
          />
        </div>
        <div className="btn-container">
          <Button className="btn-primary" text=" Registrarse" />
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
