import { Link } from "react-router-dom";
import "./SidebarItem.css";
import Skeleton from "../../common/Skeleton";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isSelected: boolean;
  onClick: () => void;
  loading?: boolean;
  showTooltip?: boolean;
}

function SidebarItem({
  icon,
  label,
  to,
  isSelected,
  onClick,
  loading,
  showTooltip = false,
}: SidebarItemProps) {
  if (loading) {
    return (
      <div className="sidebar_item">
        <span className="sidebar_item_icon">
          <Skeleton width="24px" height="24px" borderRadius="50%" />
        </span>
        <span className="sidebar_item_text">
          <Skeleton width="80px" height="1rem" />
        </span>
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`sidebar_item ${isSelected ? "active" : ""}`}
      onClick={onClick}
      title={showTooltip ? label : undefined}
      aria-current={isSelected ? "page" : undefined}
      aria-label={showTooltip ? label : undefined}
    >
      <span className="sidebar_item_icon">{icon}</span>
      <span className="sidebar_item_text">{label}</span>
    </Link>
  );
}

export default SidebarItem;
