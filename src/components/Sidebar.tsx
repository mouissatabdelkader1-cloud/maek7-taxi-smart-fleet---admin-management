import React from "react";
import {
  LayoutDashboard,
  Car,
  Users,
  Route,
  Wallet,
  Bot,
  Bell,
  Sliders,
  MessageCircle,
  Settings,
  Sparkles,
  ShieldCheck,
  Radio,
  TrendingUp,
  Wrench,
  Trophy,
  Video,
  Key,
  Layers,
  Smartphone,
} from "lucide-react";
import { Language, FeatureModules, PresetTemplate, UserPortalMode } from "../types";
import { translations } from "../i18n/translations";
import { BrandLogo } from "./BrandLogo";

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  currentLang: Language;
  featureFlags: FeatureModules;
  activeTemplate: PresetTemplate;
  portalMode?: UserPortalMode;
  counts: {
    vehicles: number;
    drivers: number;
    ongoingTrips: number;
    unreadNotifs: number;
  };
  institutionName: string;
  supervisorName: string;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentLang,
  featureFlags,
  activeTemplate,
  portalMode = "developer",
  counts,
  institutionName,
  supervisorName,
  onCloseMobile,
}) => {
  const t = translations[currentLang];

  const navItems = [
    {
      id: "dashboard",
      label: t.navDashboard,
      icon: LayoutDashboard,
      enabled: true,
      badge: null,
    },
    {
      id: "radar",
      label: t.navRadar,
      icon: Radio,
      enabled: featureFlags.liveRadar,
      badge: "Live",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold",
    },
    {
      id: "dashcam",
      label: t.navDashcam,
      icon: Video,
      enabled: featureFlags.dashcamSurveillance,
      badge: "REC AI",
      badgeColor: "bg-red-500/20 text-red-300 border-red-500/30 animate-pulse font-bold",
    },
    {
      id: "tlc_analytics",
      label: t.navTlcAnalytics,
      icon: TrendingUp,
      enabled: featureFlags.analyticsCharts,
      badge: "TLC",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      id: "vehicles",
      label: t.navVehicles,
      icon: Car,
      enabled: true,
      badge: counts.vehicles,
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    {
      id: "drivers",
      label: t.navDrivers,
      icon: Users,
      enabled: true,
      badge: counts.drivers,
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      id: "driver_kpi",
      label: t.navDriverKpi,
      icon: Trophy,
      enabled: featureFlags.driverKpi,
      badge: "Top",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    },
    {
      id: "trips",
      label: t.navTrips,
      icon: Route,
      enabled: true,
      badge: counts.ongoingTrips > 0 ? `${counts.ongoingTrips} ${t.liveStatus}` : null,
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse",
    },
    {
      id: "maintenance",
      label: t.navMaintenance,
      icon: Wrench,
      enabled: featureFlags.fleetMaintenance,
      badge: null,
    },
    {
      id: "finance",
      label: t.navFinance,
      icon: Wallet,
      enabled: featureFlags.financialLedger,
      badge: null,
    },
    {
      id: "ai",
      label: t.navAIAgent,
      icon: Bot,
      enabled: featureFlags.aiAgent,
      badge: "AI",
      badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
      highlight: true,
    },
    {
      id: "notifications",
      label: t.navNotifications,
      icon: Bell,
      enabled: featureFlags.smartNotifications,
      badge: counts.unreadNotifs > 0 ? counts.unreadNotifs : null,
      badgeColor: "bg-rose-500 text-white font-bold",
    },
    {
      id: "scope_config",
      label: t.navScopeConfig,
      icon: Layers,
      enabled: true,
      badge: "Pricing",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    },
    {
      id: "templates",
      label: t.navTemplates,
      icon: Sliders,
      enabled: true,
      badge: activeTemplate.id === "enterprise_ai" ? "Enterprise" : null,
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      id: "app_generator",
      label: t.navAppGenerator || "توليد التطبيق الشخصي",
      icon: Smartphone,
      enabled: true,
      badge: "PWA/APK",
      badgeColor: "bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-300 border-amber-500/40 font-bold",
      highlight: true,
    },
    {
      id: "developer_portal",
      label: t.navDevPortal,
      icon: Key,
      enabled: portalMode === "developer",
      badge: "ROOT",
      badgeColor: "bg-indigo-600 text-white font-black border-indigo-400 animate-pulse",
    },
    {
      id: "whatsapp",
      label: t.navWhatsApp,
      icon: MessageCircle,
      enabled: featureFlags.whatsAppGateway,
      badge: null,
    },
    {
      id: "settings",
      label: t.navSettings,
      icon: Settings,
      enabled: true,
      badge: null,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r rtl:border-r-0 rtl:border-l border-slate-800 text-slate-100 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <BrandLogo
          size="md"
          showTagline={true}
          taglineText={supervisorName ? `إشراف: ${supervisorName}` : institutionName}
          customCompanyName={institutionName}
          theme="dark"
        />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
        {navItems
          .filter((item) => item.enabled)
          .map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile?.();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition group ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 font-black"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-xl transition ${
                      isActive
                        ? "bg-slate-950 text-amber-400"
                        : item.highlight
                        ? "bg-violet-950/60 text-violet-300 group-hover:bg-violet-900"
                        : "bg-slate-800 text-slate-400 group-hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      isActive ? "bg-slate-950 text-amber-300 border-slate-900" : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
      </nav>

      {/* AI Copilot Quick Launcher Card */}
      {featureFlags.aiAgent && (
        <div className="p-3">
          <div
            onClick={() => {
              onSelectTab("ai");
              onCloseMobile?.();
            }}
            className="p-3 rounded-2xl bg-gradient-to-br from-violet-950/70 via-indigo-950/50 to-slate-900 border border-violet-600/30 hover:border-violet-500 cursor-pointer transition shadow-md group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1 rounded-lg bg-violet-500/20 text-amber-300">
                <Sparkles size={14} className="animate-spin-slow" />
              </div>
              <span className="text-xs font-black text-white">{t.aiTitle.split(" ")[0]} {t.aiTitle.split(" ")[1]}</span>
            </div>
            <p className="text-[11px] text-violet-200/80 line-clamp-2 leading-relaxed">
              {t.aiSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* Supervisor Footer Profile */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-sm flex items-center justify-center shadow-sm shrink-0">
            {supervisorName.trim().charAt(0) || "M"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold text-white truncate">{supervisorName}</p>
              <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
            </div>
            <p className="text-[10px] text-slate-400 truncate">{institutionName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
