import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
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
  const cardRef = useRef<HTMLDivElement>(null);

  const toogleExpand = () => setExpanded((prev) => !prev);

  const handleClickOutside = (e: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      setExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cardRef]);

  return (
    <div
      className={`card ${expanded ? "expanded" : ""} ${className}`}
      onClick={hideTemplate ? toogleExpand : undefined}
      ref={cardRef}
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
              onClick={() => {
                action.onClick?.();
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
