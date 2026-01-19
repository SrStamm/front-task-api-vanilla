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
  expand?: boolean;
}

function Card({
  title,
  description,
  details,
  action,
  children,
  hideTemplate = true,
  className = "",
  expand = true,
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

  const classElement = expand
    ? `card ${expanded ? "expanded" : ""} ${className}`
    : `card ${className}`;

  return (
    <div
      className={classElement}
      onClick={hideTemplate ? toogleExpand : undefined}
      ref={cardRef}
    >
      <h3>{title}</h3>
      <div className="card-details">{details}</div>

      {hideTemplate ? (
        <div className="template-hide">
          <p className="description"> {description}</p>
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
