import { useEffect, useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import "./KebabMenu.css";

interface KebabMenuItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface KebabMenuProps {
  items: KebabMenuItem[];
  ariaLabel?: string;
}

function KebabMenu({ items, ariaLabel = "Más acciones" }: KebabMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleItemClick = (item: KebabMenuItem) => {
    setOpen(false);
    item.onClick();
  };

  return (
    <div className="kebab-menu" ref={containerRef}>
      <button
        type="button"
        className="kebab-menu-trigger"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <FiMoreVertical aria-hidden="true" />
      </button>

      {open && (
        <ul className="kebab-menu-dropdown" role="menu">
          {items.map((item) => (
            <li
              key={item.label}
              className={`kebab-menu-item ${item.danger ? "danger" : ""}`}
              role="none"
            >
              <button
                type="button"
                role="menuitem"
                className="kebab-menu-item-btn"
                onClick={() => handleItemClick(item)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default KebabMenu;
