import type React from "react";
import "./ListCard.css";

interface ListCardProps {
  children: React.ReactNode;
}

function ListCard({ children }: ListCardProps) {
  return <div className="card-list">{children}</div>;
}

export default ListCard;
