import MessageForm from "../../../features/chat/component/MessageForm";
import MessageList from "../../../features/chat/component/MessageList";
import { useChat } from "../../../features/chat/hooks/useChat";
import { useGroupProject } from "../../../hooks/useGroupProject";
import ErrorContainer from "../../../components/common/ErrorContainer";
import { useContext } from "react";
import { SocketContext } from "../../../providers/socket-contexts";
import Button from "../../../components/common/Button";
import "./ChatPage.css";

function ChatPage() {
  const { messages, sendMessage, isConnected } = useChat();
  const { projectId } = useGroupProject();
  const socketCtx = useContext(SocketContext);
  const reconnect = socketCtx?.reconnect;
  const attempts = socketCtx?.attempts ?? 0;
  const maxAttempts = socketCtx?.maxAttempts ?? 5;

  if (!projectId) {
    return (
      <section className="dashboard-section">
        <article className="partSections chat-column">
          <header className="headerPartSection">
            <h3 className="dashboard-layout-h3">Chat</h3>
          </header>
          <ErrorContainer
            advice="No se ha seleccionado ningún proyecto"
            recommendation="Seleccione un proyecto en 'Proyecto' para acceder al chat"
            isButton={false}
            isError={false}
          />
        </article>
      </section>
    );
  }

  return (
    <section className="dashboard-section ">
      <article className="partSections chat-column">
        <header className="headerPartSection">
          <h3 className="dashboard-layout-h3">Chat</h3>
          {!isConnected && (
            <div className="chat-connection-status" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ color: "var(--error)", fontSize: "0.875rem" }}>
                Desconectado{attempts >= maxAttempts ? " - Sin conexión" : ` (reintentando ${attempts}/${maxAttempts})`}
              </span>
              {attempts >= maxAttempts && reconnect && (
                <Button
                  type="button"
                  className="btn-secondary btn-sm"
                  text="Reconectar"
                  onClick={reconnect}
                />
              )}
            </div>
          )}
        </header>
        <div className="message-container">
          <MessageList messages={messages} />
          <MessageForm onSend={sendMessage} isConnected={isConnected} />
        </div>
      </article>
    </section>
  );
}

export default ChatPage;
