import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Languages,
  Menu,
  Sparkles,
  Sliders,
  CheckCheck,
  AlertTriangle,
  Wrench,
  FileCheck,
  Zap,
  Shield,
  Clock,
  Key,
} from "lucide-react";
import {
  Language,
  SmartNotification,
  PresetTemplate,
  UserPortalMode,
  ClientTenantConfig,
} from "../types";
import { translations } from "../i18n/translations";
import { BrandLogo } from "./BrandLogo";

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTemplate: PresetTemplate;
  notifications: SmartNotification[];
  onNotificationClick: (notif: SmartNotification) => void;
  onMarkAllRead: () => void;
  onOpenMobileMenu: () => void;
  onNavigateTab: (tabId: string) => void;
  supervisorName: string;
  portalMode?: UserPortalMode;
  onTogglePortalMode?: (mode: UserPortalMode) => void;
  activeTenant?: ClientTenantConfig;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeTemplate,
  notifications,
  onNotificationClick,
  onMarkAllRead,
  onOpenMobileMenu,
  onNavigateTab,
  supervisorName,
  portalMode = "developer",
  onTogglePortalMode,
  activeTenant,
}) => {
  const t = translations[currentLang];
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languagesList: { code: Language; name: string; flag: string; nativeName: string }[] = [
    { code: "ar", name: "العربية (Arabic)", flag: "🇩🇿", nativeName: "العربية" },
    { code: "en", name: "English (US)", flag: "🇬🇧", nativeName: "English" },
    { code: "fr", name: "Français (French)", flag: "🇫🇷", nativeName: "Français" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-3 max-w-[1500px] mx-auto">
        {/* Left / Start: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            aria-label="Open Navigation Menu"
          >
            <Menu size={20} />
          </button>

          <div className="cursor-pointer" onClick={() => onNavigateTab("dashboard")}>
            <BrandLogo
              size="sm"
              showTagline={false}
              theme="dark"
              customCompanyName={activeTenant?.companyName}
            />
          </div>

          {/* Master Developer vs Client Portal Toggle Badge */}
          {onTogglePortalMode && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => {
                  onTogglePortalMode("developer");
                  onNavigateTab("developer_portal");
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  portalMode === "developer"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Shield size={12} className="text-amber-300" />
                <span>{currentLang === "ar" ? "المطور" : "Dev Root"}</span>
              </button>
              <button
                onClick={() => onTogglePortalMode("client")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  portalMode === "client"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>{currentLang === "ar" ? "الزبون" : "Client"}</span>
              </button>
            </div>
          )}

          {/* 6-Month Free Trial / License Badge */}
          {activeTenant && (
            <div
              onClick={() => onNavigateTab(portalMode === "developer" ? "developer_portal" : "scope_config")}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 hover:border-amber-500/50 text-xs font-semibold text-slate-300 hover:text-amber-300 transition cursor-pointer"
            >
              {activeTenant.licenseStatus === "trial_active" ? (
                <>
                  <Clock size={12} className="text-amber-400 animate-spin-slow" />
                  <span className="text-amber-300 font-bold font-mono text-[11px]">
                    {currentLang === "ar"
                      ? `تجربة 6 أشهر: باقي ${activeTenant.trialDaysRemaining} يوماً`
                      : `Trial: ${activeTenant.trialDaysRemaining}d remaining`}
                  </span>
                </>
              ) : activeTenant.licenseStatus === "license_activated" ? (
                <>
                  <CheckCheck size={12} className="text-emerald-400" />
                  <span className="text-emerald-300 font-bold font-mono text-[11px]">
                    {currentLang === "ar" ? "ترخيص مفعل دائم" : "Activated"}
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle size={12} className="text-red-400" />
                  <span className="text-red-300 font-bold font-mono text-[11px]">
                    {currentLang === "ar" ? "التجربة منتهية" : "Trial Expired"}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right / End: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Quick Status Pill */}
          <button
            onClick={() => onNavigateTab("ai")}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-950/60 to-indigo-950/60 border border-violet-700/40 text-violet-200 hover:border-violet-500 text-xs font-bold transition shadow-sm"
          >
            <Sparkles size={14} className="text-amber-300 animate-pulse" />
            <span className="hidden xl:inline">{t.aiOnline}</span>
            <span className="xl:hidden">AI</span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition"
              aria-label={t.switchLanguage}
            >
              <Languages size={15} className="text-amber-400" />
              <span className="uppercase">{currentLang}</span>
              <span className="text-[10px] text-slate-400">▼</span>
            </button>

            {showLangMenu && (
              <div className="absolute top-full mt-2 ltr:right-0 rtl:left-0 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 border-b border-slate-800/80 mb-1">
                  {t.switchLanguage}
                </div>
                {languagesList.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      currentLang === lang.code
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                    {currentLang === lang.code && <span className="text-amber-400 font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
              aria-label={t.notifications}
            >
              <Bell size={17} className={unreadCount > 0 ? "text-amber-400" : "text-slate-400"} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center border-2 border-slate-900 shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute top-full mt-2 ltr:right-0 rtl:left-0 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 mb-2">
                  <div className="flex items-center gap-2">
                    <Zap size={15} className="text-amber-400" />
                    <span className="font-extrabold text-sm text-white">{t.notifications}</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                        {unreadCount} {t.unreadAlerts}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllRead}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                    >
                      <CheckCheck size={13} /> {t.markAllRead}
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto space-y-1.5 px-1">
                  {notifications.slice(0, 5).map((notif) => {
                    const iconMap = {
                      maintenance: <Wrench size={15} className="text-amber-400 shrink-0" />,
                      license: <FileCheck size={15} className="text-rose-400 shrink-0" />,
                      fuel: <AlertTriangle size={15} className="text-blue-400 shrink-0" />,
                      trip: <Zap size={15} className="text-emerald-400 shrink-0" />,
                      system: <Sparkles size={15} className="text-violet-400 shrink-0" />,
                      vip: <Sparkles size={15} className="text-amber-300 shrink-0" />,
                    }[notif.type] || <Bell size={15} className="text-slate-400" />;

                    const urgencyBg = {
                      critical: "border-rose-500/40 bg-rose-950/20",
                      warning: "border-amber-500/40 bg-amber-950/20",
                      info: "border-blue-500/30 bg-blue-950/20",
                      success: "border-emerald-500/30 bg-emerald-950/20",
                    }[notif.urgency];

                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          onNotificationClick(notif);
                          setShowNotifMenu(false);
                        }}
                        className={`p-2.5 rounded-xl border transition cursor-pointer hover:bg-slate-800/80 ${
                          !notif.read ? urgencyBg : "border-slate-800 bg-slate-900/50 opacity-70"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 rounded-lg bg-slate-800">{iconMap}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white leading-tight truncate">
                              {notif.title[currentLang]}
                            </p>
                            <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                              {notif.message[currentLang]}
                            </p>
                            <span className="text-[10px] text-slate-500 mt-1 block">
                              {notif.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {notifications.length === 0 && (
                    <p className="text-center py-6 text-xs text-slate-400">{t.noUnreadAlerts}</p>
                  )}
                </div>

                <div className="p-2 border-t border-slate-800 mt-2 text-center">
                  <button
                    onClick={() => {
                      onNavigateTab("notifications");
                      setShowNotifMenu(false);
                    }}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300"
                  >
                    {t.notifCenterTitle} →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Supervisor Avatar Badge */}
          <div
            onClick={() => onNavigateTab("settings")}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/60 hover:border-slate-600 transition cursor-pointer"
            title={supervisorName}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center shadow">
              {supervisorName.trim().charAt(0) || "M"}
            </div>
            <div className="hidden lg:block text-start leading-none">
              <p className="text-xs font-bold text-white truncate max-w-[110px]">{supervisorName}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{t.supervisorTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
