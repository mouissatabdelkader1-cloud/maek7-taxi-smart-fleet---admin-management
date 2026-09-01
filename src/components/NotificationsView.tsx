import React, { useState, useMemo } from "react";
import {
  Bell,
  AlertTriangle,
  Wrench,
  FileCheck,
  Zap,
  Sparkles,
  CheckCheck,
  Trash2,
  Send,
  Plus,
  Clock,
  MessageCircle,
} from "lucide-react";
import { Language, SmartNotification, NotificationType } from "../types";
import { translations } from "../i18n/translations";

interface NotificationsViewProps {
  currentLang: Language;
  notifications: SmartNotification[];
  institutionName: string;
  onMarkAllRead: () => void;
  onClearRead: () => void;
  onOpenBroadcastModal: () => void;
  onNotificationClick: (notif: SmartNotification) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  currentLang,
  notifications,
  institutionName,
  onMarkAllRead,
  onClearRead,
  onOpenBroadcastModal,
  onNotificationClick,
}) => {
  const t = translations[currentLang];
  const [filterType, setFilterType] = useState<string>("all");

  const filteredNotifs = useMemo(() => {
    if (filterType === "all") return notifications;
    if (filterType === "critical") return notifications.filter((n) => n.urgency === "critical");
    return notifications.filter((n) => n.type === filterType);
  }, [notifications, filterType]);

  const cleanPhone = (phone?: string) => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("213")) return digits;
    if (digits.startsWith("0")) return "213" + digits.slice(1);
    return digits;
  };

  const getWhatsAppAlertLink = (notif: SmartNotification) => {
    const phone = cleanPhone(notif.recipientPhone);
    const msg = `🚨 *تنبيه من إدارة ${institutionName}*:\n${notif.title[currentLang]}\n${notif.message[currentLang]}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Bell size={24} className="text-amber-400" />
            <span>{t.notifCenterTitle}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{t.notifCenterSubtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBroadcastModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition shadow-lg shadow-amber-500/20"
          >
            <Plus size={16} />
            <span>{t.notifBroadcastBtn}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Quick Controls */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: t.notifFilterAll, count: notifications.length },
            { id: "critical", label: t.notifFilterCritical, count: notifications.filter((n) => n.urgency === "critical").length },
            { id: "maintenance", label: t.notifFilterMaintenance, count: notifications.filter((n) => n.type === "maintenance").length },
            { id: "license", label: t.notifFilterLicense, count: notifications.filter((n) => n.type === "license").length },
            { id: "vip", label: t.notifFilterVip, count: notifications.filter((n) => n.type === "vip").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                filterType === tab.id
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-950/30 text-[10px]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onMarkAllRead}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 font-semibold"
          >
            <CheckCheck size={14} className="text-amber-400" />
            <span>{t.markAllRead}</span>
          </button>

          <button
            onClick={onClearRead}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition flex items-center gap-1 font-semibold"
          >
            <Trash2 size={13} />
            <span>{t.notifClearRead}</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.map((notif) => {
          const icon = {
            maintenance: <Wrench size={18} className="text-amber-400 shrink-0" />,
            license: <FileCheck size={18} className="text-rose-400 shrink-0" />,
            fuel: <AlertTriangle size={18} className="text-blue-400 shrink-0" />,
            trip: <Zap size={18} className="text-emerald-400 shrink-0" />,
            system: <Sparkles size={18} className="text-violet-400 shrink-0" />,
            vip: <Sparkles size={18} className="text-amber-300 shrink-0" />,
          }[notif.type] || <Bell size={18} className="text-slate-400" />;

          const urgencyBorder = {
            critical: "border-rose-500/50 bg-rose-950/20 hover:border-rose-400",
            warning: "border-amber-500/50 bg-amber-950/20 hover:border-amber-400",
            info: "border-blue-500/30 bg-slate-900 hover:border-blue-400",
            success: "border-emerald-500/30 bg-slate-900 hover:border-emerald-400",
          }[notif.urgency];

          return (
            <div
              key={notif.id}
              className={`p-5 rounded-3xl border transition shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !notif.read ? urgencyBorder : "bg-slate-900/60 border-slate-800 opacity-70"
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700 mt-0.5">
                  {icon}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-white truncate">
                      {notif.title[currentLang]}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {notif.message[currentLang]}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {notif.timestamp}
                    </span>
                    {notif.driverName && (
                      <span>المعني: <b className="text-slate-400">{notif.driverName}</b></span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {notif.recipientPhone && (
                  <a
                    href={getWhatsAppAlertLink(notif)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    <MessageCircle size={14} />
                    <span>{t.actionNotifyDriver}</span>
                  </a>
                )}

                <button
                  onClick={() => onNotificationClick(notif)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition"
                >
                  {t.actionQuickFix}
                </button>
              </div>
            </div>
          );
        })}

        {filteredNotifs.length === 0 && (
          <div className="py-16 text-center text-slate-400 bg-slate-900/50 rounded-3xl border border-slate-800">
            <Bell size={36} className="mx-auto mb-2 opacity-30 text-slate-500" />
            <p className="text-sm font-semibold">{t.noUnreadAlerts}</p>
          </div>
        )}
      </div>
    </div>
  );
};
