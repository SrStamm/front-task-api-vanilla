function MessageForm() {
  return (
    <form className="form-message">
      <input type="text" name="newMessage" className="input-base" />
      <button type="button" className="btn btn-sm">
        Enviar
      </button>
    </form>
  );
}

export default MessageForm;
