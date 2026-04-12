import "./TypingIndicator.css";

interface TypingIndicatorProps {
  username?: string;
}

function TypingIndicator({ username }: TypingIndicatorProps) {
  return (
    <div className="typing-indicator">
      <span className="typing-dots">
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
      </span>
      {username && (
        <span className="typing-text">{username} está escribiendo...</span>
      )}
    </div>
  );
}

export default TypingIndicator;