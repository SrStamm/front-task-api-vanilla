import "./ErrorContainer.css";

interface ErrorProps {
  advice: string;
  recommendation: string;
  isButton: boolean;
  isError: boolean;
}

function ErrorContainer({
  advice,
  recommendation,
  isButton,
  isError,
}: ErrorProps) {
  return (
    <div className={isError ? "error-container  error" : "error-container "}>
      <p className="principal-text">{advice}</p>
      <p className="secondary-text">{recommendation}</p>
      {isButton ? (
        <button onClick={() => window.location.reload()}>Reintentar</button>
      ) : (
        ""
      )}
    </div>
  );
}

export default ErrorContainer;
