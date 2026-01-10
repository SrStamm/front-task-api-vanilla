import { Link } from "react-router-dom";
import "./SidebarItem.css";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isSelected: boolean;
  onClick: () => void;
}

function SidebarItem({
  icon,
  label,
  to,
  isSelected,
  onClick,
}: SidebarItemProps) {
  return (
    <div
      className={`sidebar_element ${isSelected ? "active" : ""}`}
      onClick={onClick}
    >
      <Link to={to} className="sidebar_link">
        <span className="sidebar_item_icon">{icon}</span>
        <span className="sidebar_item_text">{label}</span>
      </Link>
    </div>
  );
}

export default SidebarItem;
