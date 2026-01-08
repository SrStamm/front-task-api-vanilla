import Button from "../../common/Button";
import "./UserOptions.css";

function UserOptions() {
  return (
    <>
      <ol className="user-options-container">
        <li>
          <Button className="btn-error btn-long" text="Cerrar sesion" />
        </li>
      </ol>
    </>
  );
}

export default UserOptions;
