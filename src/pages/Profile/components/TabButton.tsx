import React from "react";

export type TabType = "info" | "username" | "certificates";

interface TabButtonProps {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function TabButton({
  id,
  label,
  icon,
  activeTab,
  setActiveTab,
}: TabButtonProps) {
  const active = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
        active ? "" : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
      style={
        active
          ? {
              borderColor: "var(--primary-color)",
              color: "var(--primary-color)",
            }
          : {}
      }
    >
      {icon}
      {label}
    </button>
  );
}
