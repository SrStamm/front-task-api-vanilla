import MessageForm from "../../../features/chat/component/MessageForm";
import MessageList from "../../../features/chat/component/MessageList";

const fakeChat = [
  {
    chat_id: 1,
    project_id: 1,
    user_id: 1,
    message: "test",
  },
  {
    chat_id: 1,
    project_id: 1,
    user_id: 1,
    message: "test 2",
  },
];

function ChatPage() {
  return (
    <section className="dashboard-section ">
      <article className="partSections">
        <header className="headerPartSection">
          <h3 className="dashboard-layout-h3">Chat</h3>
        </header>
        <div className="message-container" data-project-id="0">
          <ol className="list-message"></ol>
          <MessageList messages={fakeChat} />
          <MessageForm />
        </div>
      </article>
    </section>
  );
}

export default ChatPage;
