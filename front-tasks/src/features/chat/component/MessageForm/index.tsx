import Button from "../../../../components/common/Button";
import "./MessageForm.css";

function MessageForm() {
  return (
    <form className="form-message">
      <input type="text" name="newMessage" className="input-base" />
      <Button type="button" className="btn btn-sm" text="Enviar " />
    </form>
  );
}

export default MessageForm;
