import MessageForm from "../../../features/chat/component/MessageForm";
import MessageList from "../../../features/chat/component/MessageList";
import { useChat } from "../../../features/chat/hooks/useChat";
import { useGroupProject } from "../../../hooks/useGroupProject";
import ErrorContainer from "../../../components/common/ErrorContainer";
import "./ChatPage.css";

function ChatPage() {
  const { messages, sendMessage, isConnected } = useChat();
  const { projectId } = useGroupProject();

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
