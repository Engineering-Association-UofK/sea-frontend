import React, { useState } from "react";
import { User, Award, Bell, Ticket, Loader2, ChevronDown } from "lucide-react";
import { Alert } from "react-bootstrap";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useLanguage } from "@/context/LanguageContext";

import { ProfileHeader } from "./components/ProfileHeader";
import { TabButton, TabType } from "./components/TabButton";
import { PersonalInfoPanel } from "./components/PersonalInfoPanel";
import { CertificatesPanel } from "./components/CertificatesPanel";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { ElectionTicketPanel } from "./components/ElectionTicketPanel";

export function ProfilePage() {
  const { translations } = useLanguage();
  const t = translations.profile;

  const [activeTab, setActiveTab] = useState<TabType>("info");
  const { data: profile, isLoading: isProfileLoading } = useProfile();

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "info", label: t.tabs.info, icon: <User className="h-4 w-4" /> },
    { id: "certificates", label: t.tabs.certificates, icon: <Award className="h-4 w-4" /> },
    { id: "notifications", label: t.tabs.notifications, icon: <Bell className="h-4 w-4" /> },
    { id: "election", label: t.tabs.election, icon: <Ticket className="h-4 w-4" /> },
  ];

  const activeTabObj = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  if (isProfileLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Alert>{t.failedToLoad}</Alert>
      </div>
    );
  }

  return (
    /* Full Viewport Minimum Height Wrapper */
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col space-y-6 p-6">
      {/* Profile Header Summary */}
      <ProfileHeader profile={profile} />

      {/* Styled Mobile Selector Box (Screens < sm) */}
      <div className="sm:hidden">
        <div className="relative flex items-center justify-between rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 active:bg-gray-50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              {activeTabObj.icon}
            </div>
            <span className="truncate text-sm font-semibold text-gray-900">
              {activeTabObj.label}
            </span>
          </div>

          <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />

          <select
            id="profile-tabs-mobile"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as TabType)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Select section"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Horizontal Tabs (Screens >= sm) */}
      <div className="hidden border-b border-gray-200 sm:flex">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            id={tab.id}
            label={tab.label}
            icon={tab.icon}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ))}
      </div>

      {/* Tab Panels with Smooth Height Relaxation & Full-Height Flex Fill */}
      <div className="min-h-[700px] flex-1 pt-2 transition-all duration-500 ease-in-out">
        {activeTab === "info" && <PersonalInfoPanel profile={profile} />}
        {activeTab === "certificates" && <CertificatesPanel />}
        {activeTab === "notifications" && <NotificationsPanel />}
        {activeTab === "election" && <ElectionTicketPanel />}
      </div>
    </div>
  );
}