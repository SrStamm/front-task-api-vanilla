import "./ErrorContainer.css";
import Button from "../Button";

interface ErrorProps {
  advice: string;
  recommendation: string;
  isButton: boolean;
  isError: boolean;
  onRetry?: () => void;
}

function ErrorContainer({
  advice,
  recommendation,
  isButton,
  isError,
  onRetry,
}: ErrorProps) {
  return (
    <div className={isError ? "error-container  is-error" : "error-container "}>
      <p className="principal-text">{advice}</p>
      <p className="secondary-text">{recommendation}</p>
      {isButton ? (
        <Button
          className="btn-primary btn-sm"
          text="Reintentar"
          onClick={() => {
            if (onRetry) {
              onRetry();
            } else {
              window.location.reload();
            }
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default ErrorContainer;
