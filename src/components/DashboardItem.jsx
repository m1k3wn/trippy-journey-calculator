import React from "react";
import "../styles/DashboardItem.css";

export default function DashboardItem({ label, value, highlight }) {
  return (
    <div className={`dash-item ${highlight ? "highlight-item" : ""}`}>
      <span className="dash-item-label">{label}</span>
      <span className="dash-item-value">{value}</span>
    </div>
  );
}
