import React, { useState, useEffect } from "react";
import {
  Video,
  Camera,
  Eye,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Mic,
  MicOff,
  Volume2,
  Disc,
  Play,
  RotateCcw,
  Zap,
  MapPin,
  Clock,
  Car,
  UserCheck,
  Users,
  Search,
  CheckCircle,
  Siren,
  Sliders,
  Sparkles,
} from "lucide-react";
import {
  Language,
  DashcamVehicleStream,
  DashcamIncident,
  IncidentType,
} from "../types";

interface DashcamSurveillanceViewProps {
  language: Language;
  currency: string;
  streams: DashcamVehicleStream[];
  incidents: DashcamIncident[];
  onTriggerAlert?: (message: string, severity: "critical" | "warning") => void;
}

export const DashcamSurveillanceView: React.FC<DashcamSurveillanceViewProps> = ({
  language,
  streams: initialStreams,
  incidents: initialIncidents,
  onTriggerAlert,
}) => {
  const [streams, setStreams] = useState<DashcamVehicleStream[]>(initialStreams);
  const [incidents, setIncidents] = useState<DashcamIncident[]>(initialIncidents);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    initialStreams[0]?.vehicleId || "V-101"
  );
  const [activeCamTab, setActiveCamTab] = useState<"dual" | "road" | "cabin">("dual");
  const [isIntercomActive, setIsIntercomActive] = useState(false);
  const [intercomMessage, setIntercomMessage] = useState("");
  const [isLiveRecording, setIsLiveRecording] = useState(true);
  const [recordingSeconds, setRecordingSeconds] = useState(142);
  const [incidentFilter, setIncidentFilter] = useState<"all" | "unresolved" | "critical">("all");
  const [simulatedDrowsiness, setSimulatedDrowsiness] = useState<number>(12);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const activeVehicle = streams.find((s) => s.vehicleId === selectedVehicleId) || streams[0];

  // Live recording timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update simulated drowsiness when vehicle changes
  useEffect(() => {
    if (activeVehicle) {
      setSimulatedDrowsiness(activeVehicle.driverDrowsinessPercent);
    }
  }, [selectedVehicleId, activeVehicle]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendVoiceAlert = (text: string) => {
    setToastNotification(
      language === "ar"
        ? `🔊 تم بث التنبيه الصوتي إلى مقصورة السائق: "${text}"`
        : language === "fr"
        ? `🔊 Alerte vocale diffusée en cabine: "${text}"`
        : `🔊 Voice warning broadcasted to cabin: "${text}"`
    );
    if (onTriggerAlert) {
      onTriggerAlert(
        language === "ar"
          ? `بث صوتي للسائق (${activeVehicle.driverName}): ${text}`
          : `Voice broadcast to ${activeVehicle.driverName}: ${text}`,
        "warning"
      );
    }
    setTimeout(() => setToastNotification(null), 4500);
  };

  const handleTriggerSOS = () => {
    const newIncident: DashcamIncident = {
      id: `INC-${Date.now().toString().slice(-4)}`,
      vehiclePlate: activeVehicle.plate,
      driverName: activeVehicle.driverName,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      type: "passenger_sos",
      severity: "critical",
      details:
        language === "ar"
          ? `إنذار طوارئ SOS يدوي نشط من مقصورة المركبة ${activeVehicle.plate}`
          : `Manual SOS emergency trigger from cabin ${activeVehicle.plate}`,
      cameraSource: "cabin",
      location: activeVehicle.gpsLocation,
      speedKmh: activeVehicle.speedKmh,
      resolved: false,
    };

    setIncidents([newIncident, ...incidents]);
    setToastNotification(
      language === "ar"
        ? `🚨 إطلاق بروتوكول الطوارئ والأمان للمركبة ${activeVehicle.plate}!`
        : `🚨 Emergency SOS protocol activated for ${activeVehicle.plate}!`
    );
  };

  const handleResolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, resolved: true } : inc))
    );
    setToastNotification(
      language === "ar"
        ? "✅ تم معالجة وإغلاق الحادث الأمني بنجاح"
        : "✅ Incident resolved & logged"
    );
    setTimeout(() => setToastNotification(null), 3000);
  };

  const handleCaptureSnapshot = () => {
    setToastNotification(
      language === "ar"
        ? "📸 تم حفظ لقطة أمنية مشفرة عالية الدقة مع التوقيع الرقمي وإحداثيات GPS"
        : "📸 Encrypted HD security snapshot captured with GPS watermark"
    );
    setTimeout(() => setToastNotification(null), 4000);
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (incidentFilter === "unresolved") return !inc.resolved;
    if (incidentFilter === "critical") return inc.severity === "critical";
    return true;
  });

  return (
    <div id="dashcam-surveillance-container" className="space-y-6">
      {/* Toast alert banner */}
      {toastNotification && (
        <div className="bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl shadow-xl flex items-center justify-between text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span>{toastNotification}</span>
          </div>
          <button
            onClick={() => setToastNotification(null)}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
          >
            {language === "ar" ? "إغلاق" : "Dismiss"}
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-500/20">
              <Camera className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {language === "ar"
                    ? "منظومة كاميرات المراقبة المزدوجة والرصد اللحظي"
                    : language === "fr"
                    ? "Système de Télématique & Dashcam Double Flux"
                    : "AI Dual Dashcam & Cabin Telematics Suite"}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  {language === "ar" ? "بث مباشر مشفر" : "LIVE ENCRYPTED STREAM"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === "ar"
                  ? "تسجيل ومراقبة الطريق والمقصورة بالذكاء الاصطناعي — كشف النعاس، استخدام الهاتف، وضمان أمان السائق والركاب"
                  : language === "fr"
                  ? "Surveillance IA route et habitacle — Détection de fatigue, distraction et sécurité passagers"
                  : "AI road & cabin safety telematics — Drowsiness detection, phone usage monitor, and active passenger safety"}
              </p>
            </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                {language === "ar" ? "الكاميرات النشطة:" : "Active Feeds:"}
              </span>{" "}
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                {streams.length * 2} Cam
              </strong>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                {language === "ar" ? "مدة التسجيل السحابي:" : "REC Time:"}
              </span>{" "}
              <strong className="text-red-500 font-mono">
                {formatTimer(recordingSeconds)}
              </strong>
            </div>

            <button
              onClick={handleTriggerSOS}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs cursor-pointer"
            >
              <Siren className="w-4 h-4 animate-spin" />
              {language === "ar" ? "إنذار طوارئ SOS" : "Emergency SOS"}
            </button>
          </div>
        </div>

        {/* Vehicle Selector Strip */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {language === "ar" ? "اختر المركبة للبث:" : "Select Vehicle Stream:"}
          </span>
          {streams.map((veh) => {
            const isSelected = veh.vehicleId === selectedVehicleId;
            const hasAlert = veh.cabinStatus === "alert" || veh.driverDrowsinessPercent > 50;

            return (
              <button
                key={veh.vehicleId}
                onClick={() => setSelectedVehicleId(veh.vehicleId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 border whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-emerald-600 dark:text-white border-transparent shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750"
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span className="font-mono">{veh.plate}</span>
                <span className="text-[11px] opacity-80">({veh.driverName.split(" ")[0]})</span>
                {hasAlert && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual Camera Feeds Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Video Monitors */}
        <div className="xl:col-span-2 space-y-4">
          {/* Stream Mode Switcher */}
          <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-2 rounded-xl text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                1080p 60FPS • H.265 AES-256
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300 font-mono">
                GPS: {activeVehicle.gpsLocation}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveCamTab("dual")}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  activeCamTab === "dual" ? "bg-slate-700 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                {language === "ar" ? "شاشة مزدوجة" : "Dual View"}
              </button>
              <button
                onClick={() => setActiveCamTab("road")}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  activeCamTab === "road" ? "bg-slate-700 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                {language === "ar" ? "كاميرا الطريق" : "Front Road"}
              </button>
              <button
                onClick={() => setActiveCamTab("cabin")}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  activeCamTab === "cabin" ? "bg-slate-700 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                {language === "ar" ? "مقصورة السائق" : "Cabin Interior"}
              </button>
            </div>
          </div>

          {/* Camera Viewports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Camera 1: Road-Facing Front Cam */}
            {(activeCamTab === "dual" || activeCamTab === "road") && (
              <div className={`relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-md ${activeCamTab === "road" ? "md:col-span-2 h-96" : "h-80"}`}>
                {/* Simulated Road Horizon & Lane Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-950 via-slate-900 to-slate-950 flex items-center justify-center">
                  <div className="w-full h-full relative overflow-hidden flex flex-col justify-between p-4">
                    {/* Road Perspective lines */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400/40 blur-xs" />
                      <div className="absolute top-1/3 bottom-0 left-1/3 w-1 bg-gradient-to-b from-transparent to-emerald-400/60 transform -rotate-12" />
                      <div className="absolute top-1/3 bottom-0 right-1/3 w-1 bg-gradient-to-b from-transparent to-emerald-400/60 transform rotate-12" />
                      <div className="absolute top-1/2 bottom-0 left-1/2 -translate-x-1/2 w-1 border-r-2 border-dashed border-white/40" />
                    </div>

                    {/* AI Bounding Box for Detected Vehicle ahead */}
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/4 border-2 border-emerald-400 bg-emerald-500/10 rounded px-2 py-1 flex flex-col items-center animate-pulse">
                      <span className="text-[10px] text-emerald-300 font-mono font-bold">
                        LEAD VEHICLE [42.5m]
                      </span>
                      <span className="text-[9px] text-slate-300 font-mono">
                        SPD: 70 KM/H | SAFE
                      </span>
                    </div>

                    {/* Top Watermark HUD */}
                    <div className="flex items-center justify-between text-xs z-10">
                      <div className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded text-white font-mono flex items-center gap-2 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="font-bold">CAM-01 [FRONT ROAD]</span>
                      </div>
                      <div className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded text-emerald-400 font-mono text-[11px] border border-white/10">
                        LDWS ACTIVE • FCW READY
                      </div>
                    </div>

                    {/* Bottom Telemetry Overlay */}
                    <div className="flex items-end justify-between z-10">
                      <div className="bg-black/75 backdrop-blur-xs p-2 rounded-lg border border-white/10 text-white text-[11px] font-mono space-y-0.5">
                        <div>PLATE: {activeVehicle.plate}</div>
                        <div>SPEED: <span className="text-amber-400 font-bold">{activeVehicle.speedKmh} KM/H</span></div>
                        <div>ROAD STATUS: <span className="text-emerald-400 font-bold uppercase">{activeVehicle.roadStatus}</span></div>
                      </div>

                      <div className="bg-black/75 backdrop-blur-xs p-2 rounded-lg border border-white/10 text-right text-white text-[11px] font-mono">
                        <div className="text-slate-400">{new Date().toLocaleTimeString()}</div>
                        <div className="text-emerald-400 text-[10px]">AI CRUISE TELEMETRY</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Camera 2: Cabin & Interior Driver/Passenger Cam */}
            {(activeCamTab === "dual" || activeCamTab === "cabin") && (
              <div className={`relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-md ${activeCamTab === "cabin" ? "md:col-span-2 h-96" : "h-80"}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center p-4">
                  <div className="w-full h-full relative overflow-hidden flex flex-col justify-between">
                    {/* Simulated Cabin Silhouette */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                      <div className="w-32 h-44 border-2 border-dashed border-cyan-400/40 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border border-cyan-400/30" />
                      </div>
                    </div>

                    {/* AI Face & Distraction Bounding Box */}
                    <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 border-2 rounded-xl p-2.5 flex flex-col items-center transition-all ${
                      activeVehicle.driverDrowsinessPercent > 50 || activeVehicle.phoneDetected
                        ? "border-red-500 bg-red-950/40 animate-pulse"
                        : "border-cyan-400 bg-cyan-950/30"
                    }`}>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>AI DRIVER GAZE: TRACKING</span>
                      </div>
                      
                      <div className="mt-1 text-[11px] font-mono space-y-0.5 text-center">
                        <div className={`${activeVehicle.driverDrowsinessPercent > 50 ? "text-red-400 font-bold" : "text-emerald-400"}`}>
                          FATIGUE SCORE: {activeVehicle.driverDrowsinessPercent}%
                        </div>
                        {activeVehicle.phoneDetected && (
                          <div className="text-amber-400 font-bold flex items-center gap-1">
                            <Smartphone className="w-3 h-3" /> PHONE IN HAND DETECTED!
                          </div>
                        )}
                        <div className="text-slate-300 text-[10px]">
                          SEATBELT: {activeVehicle.seatbeltFastened ? "FASTENED ✅" : "UNBUCKLED ❌"}
                        </div>
                      </div>
                    </div>

                    {/* Top HUD */}
                    <div className="flex items-center justify-between text-xs z-10">
                      <div className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded text-white font-mono flex items-center gap-2 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="font-bold">CAM-02 [CABIN & DRIVER]</span>
                      </div>
                      <div className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded text-cyan-400 font-mono text-[11px] border border-white/10 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>PAX: {activeVehicle.passengerCount} Persons</span>
                      </div>
                    </div>

                    {/* Bottom HUD info */}
                    <div className="flex items-end justify-between z-10">
                      <div className="bg-black/75 backdrop-blur-xs p-2 rounded-lg border border-white/10 text-white text-[11px] font-mono space-y-0.5">
                        <div>DRIVER: {activeVehicle.driverName}</div>
                        <div>CABIN STATUS: <span className={activeVehicle.cabinStatus === "alert" ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>{activeVehicle.cabinStatus.toUpperCase()}</span></div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handleCaptureSnapshot}
                          className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-600 transition-colors flex items-center gap-1 font-mono cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>HD SNAP</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Voice Intercom & Cabin Horn Dispatch */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {language === "ar"
                      ? "الموجه الصوتي والميكروفون المباشر للمقصورة (Push to Talk)"
                      : language === "fr"
                      ? "Interphone & Diffusion Vocale Cabine Directe"
                      : "Direct Cabin Voice Intercom & Smart Horn Broadcast"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === "ar"
                      ? "إرسال توجيهات صوتية فورية وتنبيهات أمان مباشرة إلى سماعات سيارة السائق"
                      : "Broadcast instantaneous spoken safety alerts directly to the driver's cabin audio"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsIntercomActive(!isIntercomActive)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isIntercomActive
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {isIntercomActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span>{isIntercomActive ? (language === "ar" ? "الميكروفون نشط" : "Live Mic ON") : (language === "ar" ? "فتح الميكروفون" : "Open Mic")}</span>
              </button>
            </div>

            {/* Quick Preset Voice Alert Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() =>
                  handleSendVoiceAlert(
                    language === "ar"
                      ? "تنبيه: يرجى الانتباه للطريق وتجنب استخدام الهاتف!"
                      : "Attention: please keep eyes on road and avoid phone use!"
                  )
                }
                className="p-2 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{language === "ar" ? "تنبيه الهاتف والتركيز" : "Phone Warning"}</span>
              </button>

              <button
                onClick={() =>
                  handleSendVoiceAlert(
                    language === "ar"
                      ? "تنبيه إرهاق: مؤشرات التعب مرتفعة، يرجى أخذ استراحة في أقرب محطة!"
                      : "Fatigue alert: high drowsiness score, please rest at next station!"
                  )
                }
                className="p-2 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800/50 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-red-600 shrink-0" />
                <span>{language === "ar" ? "تنبيه النعاس والاستراحة" : "Drowsiness Alert"}</span>
              </button>

              <button
                onClick={() =>
                  handleSendVoiceAlert(
                    language === "ar"
                      ? "يرجى تخفيض السرعة والالتزام بالسرعة القانونية 80 كم/سا"
                      : "Please reduce speed and respect 80 km/h limit"
                  )
                }
                className="p-2 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{language === "ar" ? "تنبيه تخفيف السرعة" : "Speed Reminder"}</span>
              </button>

              <button
                onClick={() =>
                  handleSendVoiceAlert(
                    language === "ar"
                      ? "مرحباً بكم مع MAEK7-TAXI، نتمنى لكم رحلة آمنة ومريحة"
                      : "Welcome to MAEK7-TAXI, wishing you a safe pleasant trip"
                  )
                }
                className="p-2 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === "ar" ? "تحية الركاب الآلية" : "Welcome PAX"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Telemetry Panel & Live Incident Stream */}
        <div className="space-y-4">
          {/* Driver & Telemetry Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              {language === "ar" ? "المؤشرات الحيوية للسائق والمقصورة" : "Driver Telematics & Vital Stats"}
            </h3>

            <div className="space-y-3">
              {/* Driver name & plate */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {language === "ar" ? "السائق:" : "Driver:"}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {activeVehicle.driverName}
                </span>
              </div>

              {/* Drowsiness meter bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-cyan-600" />
                    {language === "ar" ? "مؤشر النعاس وإغماض العين:" : "Drowsiness Index:"}
                  </span>
                  <span className={`font-mono font-bold ${
                    activeVehicle.driverDrowsinessPercent > 50 ? "text-red-500" : "text-emerald-500"
                  }`}>
                    {activeVehicle.driverDrowsinessPercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      activeVehicle.driverDrowsinessPercent > 50
                        ? "bg-red-500"
                        : activeVehicle.driverDrowsinessPercent > 25
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${activeVehicle.driverDrowsinessPercent}%` }}
                  />
                </div>
              </div>

              {/* Distraction status */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-slate-500" />
                  {language === "ar" ? "رصد استخدام الهاتف:" : "Phone Distraction:"}
                </span>
                <span className={`px-2 py-0.5 rounded font-semibold ${
                  activeVehicle.phoneDetected
                    ? "bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300"
                    : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300"
                }`}>
                  {activeVehicle.phoneDetected
                    ? (language === "ar" ? "مرصود ⚠️" : "Detected ⚠️")
                    : (language === "ar" ? "آمن ومطابق ✅" : "Clear ✅")}
                </span>
              </div>

              {/* Seatbelt check */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  {language === "ar" ? "حزام الأمان:" : "Seatbelt Fastened:"}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {activeVehicle.seatbeltFastened ? (language === "ar" ? "مربوط ✅" : "Fastened ✅") : "Unbuckled ❌"}
                </span>
              </div>

              {/* Location */}
              <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span>{activeVehicle.gpsLocation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Cloud Log */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                {language === "ar" ? "سجل الحوادث والتسجيلات" : "Safety Cloud Event Log"}
              </h3>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIncidentFilter("all")}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                    incidentFilter === "all" ? "bg-slate-900 text-white dark:bg-emerald-600" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {language === "ar" ? "الكل" : "All"}
                </button>
                <button
                  onClick={() => setIncidentFilter("unresolved")}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                    incidentFilter === "unresolved" ? "bg-slate-900 text-white dark:bg-emerald-600" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {language === "ar" ? "قيد المتابعة" : "Open"}
                </button>
              </div>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {filteredIncidents.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  {language === "ar" ? "لا توجد حوادث مسجلة حالياً." : "No incidents reported."}
                </div>
              ) : (
                filteredIncidents.map((inc) => {
                  const isCritical = inc.severity === "critical";

                  return (
                    <div
                      key={inc.id}
                      className={`p-3 rounded-xl border text-xs transition-all ${
                        isCritical
                          ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50"
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {inc.vehiclePlate}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {inc.timestamp.slice(11)}
                        </span>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 text-[11px] mb-2 leading-relaxed">
                        {inc.details}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {inc.cameraSource === "cabin" ? (language === "ar" ? "كاميرا المقصورة" : "Cabin Cam") : (language === "ar" ? "كاميرا الطريق" : "Road Cam")}
                        </span>

                        {!inc.resolved ? (
                          <button
                            onClick={() => handleResolveIncident(inc.id)}
                            className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>{language === "ar" ? "تأكيد المعالجة" : "Mark Resolved"}</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>{language === "ar" ? "تمت المعالجة" : "Resolved"}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
