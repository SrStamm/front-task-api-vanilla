import type { ReactNode } from "react";
import { useState } from "react";
import Button from "../Button";
import "./Card.css";

interface CardProps {
  title?: string;
  details?: React.ReactNode;
  description?: string;
  action?: {
    text: string;
    className?: string;
    onClick?: () => void;
  };
  children?: ReactNode;
  hideTemplate?: boolean;
  className?: string;
}

function Card({
  title,
  description,
  details,
  action,
  children,
  hideTemplate = true,
  className = "",
}: CardProps) {
  const [expanded, setExpanded] = useState(false);

  const toogleExpand = () => setExpanded((prev) => !prev);

  return (
    <div
      className={`card ${expanded ? "expanded" : ""} ${className}`}
      onClick={toogleExpand}
    >
      {title && <h3>{title}</h3>}
      {details && <div className="card-details">{details}</div>}

      {hideTemplate ? (
        <div className="template-hide">
          {description && <p className="description"> {description}</p>}
          {action && (
            <Button
              className={action.className || ""}
              text={action.text}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
            />
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export default Card;
