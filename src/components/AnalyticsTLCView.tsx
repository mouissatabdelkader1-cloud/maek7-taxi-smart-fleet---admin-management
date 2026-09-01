import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Download,
  FileSpreadsheet,
  Clock,
  Car,
  Users,
  DollarSign,
  CloudRain,
  Share2,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Language, TlcFleetMetrics, ZoneAnalytics } from "../types";
import {
  initialTlcMetrics,
  initialZoneAnalytics,
  initialHourlyDistribution,
  initialWeatherTrafficStats,
} from "../data/mockData";

interface AnalyticsTLCViewProps {
  currentLang: Language;
  institutionName: string;
}

export const AnalyticsTLCView: React.FC<AnalyticsTLCViewProps> = ({
  currentLang,
  institutionName,
}) => {
  const isAr = currentLang === "ar";
  const isFr = currentLang === "fr";

  const [metrics] = useState<TlcFleetMetrics[]>(initialTlcMetrics);
  const [zones] = useState<ZoneAnalytics[]>(initialZoneAnalytics);
  const [activeTab, setActiveTab] = useState<"overview" | "hourly" | "zones" | "weather">("overview");

  const latest = metrics[metrics.length - 1];

  // Colors
  const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"];

  // Pie Data for vehicle types
  const serviceDistributionData = [
    { name: isAr ? "طاكسي برلين (Standard Taxi)" : "Standard Taxi", value: 55, color: "#f59e0b" },
    { name: isAr ? "حافلات النقل (Buses)" : "Transit Buses", value: 25, color: "#3b82f6" },
    { name: isAr ? "خدمة كبار الشخصيات (VIP)" : "VIP Limousine", value: 12, color: "#10b981" },
    { name: isAr ? "ميني بوس (Minibus)" : "Minibus", value: 8, color: "#8b5cf6" },
  ];

  // Export TLC CSV Report
  const handleExportCsv = () => {
    const headers = [
      "Month",
      "Unique_Vehicles",
      "Unique_Drivers",
      "Trips_Per_Day",
      "Farebox_Per_Day_DZD",
      "Farebox_Per_Vehicle_DZD",
      "Farebox_Per_Driver_DZD",
      "Farebox_Per_Trip_DZD",
      "Farebox_Per_Minute_DZD",
      "Trips_Per_Vehicle_Daily",
      "Active_Trip_Hours_Daily",
      "Shared_Trips_Fraction",
      "YoY_Growth_Pct",
    ];

    const rows = metrics.map((m) => [
      m.month,
      m.uniqueVehicles,
      m.uniqueDrivers,
      m.tripsPerDay,
      m.fareboxPerDay,
      m.fareboxPerVehicle,
      m.fareboxPerDriver,
      m.fareboxPerTrip,
      m.fareboxPerMinute,
      m.tripsPerVehiclePerDay,
      m.activeTripHoursPerDay,
      m.sharedTripsFrac,
      m.yoyGrowthPct,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MAEK7-TLC-Fleet-Report-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <TrendingUp className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              {isAr
                ? "تحليلات الأداء ومؤشرات TLC العالمية"
                : isFr
                ? "Métriques & Analyses de Flotte TLC"
                : "TLC Fleet Benchmarking & Market Intelligence"}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                TLC Benchmark
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {isAr
                ? `مؤشرات الإنتاجية القياسية، العائد للدقيقة، ونسب الرحلات المشتركة لـ ${institutionName}`
                : `Comprehensive productivity, farebox per minute and demand distribution for ${institutionName}`}
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-amber-400" />
            {isAr ? "تصدير تقرير TLC (CSV)" : "Export TLC Report (CSV)"}
          </button>
        </div>
      </div>

      {/* TLC Key Indicator Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
            <span>{isAr ? "الدخل اليومي للمركبة" : "Daily Farebox / Vehicle"}</span>
            <Car className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {latest.fareboxPerVehicle.toLocaleString()} <span className="text-xs text-amber-400 font-bold">دج/شهر</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{latest.yoyGrowthPct}% {isAr ? "نمو سنوي (YoY)" : "YoY Growth"}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
            <span>{isAr ? "العائد للدقيقة التشغيلية" : "Farebox / Active Minute"}</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-400">
            {latest.fareboxPerMinute} <span className="text-xs text-slate-300 font-bold">دج / دقيقة</span>
          </div>
          <div className="text-[11px] text-slate-400 font-bold mt-1.5">
            {isAr ? "متوسط مدة الرحلة:" : "Avg Trip Time:"} {latest.avgMinutesPerTrip} min
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
            <span>{isAr ? "معدل رحلات المركبة" : "Trips / Vehicle / Day"}</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            {latest.tripsPerVehiclePerDay} <span className="text-xs text-slate-300 font-bold">{isAr ? "رحلة/يوم" : "trips/day"}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-bold mt-1.5">
            {isAr ? "إجمالي رحلات الأسطول:" : "Fleet Total:"} {latest.tripsPerDay} {isAr ? "يومياً" : "daily"}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
            <span>{isAr ? "نسبة النقل التشاركي" : "Shared Rides Ratio"}</span>
            <Share2 className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-violet-400">
            {Math.round(latest.sharedTripsFrac * 100)}%
          </div>
          <div className="text-[11px] text-slate-400 font-bold mt-1.5">
            {isAr ? "ملء المقاعد وترشيد الوقود" : "Passenger carpooling index"}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold w-fit">
        {[
          { id: "overview", label: isAr ? "نظرة عامة والنمو" : "Growth Trends" },
          { id: "hourly", label: isAr ? "منحنى الساعات والذروة" : "Hourly Peak Curves" },
          { id: "zones", label: isAr ? "المناطق والمطارات" : "Zones & Hubs" },
          { id: "weather", label: isAr ? "تأثير الطقس والازدحام" : "Weather & Traffic" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === tab.id
                ? "bg-amber-500 text-slate-950 font-black shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Growth */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-base font-black text-white flex items-center justify-between">
              <span>{isAr ? "تطور دخل الأسطول اليومي ونمو الرحلات (TLC Metrics)" : "Monthly Daily Farebox & Trip Growth"}</span>
              <span className="text-xs text-slate-400 font-normal">2026 Monthly Trend</span>
            </h3>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }}
                    formatter={(val: any) => [`${Number(val).toLocaleString()} دج`, ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                  <Bar dataKey="fareboxPerDay" name={isAr ? "الدخل اليومي (دج)" : "Farebox / Day (DZD)"} fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="tripsPerDay" name={isAr ? "رحلات اليوم" : "Trips / Day"} fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <h3 className="text-base font-black text-white">
              {isAr ? "توزيع حصة الخدمات بالأسطول" : "Fleet Service Distribution"}
            </h3>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {serviceDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }}
                    formatter={(val: any) => [`${val}%`, "الحصة"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs">
              {serviceDistributionData.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                  <span className="font-bold text-white">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hourly Peak Curves */}
      {activeTab === "hourly" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-base font-black text-white">
              {isAr ? "منحنى طلب الرحلات ونقاط الانطلاق والوصول بالساعة (Hourly Pickups & Dropoffs)" : "Hourly Pickups vs Dropoffs Distribution"}
            </h3>
            <span className="text-xs text-amber-400 font-bold">
              {isAr ? "ذروة صباحية (07:00-09:00) • ذروة مسائية (16:00-18:30)" : "Morning Peak (7-9am) • Evening Peak (4-6:30pm)"}
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={initialHourlyDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Line
                  type="monotone"
                  dataKey="pickups"
                  name={isAr ? "طلبات الركوب (Pickups)" : "Pickups"}
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="dropoffs"
                  name={isAr ? "الوصول (Dropoffs)" : "Dropoffs"}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 3: Zones and Hubs */}
      {activeTab === "zones" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <h3 className="text-base font-black text-white">
            {isAr ? "تحليل أداء المحطات الجغرافية ومناطق الطلب (Zone Centroids & Hubs)" : "Geographic Hubs & Zone Centroids Analysis"}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300 text-right rtl:text-right ltr:text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-black uppercase">
                  <th className="py-3 px-4">{isAr ? "المنطقة / المحطة" : "Zone / Hub"}</th>
                  <th className="py-3 px-4">{isAr ? "نوع النطاق" : "Zone Type"}</th>
                  <th className="py-3 px-4">{isAr ? "الرحلات اليومية" : "Daily Trips"}</th>
                  <th className="py-3 px-4">{isAr ? "متوسط المدة" : "Avg Duration"}</th>
                  <th className="py-3 px-4">{isAr ? "متوسط التسعيرة" : "Avg Fare"}</th>
                  <th className="py-3 px-4">{isAr ? "معامل الذروة" : "Surge Factor"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-bold">
                {zones.map((z) => (
                  <tr key={z.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-black text-white">
                      {z.arabicName}
                      <span className="block text-[10px] text-slate-400 font-normal">{z.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                        {z.zoneType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-amber-400 font-mono font-black">{z.dailyPickups} رحلة/يوم</td>
                    <td className="py-3 px-4">{z.avgTripDurationMin} دقيقة</td>
                    <td className="py-3 px-4 text-emerald-400 font-mono">{z.avgFareDzd} دج</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
                        {z.surgeFactor}x
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Weather & Demand */}
      {activeTab === "weather" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <CloudRain className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="text-base font-black text-white">
                {isAr ? "مصفوفة تأثير الطقس والازدحام على سرعة وأسعار الرحلات (Weather Matrix)" : "Weather & Traffic Impact on Fleet Speed"}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr
                  ? "مستوحى من دراسة NYC Taxi & Central Park Weather لتحسين تسعير الرحلات في الأيام الماطرة وساعات الذروة"
                  : "Correlation between weather observations, trip demand surges, and travel delays"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {initialWeatherTrafficStats.map((st, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>{st.condition}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">{isAr ? "مؤشر الطلب:" : "Demand Index:"}</span>
                  <span className="text-lg font-black text-amber-400">{st.tripsDemand}%</span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-400">{isAr ? "متوسط السرعة:" : "Avg Speed:"}</span>
                  <span className="font-bold text-white">{st.avgSpeedKmh} km/h</span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-400">{isAr ? "التأخير المتوقع:" : "Expected Delay:"}</span>
                  <span className="font-bold text-rose-400">+{st.delayMinutes} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
