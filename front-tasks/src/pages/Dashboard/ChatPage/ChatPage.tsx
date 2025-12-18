import MessageForm from "../../../features/chat/component/MessageForm";
import MessageList from "../../../features/chat/component/MessageList";
import { useChat } from "../../../features/chat/hooks/useChat";

function ChatPage() {
  const { messages, sendMessage, isConnected } = useChat();

  return (
    <section className="dashboard-section ">
      <article className="partSections">
        <header className="headerPartSection">
          <h3 className="dashboard-layout-h3">Chat</h3>
        </header>
        <div className="message-container" data-project-id="0">
          <MessageList messages={messages} />
          <MessageForm />
        </div>
      </article>
    </section>
  );
}

export default ChatPage;
