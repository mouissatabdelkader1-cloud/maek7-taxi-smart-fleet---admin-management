import React from "react";
import {
  Car,
  Users,
  Route,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Wrench,
  FileCheck,
  Zap,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Radio,
  Clock,
  MapPin,
  Send,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Language,
  Vehicle,
  Driver,
  Trip,
  FinancialRecord,
  FeatureModules,
  SmartNotification,
  PresetTemplate,
} from "../types";
import { translations } from "../i18n/translations";
import { weeklyAnalyticsData, hourlyTrafficData } from "../data/mockData";

interface DashboardViewProps {
  currentLang: Language;
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  financialRecords: FinancialRecord[];
  notifications: SmartNotification[];
  featureFlags: FeatureModules;
  activeTemplate: PresetTemplate;
  onNavigate: (tabId: string) => void;
  onTripStatusChange: (tripId: string | number, newStatus: any) => void;
  onResolveAlert: (notifId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentLang,
  vehicles,
  drivers,
  trips,
  financialRecords,
  notifications,
  featureFlags,
  activeTemplate,
  onNavigate,
  onTripStatusChange,
  onResolveAlert,
}) => {
  const t = translations[currentLang];

  // Calculated Metrics
  const activeVehicles = vehicles.filter((v) => v.status === "active").length;
  const activeDrivers = drivers.filter((d) => d.status === "active").length;
  const ongoingTrips = trips.filter((t) => t.status === "ongoing");
  const todayTrips = trips.filter((t) => t.date.includes("اليوم") || t.date.includes("Today"));

  const totalIncome = financialRecords
    .filter((f) => f.kind === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = financialRecords
    .filter((f) => f.kind === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const readinessPercent = Math.round((activeVehicles / Math.max(vehicles.length, 1)) * 100);

  // Today estimated revenue from fares + contracts
  const todayRevenue =
    trips
      .filter((tr) => tr.status !== "cancelled" && (tr.date.includes("اليوم") || tr.date.includes("Today")))
      .reduce((sum, tr) => sum + tr.price, 0) +
    financialRecords
      .filter((f) => f.kind === "income" && (f.date.includes("اليوم") || f.date.includes("Today")))
      .reduce((sum, f) => sum + f.amount, 0);

  // Critical alerts
  const criticalNotifs = notifications.filter((n) => !n.read && n.urgency === "critical");
  const warningNotifs = notifications.filter((n) => !n.read && n.urgency === "warning");

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Tier Indicator */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold mb-3">
              <Sparkles size={13} className="animate-spin-slow" />
              <span>MAEK7-TAXI • {activeTemplate.name[currentLang].split("(")[0]}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.dashTitle}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {t.dashSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {featureFlags.aiAgent && (
              <button
                onClick={() => onNavigate("ai")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-900/30 transition transform hover:-translate-y-0.5"
              >
                <Sparkles size={16} />
                <span>{t.aiTitle.split(" ")[0]} {t.aiTitle.split(" ")[1]}</span>
              </button>
            )}

            <button
              onClick={() => onNavigate("trips")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              <Zap size={16} />
              <span>{t.newTrip}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Vehicles Card */}
        <div
          onClick={() => onNavigate("vehicles")}
          className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition cursor-pointer group shadow-sm hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
              <Car size={22} />
            </div>
            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-slate-800 text-blue-300 border border-slate-700">
              {readinessPercent}% {t.statusActive}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400">{t.statTotalVehicles}</p>
          <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">{vehicles.length}</p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {activeVehicles} {t.statActiveNow} ({vehicles.length - activeVehicles} {t.statusInMaintenance})
          </p>
        </div>

        {/* Active Drivers Card */}
        <div
          onClick={() => onNavigate("drivers")}
          className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer group shadow-sm hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <Users size={22} />
            </div>
            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-slate-800 text-emerald-300 border border-slate-700">
              ★ 4.8 / 5.0
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400">{t.statActiveDrivers}</p>
          <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">{activeDrivers}</p>
          <p className="text-xs text-slate-500 mt-1">
            {t.statOutOfTotal} {drivers.length} {t.driversTitle.toLowerCase()}
          </p>
        </div>

        {/* Today's Trips Card */}
        <div
          onClick={() => onNavigate("trips")}
          className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer group shadow-sm hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Route size={22} />
            </div>
            {ongoingTrips.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black animate-pulse">
                <Radio size={11} /> {ongoingTrips.length} {t.liveStatus}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-400">{t.statTodayTrips}</p>
          <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">{todayTrips.length}</p>
          <p className="text-xs text-amber-400 mt-1 font-semibold">
            {ongoingTrips.length} {t.statOngoingTrips}
          </p>
        </div>

        {/* Financial Flow Card */}
        <div
          onClick={() => onNavigate("finance")}
          className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/50 transition cursor-pointer group shadow-sm hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 text-violet-400 flex items-center justify-center group-hover:scale-110 transition">
              <Wallet size={22} />
            </div>
            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              +{Math.round((netBalance / Math.max(totalIncome, 1)) * 100)}%
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400">{t.statTodayRevenue}</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5 truncate">
            {todayRevenue.toLocaleString()} {t.currency}
          </p>
          <p className="text-xs text-slate-500 mt-1 truncate">
            {t.statNetProfit}: <span className="text-white font-bold">{netBalance.toLocaleString()} {t.currency}</span>
          </p>
        </div>
      </div>

      {/* Advanced Fleet Operations Quick Access Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate("radar")}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 hover:border-emerald-400/60 transition text-right rtl:text-right ltr:text-left flex items-center justify-between group shadow"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition">
              <Radio size={16} className="animate-pulse" />
            </span>
            <div>
              <span className="block text-xs font-black text-white">{t.navRadar}</span>
              <span className="text-[10px] text-emerald-400 font-bold">12 GPS Active</span>
            </div>
          </div>
          <ArrowUpRight size={14} className="text-slate-400 group-hover:text-emerald-400 transition" />
        </button>

        <button
          onClick={() => onNavigate("tlc_analytics")}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30 hover:border-amber-400/60 transition text-right rtl:text-right ltr:text-left flex items-center justify-between group shadow"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition">
              <TrendingUp size={16} />
            </span>
            <div>
              <span className="block text-xs font-black text-white">{t.navTlcAnalytics}</span>
              <span className="text-[10px] text-amber-400 font-bold">+18.5% YoY Growth</span>
            </div>
          </div>
          <ArrowUpRight size={14} className="text-slate-400 group-hover:text-amber-400 transition" />
        </button>

        <button
          onClick={() => onNavigate("maintenance")}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/30 hover:border-blue-400/60 transition text-right rtl:text-right ltr:text-left flex items-center justify-between group shadow"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition">
              <Wrench size={16} />
            </span>
            <div>
              <span className="block text-xs font-black text-white">{t.navMaintenance}</span>
              <span className="text-[10px] text-blue-400 font-bold">Naftal & Odometer</span>
            </div>
          </div>
          <ArrowUpRight size={14} className="text-slate-400 group-hover:text-blue-400 transition" />
        </button>

        <button
          onClick={() => onNavigate("driver_kpi")}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 hover:border-cyan-400/60 transition text-right rtl:text-right ltr:text-left flex items-center justify-between group shadow"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition">
              <Sparkles size={16} />
            </span>
            <div>
              <span className="block text-xs font-black text-white">{t.navDriverKpi}</span>
              <span className="text-[10px] text-cyan-400 font-bold">⭐ 4.8 Leaderboard</span>
            </div>
          </div>
          <ArrowUpRight size={14} className="text-slate-400 group-hover:text-cyan-400 transition" />
        </button>
      </div>

      {/* Main Charts & Live Dispatch Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Visual Charts (Weekly Revenue & Trips) */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-amber-400" />
                <span>{t.chartWeeklyTrends}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{t.statWeeklyRevenue}</p>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
                {t.statWeeklyRevenue}
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-3 h-3 rounded-md bg-amber-500"></span>
                {t.statWeeklyTrips}
              </span>
            </div>
          </div>

          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAnalyticsData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis yAxisId="rev" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis yAxisId="trip" orientation="right" stroke="#f59e0b" tick={{ fill: "#f59e0b", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "1rem",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                  formatter={(value: any, name: any) => [
                    typeof value === "number" ? value.toLocaleString() : value,
                    name,
                  ]}
                />
                <Bar
                  yAxisId="rev"
                  dataKey="revenue"
                  name={t.statWeeklyRevenue}
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  yAxisId="trip"
                  dataKey="trips"
                  name={t.statWeeklyTrips}
                  fill="#f59e0b"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Operational Alerts Hub */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                <span>{t.alertsTitle}</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                {criticalNotifs.length + warningNotifs.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 4).map((notif) => {
                const icon = {
                  maintenance: <Wrench size={16} className="text-amber-400 shrink-0" />,
                  license: <FileCheck size={16} className="text-rose-400 shrink-0" />,
                  fuel: <AlertTriangle size={16} className="text-blue-400 shrink-0" />,
                  trip: <Zap size={16} className="text-emerald-400 shrink-0" />,
                  system: <Sparkles size={16} className="text-violet-400 shrink-0" />,
                  vip: <Sparkles size={16} className="text-amber-300 shrink-0" />,
                }[notif.type] || <AlertTriangle size={16} className="text-amber-400" />;

                const isCrit = notif.urgency === "critical";

                return (
                  <div
                    key={notif.id}
                    className={`p-3.5 rounded-2xl border transition ${
                      isCrit
                        ? "bg-rose-950/20 border-rose-500/40"
                        : "bg-slate-800/60 border-slate-700/60"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 mt-0.5">
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-white truncate">
                            {notif.title[currentLang]}
                          </p>
                          <span className="text-[9px] text-slate-500 shrink-0">
                            {notif.timestamp.split("/")[0]}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 leading-snug">
                          {notif.message[currentLang]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => onNavigate("notifications")}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
            >
              <span>{t.notifCenterTitle}</span>
              <ArrowUpRight size={14} />
            </button>

            <button
              onClick={() => onNavigate("whatsapp")}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Send size={12} />
              <span>{t.navWhatsApp}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Trips Telemetry / Ongoing Dispatch Board */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Radio size={20} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">{t.liveTripsTitle}</h2>
              <p className="text-xs text-slate-400">{ongoingTrips.length} {t.statOngoingTrips}</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate("trips")}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700"
          >
            {t.tripsTitle} →
          </button>
        </div>

        {ongoingTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ongoingTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-amber-500/50 transition shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black text-[11px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      {t.tripStatusOngoing}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {trip.id}
                    </span>
                  </div>
                  <span className="text-sm font-black text-amber-400">
                    {trip.price.toLocaleString()} {t.currency}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white truncate">
                    <MapPin size={14} className="text-amber-400 shrink-0" />
                    <span className="truncate">{trip.from}</span>
                    <span className="text-slate-500">→</span>
                    <span className="truncate">{trip.to}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 truncate">
                      <Users size={12} className="text-slate-500" />
                      {trip.driver}
                    </span>
                    <span className="font-mono text-slate-300 font-semibold" dir="ltr">
                      {trip.vehicle}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {t.departureAt} {trip.time}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onTripStatusChange(trip.id, "completed")}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition"
                    >
                      {t.actionCompleteTrip}
                    </button>
                    <button
                      onClick={() => onTripStatusChange(trip.id, "cancelled")}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold transition"
                    >
                      {t.actionCancelTrip}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-slate-400 text-sm">
            <Car size={32} className="mx-auto mb-2 text-slate-600 opacity-50" />
            <p>{t.liveTripsEmpty}</p>
          </div>
        )}
      </div>
    </div>
  );
};
