import React, { useState, useEffect } from "react";
import {
  Car,
  Navigation,
  Compass,
  Zap,
  Radio,
  Gauge,
  Fuel,
  User,
  Clock,
  Phone,
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Shield,
  Layers,
  MapPin,
} from "lucide-react";
import { Language, LiveTelemetryVehicle, VehicleType, ZoneAnalytics } from "../types";
import { initialLiveTelemetry, initialZoneAnalytics } from "../data/mockData";

interface RadarMapViewProps {
  currentLang: Language;
  institutionName: string;
}

export const RadarMapView: React.FC<RadarMapViewProps> = ({
  currentLang,
  institutionName,
}) => {
  const isAr = currentLang === "ar";
  const isFr = currentLang === "fr";

  // State
  const [vehicles, setVehicles] = useState<LiveTelemetryVehicle[]>(initialLiveTelemetry);
  const [zones] = useState<ZoneAnalytics[]>(initialZoneAnalytics);
  const [selectedVehicle, setSelectedVehicle] = useState<LiveTelemetryVehicle | null>(vehicles[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [liveAlertMessage, setLiveAlertMessage] = useState<string | null>(null);

  // Live Movement Simulation Effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.status !== "active_trip") return v;

          // Subtle movement simulation
          const angleRad = (v.headingDeg * Math.PI) / 180;
          const step = (0.25 * simSpeed);
          let newX = v.x + Math.cos(angleRad) * step;
          let newY = v.y + Math.sin(angleRad) * step;
          let newHeading = v.headingDeg;

          // Boundary rebound
          if (newX > 88 || newX < 12) {
            newHeading = (180 - newHeading + 360) % 360;
            newX = Math.max(12, Math.min(88, newX));
          }
          if (newY > 82 || newY < 18) {
            newHeading = (360 - newHeading) % 360;
            newY = Math.max(18, Math.min(82, newY));
          }

          // Random speed fluctuation
          const speedVariance = (Math.random() - 0.5) * 4;
          const newSpeed = Math.max(30, Math.min(100, Math.round(v.speedKmh + speedVariance)));

          return {
            ...v,
            x: Math.round(newX * 10) / 10,
            y: Math.round(newY * 10) / 10,
            headingDeg: Math.round(newHeading),
            speedKmh: newSpeed,
          };
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  // Keep selected vehicle telemetry in sync
  useEffect(() => {
    if (selectedVehicle) {
      const updated = vehicles.find((v) => v.id === selectedVehicle.id);
      if (updated) setSelectedVehicle(updated);
    }
  }, [vehicles]);

  // Dispatch Simulator Action
  const handleSimulateDispatch = () => {
    const available = vehicles.find((v) => v.status === "idle_ready");
    if (available) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === available.id
            ? {
                ...v,
                status: "active_trip",
                speedKmh: 58,
                headingDeg: 65,
                currentRoute: {
                  from: "مطار هواري بومدين — الصالة 2",
                  to: "فندق الأوراسي — وسط العاصمة",
                  etaMinutes: 19,
                  passenger: "وفد أعمال جزائري-دولي",
                },
              }
            : v
        )
      );
      setLiveAlertMessage(
        isAr
          ? `🚀 تم تفويج وتوجيه المركبة (${available.plate}) للرحلة بنجاح!`
          : `🚀 Vehicle (${available.plate}) dispatched to active trip!`
      );
      setTimeout(() => setLiveAlertMessage(null), 4000);
    } else {
      setLiveAlertMessage(
        isAr
          ? "⚠️ جميع المركبات في رحلات جارية حالياً أو في ورشات الصيانة."
          : "⚠️ All vehicles are currently on active trips or in maintenance."
      );
      setTimeout(() => setLiveAlertMessage(null), 4000);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (filterType === "all") return true;
    if (filterType === "active") return v.status === "active_trip";
    if (filterType === "idle") return v.status === "idle_ready";
    if (filterType === "taxi") return v.type === "taxi";
    if (filterType === "vip") return v.type === "vip";
    if (filterType === "bus") return v.type === "bus" || v.type === "minibus";
    return true;
  });

  const getVehicleColor = (v: LiveTelemetryVehicle) => {
    if (v.status === "idle_ready") return "bg-emerald-500 text-slate-950 border-emerald-300";
    if (v.type === "vip") return "bg-amber-400 text-slate-950 border-amber-200 shadow-amber-400/50";
    if (v.type === "bus" || v.type === "minibus") return "bg-blue-500 text-white border-blue-300";
    return "bg-amber-500 text-slate-950 border-amber-300";
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Radio className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                {isAr
                  ? "خريطة الرادار المباشر والتتبع الجغرافي للأسطول"
                  : isFr
                  ? "Radar en Direct & Géolocalisation Flotte"
                  : "Live Fleet Radar & Geospatial Telemetry"}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  {isAr ? "تحديث حي 1.2s" : "LIVE 1.2s"}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {isAr
                  ? `مراقبة تليمترية لحظية لحركة مركبات ${institutionName} مع مؤشرات السرعة ومناطق الطلب`
                  : `Real-time geospatial telemetry and speed radar for ${institutionName}`}
              </p>
            </div>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              isPlaying
                ? "bg-amber-500 text-slate-950 hover:bg-amber-400 font-black shadow-lg shadow-amber-500/20"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                {isAr ? "إيقاف مؤقت" : "Pause Radar"}
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {isAr ? "استئناف الحركة" : "Resume Radar"}
              </>
            )}
          </button>

          <button
            onClick={handleSimulateDispatch}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            {isAr ? "محاكاة تفويج ذكي" : "Simulate Dispatch"}
          </button>

          <select
            value={simSpeed}
            onChange={(e) => setSimSpeed(Number(e.target.value))}
            aria-label={isAr ? "سرعة محاكاة الرادار" : "Radar simulation speed"}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 font-bold focus:outline-none focus:border-amber-500"
          >
            <option value={1}>1x {isAr ? "سرعة عادية" : "Normal"}</option>
            <option value={2}>2x {isAr ? "سريع" : "Fast"}</option>
            <option value={3}>3x {isAr ? "فائق السرعة" : "Ultra"}</option>
          </select>
        </div>
      </div>

      {/* Alert Banner if any */}
      {liveAlertMessage && (
        <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-bold flex items-center gap-3 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
          <span>{liveAlertMessage}</span>
        </div>
      )}

      {/* Main Grid: Radar Canvas + Telemetry Drawer */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Radar Map Canvas (8 Cols) */}
        <div className="xl:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 z-10">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
              {[
                { id: "all", label: isAr ? "الكل" : "All" },
                { id: "active", label: isAr ? "في رحلة" : "Active Trips" },
                { id: "idle", label: isAr ? "متاحة للطلب" : "Idle Ready" },
                { id: "taxi", label: isAr ? "طاكسي" : "Taxi" },
                { id: "vip", label: "VIP Limo" },
                { id: "bus", label: isAr ? "حافلات" : "Buses" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    filterType === tab.id
                      ? "bg-amber-500 text-slate-950 font-black shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-bold bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                {vehicles.filter((v) => v.status === "active_trip").length} {isAr ? "مركبة متحركة" : "moving"}
              </span>
              <span>•</span>
              <span className="text-slate-300">
                {zones.length} {isAr ? "مناطق ذروة نشطة" : "active hubs"}
              </span>
            </div>
          </div>

          {/* Radar Screen Area */}
          <div className="relative w-full h-[480px] sm:h-[540px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden select-none">
            {/* Background Grid & Radar Rings */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="radar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#radar-grid)" />
              {/* Radar circular sweeps */}
              <circle cx="50%" cy="50%" r="20%" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6 6" />
              <circle cx="50%" cy="50%" r="48%" fill="none" stroke="#3b82f6" strokeWidth="1" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#475569" strokeWidth="0.5" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#475569" strokeWidth="0.5" />
            </svg>

            {/* Rotating Scanner Cone */}
            {isPlaying && (
              <div
                className="absolute inset-0 pointer-events-none origin-center animate-spin"
                style={{ animationDuration: "8s" }}
              >
                <div
                  className="w-1/2 h-1/2 absolute top-0 right-0"
                  style={{
                    background: "conic-gradient(from 0deg, rgba(245, 158, 11, 0.15) 0deg, transparent 60deg)",
                  }}
                />
              </div>
            )}

            {/* Zones & Hubs Pin Overlays */}
            <div className="absolute top-[28%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/30 animate-pulse flex items-center justify-center">
                <span className="text-[10px] font-black text-amber-300 bg-slate-900/90 px-2 py-0.5 rounded-full border border-amber-500/40">
                  ✈️ {isAr ? "مطار هواري بومدين" : "Airport Hub"}
                </span>
              </div>
            </div>

            <div className="absolute top-[38%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <span className="text-[10px] font-black text-blue-300 bg-slate-900/90 px-2 py-0.5 rounded-full border border-blue-500/40">
                  🏛️ {isAr ? "وسط العاصمة" : "Downtown Alger"}
                </span>
              </div>
            </div>

            <div className="absolute top-[54%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
                <span className="text-[10px] font-black text-teal-300 bg-slate-900/90 px-2 py-0.5 rounded-full border border-teal-500/40">
                  🌊 {isAr ? "محطة وهران" : "Oran Maritime"}
                </span>
              </div>
            </div>

            <div className="absolute top-[34%] left-[78%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                <span className="text-[10px] font-black text-purple-300 bg-slate-900/90 px-2 py-0.5 rounded-full border border-purple-500/40">
                  🎓 {isAr ? "قطب قسنطينة" : "Constantine Hub"}
                </span>
              </div>
            </div>

            {/* Render Vehicle Markers */}
            {filteredVehicles.map((veh) => {
              const isSelected = selectedVehicle?.id === veh.id;
              const colorClass = getVehicleColor(veh);

              return (
                <div
                  key={veh.id}
                  onClick={() => setSelectedVehicle(veh)}
                  style={{
                    left: `${veh.x}%`,
                    top: `${veh.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="absolute cursor-pointer transition-all duration-1000 group z-20"
                >
                  {/* Ping effect when selected */}
                  {isSelected && (
                    <div className="absolute -inset-3 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
                  )}

                  {/* Marker Pin Icon */}
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center border-2 shadow-lg transition-transform duration-300 group-hover:scale-125 ${colorClass} ${
                      isSelected ? "ring-4 ring-amber-400 scale-125" : ""
                    }`}
                  >
                    <Car className="w-5 h-5" />
                  </div>

                  {/* Floating Tag */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 pointer-events-none whitespace-nowrap">
                    <div className="bg-slate-900/95 border border-slate-700 px-2 py-0.5 rounded-md text-[10px] font-black text-slate-100 shadow-xl flex items-center gap-1.5">
                      <span>{veh.plate}</span>
                      {veh.speedKmh > 0 && (
                        <span className="text-amber-400 font-bold">{veh.speedKmh} km/h</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-bold text-amber-400">
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300" />
                {isAr ? "طاكسي نشط" : "Active Taxi"}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300" />
                {isAr ? "مركبة متاحة" : "Idle Available"}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-blue-400">
                <span className="w-3 h-3 rounded-full bg-blue-500 border border-blue-300" />
                {isAr ? "حافلة نقل" : "Bus / Transit"}
              </span>
            </div>

            <div className="text-[11px] text-slate-500">
              {isAr ? "اضغط على أي مركبة لعرض القياس التليمترى الكامل والتواصل الفوري" : "Click on any vehicle marker for detailed telemetry"}
            </div>
          </div>
        </div>

        {/* Selected Vehicle Telemetry Drawer (4 Cols) */}
        <div className="xl:col-span-4 space-y-5">
          {selectedVehicle ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getVehicleColor(selectedVehicle)}`}>
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{selectedVehicle.plate}</h3>
                    <p className="text-xs text-amber-400 font-bold uppercase">{selectedVehicle.type}</p>
                  </div>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-black border ${
                    selectedVehicle.status === "active_trip"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  }`}
                >
                  {selectedVehicle.status === "active_trip"
                    ? isAr ? "في مسار رحلة" : "On Trip"
                    : isAr ? "متاحة للطلب" : "Ready / Idle"}
                </span>
              </div>

              {/* Driver and Location Info */}
              <div className="space-y-3">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      {isAr ? "السائق المكلف" : "Assigned Driver"}
                    </span>
                    <span className="font-bold text-white">{selectedVehicle.driver}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      {isAr ? "النطاق الجغرافي" : "Geographic Zone"}
                    </span>
                    <span className="font-bold text-slate-300">{selectedVehicle.zone}</span>
                  </div>
                </div>

                {/* Live Speed & Fuel Meter */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-amber-400" />
                      {isAr ? "السرعة اللحظية" : "Live Speed"}
                    </span>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">{selectedVehicle.speedKmh}</span>
                      <span className="text-[10px] text-slate-400 font-bold">km/h</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                      {isAr ? "مستوى الوقود" : "Fuel Level"}
                    </span>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-emerald-400">{selectedVehicle.fuelPercent}%</span>
                      <span className="text-[10px] text-slate-400 font-bold">Naftal</span>
                    </div>
                  </div>
                </div>

                {/* Active Trip Trajectory if present */}
                {selectedVehicle.currentRoute ? (
                  <div className="bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950 p-4 rounded-2xl border border-amber-500/20 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-black text-amber-300">
                      <span className="flex items-center gap-1.5">
                        <Navigation className="w-4 h-4" />
                        {isAr ? "مسار الرحلة الحالية" : "Active Trip Itinerary"}
                      </span>
                      <span className="bg-amber-500/20 px-2 py-0.5 rounded-md text-[10px] text-amber-300 font-mono">
                        ETA: {selectedVehicle.currentRoute.etaMinutes} min
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-300">
                      <p className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-bold text-white">{selectedVehicle.currentRoute.from}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        <span className="font-bold text-white">{selectedVehicle.currentRoute.to}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{isAr ? "الزبون:" : "Passenger:"} {selectedVehicle.currentRoute.passenger}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400 font-bold">
                    {isAr ? "المركبة في وضع الانتظار وجاهزة لاستقبال طلبات النقل الفورية" : "Vehicle is currently idle and ready for incoming dispatch requests"}
                  </div>
                )}
              </div>

              {/* Direct Actions */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <a
                  href={`https://wa.me/213550123456?text=${encodeURIComponent(
                    `مرحباً، إشعار تفويج وتتبع من إدارة ${institutionName} للمركبة ${selectedVehicle.plate}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                >
                  <MessageSquare className="w-4 h-4" />
                  {isAr ? "واتساب السائق" : "WhatsApp"}
                </a>

                <button
                  onClick={() => {
                    setLiveAlertMessage(
                      isAr
                        ? `📞 جاري الاتصال المباشر بجهاز السائق (${selectedVehicle.driver})`
                        : `📞 Initiating direct voice call to driver (${selectedVehicle.driver})`
                    );
                    setTimeout(() => setLiveAlertMessage(null), 3500);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-4 h-4" />
                  {isAr ? "اتصال فوري" : "Direct Call"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-sm font-bold">
              {isAr ? "حدد مركبة من الخريطة لمعاينة البيانات التليمترية" : "Select a vehicle pin from the radar map"}
            </div>
          )}

          {/* Zones High Demand Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-black text-slate-300 flex items-center gap-2 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-rose-400" />
              {isAr ? "مؤشر ذروة الطلب بالمناطق (Surge Zones)" : "Zone Demand & Surges"}
            </h4>

            <div className="space-y-2 text-xs">
              {zones.slice(0, 3).map((z) => (
                <div
                  key={z.id}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white">{z.arabicName}</p>
                    <p className="text-[10px] text-slate-400">{z.dailyPickups} {isAr ? "رحلة/يوم" : "trips/day"}</p>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-black text-[11px] border border-amber-500/30">
                    {z.surgeFactor}x Surge
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
