import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Sparkles,
  Sliders,
  Layers,
  CheckCircle2,
  Download,
  QrCode,
  Printer,
  Share2,
  Copy,
  ExternalLink,
  Car,
  User,
  Phone,
  MessageCircle,
  MapPin,
  Compass,
  Zap,
  Shield,
  ShieldCheck,
  Award,
  Clock,
  Radio,
  Palette,
  Image,
  DollarSign,
  CreditCard,
  Building,
  Check,
  AlertCircle,
  Eye,
  Navigation,
  Globe,
  RefreshCw,
  Video,
} from "lucide-react";
import {
  Language,
  PresetTemplate,
  FeatureModules,
  FleetOwnerAppConfig,
  AppThemeColor,
  LogoEmblemType,
  ClientTenantConfig,
} from "../types";
import { translations } from "../i18n/translations";
import { algerianWilayasList } from "../data/mockData";

interface AppGeneratorViewProps {
  currentLang: Language;
  activeTemplate: PresetTemplate;
  featureFlags: FeatureModules;
  activeTenant?: ClientTenantConfig;
  institutionName: string;
  supervisorName: string;
  onNavigateTab: (tabId: string) => void;
  onSaveAppConfig?: (config: FleetOwnerAppConfig) => void;
}

export const AppGeneratorView: React.FC<AppGeneratorViewProps> = ({
  currentLang,
  activeTemplate,
  featureFlags,
  activeTenant,
  institutionName,
  supervisorName,
  onNavigateTab,
  onSaveAppConfig,
}) => {
  const t = translations[currentLang];

  // App Identity State
  const [appName, setAppName] = useState(
    activeTenant ? `تطبيق ${activeTenant.companyName}` : "تطبيق تاكسي العاصمة الذكي"
  );
  const [companyName, setCompanyName] = useState(
    activeTenant ? activeTenant.companyName : institutionName || "مؤسسة تسيير أساطيل النقل"
  );
  const [ownerName, setOwnerName] = useState(
    activeTenant ? activeTenant.clientName : supervisorName || "المدير العام للنقل"
  );
  const [tagline, setTagline] = useState(
    currentLang === "ar"
      ? "رحلاتك اليومية بأمان وراحة في كل مكان"
      : "Your daily trusted journeys with safety and comfort"
  );
  const [contactPhone, setContactPhone] = useState(
    activeTenant?.contactPhone || "0550 12 34 56"
  );
  const [dispatchWhatsApp, setDispatchWhatsApp] = useState(
    activeTenant?.contactPhone?.replace(/[^0-9]/g, "") || "213550123456"
  );
  const [selectedWilaya, setSelectedWilaya] = useState(activeTenant?.wilayaCode || "16");
  const [selectedCommune, setSelectedCommune] = useState(
    activeTenant?.municipality || "الجزائر الوسطى"
  );

  // Styling & Branding State
  const [themeColor, setThemeColor] = useState<AppThemeColor>("amber");
  const [logoType, setLogoType] = useState<LogoEmblemType>("classic_taxi");

  // Pricing State
  const [baseFareDzd, setBaseFareDzd] = useState(250);
  const [perKmRateDzd, setPerKmRateDzd] = useState(45);
  const [allowCash, setAllowCash] = useState(true);
  const [allowCard, setAllowCard] = useState(true);
  const [allowBaridiMob, setAllowBaridiMob] = useState(true);

  // Simulator State
  const [simMode, setSimMode] = useState<"passenger" | "driver" | "owner">("passenger");
  const [simPickup, setSimPickup] = useState("المطار الدولي هواري بومدين");
  const [simDropoff, setSimDropoff] = useState("وسط المدينة — ساحة الشهداء");
  const [simSelectedVehicleTier, setSimSelectedVehicleTier] = useState<"standard" | "vip" | "group">("standard");
  const [simDriverOnline, setSimDriverOnline] = useState(true);
  const [simTaximeterRunning, setSimTaximeterRunning] = useState(false);
  const [simTaximeterAmount, setSimTaximeterAmount] = useState(380);

  // Status & Notification Toasts
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isGeneratingApk, setIsGeneratingApk] = useState(false);
  const [isInstallingPwa, setIsInstallingPwa] = useState(false);
  const [isPrintingSticker, setIsPrintingSticker] = useState(false);

  // Sync with activeTenant if changed
  useEffect(() => {
    if (activeTenant) {
      setCompanyName(activeTenant.companyName);
      setOwnerName(activeTenant.clientName);
      setAppName(`تطبيق ${activeTenant.companyName}`);
      if (activeTenant.contactPhone) setContactPhone(activeTenant.contactPhone);
      if (activeTenant.wilayaCode) setSelectedWilaya(activeTenant.wilayaCode);
      if (activeTenant.municipality) setSelectedCommune(activeTenant.municipality);
    }
  }, [activeTenant?.tenantId]);

  // Taximeter interval simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (simTaximeterRunning) {
      timer = setInterval(() => {
        setSimTaximeterAmount((prev) => prev + 15);
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [simTaximeterRunning]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Color Theme Presets
  const themePresets: {
    id: AppThemeColor;
    name: { ar: string; en: string; fr: string };
    bgGradient: string;
    primaryClass: string;
    borderClass: string;
    textClass: string;
    hexCode: string;
  }[] = [
    {
      id: "amber",
      name: { ar: "الأصفر الذهبي الكلاسيكي", en: "Classic Taxi Amber", fr: "Ambre Taxi Classique" },
      bgGradient: "from-amber-500 to-amber-600",
      primaryClass: "bg-amber-500 text-slate-950",
      borderClass: "border-amber-500",
      textClass: "text-amber-400",
      hexCode: "#F59E0B",
    },
    {
      id: "emerald",
      name: { ar: "الأخضر الملكي / البيئي", en: "Royal Emerald Green", fr: "Émeraude Royale" },
      bgGradient: "from-emerald-500 to-emerald-700",
      primaryClass: "bg-emerald-600 text-white",
      borderClass: "border-emerald-500",
      textClass: "text-emerald-400",
      hexCode: "#10B981",
    },
    {
      id: "indigo",
      name: { ar: "الأزرق النيلي الذكي", en: "Electric Indigo Tech", fr: "Indigo Électrique" },
      bgGradient: "from-indigo-600 to-indigo-800",
      primaryClass: "bg-indigo-600 text-white",
      borderClass: "border-indigo-500",
      textClass: "text-indigo-400",
      hexCode: "#6366F1",
    },
    {
      id: "gold",
      name: { ar: "الذهبي الفاخر VIP", en: "Luxury VIP Gold", fr: "Or Luxueux VIP" },
      bgGradient: "from-yellow-400 via-amber-500 to-yellow-600",
      primaryClass: "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black",
      borderClass: "border-amber-400",
      textClass: "text-yellow-300",
      hexCode: "#EAB308",
    },
    {
      id: "cyan",
      name: { ar: "السماوي الحديث", en: "Cyber Cyan", fr: "Cyan Cybernétique" },
      bgGradient: "from-cyan-500 to-blue-600",
      primaryClass: "bg-cyan-500 text-slate-950 font-bold",
      borderClass: "border-cyan-400",
      textClass: "text-cyan-400",
      hexCode: "#06B6D4",
    },
    {
      id: "rose",
      name: { ar: "العنابي الرياضي", en: "Dynamic Crimson Red", fr: "Rouge Cramoisi" },
      bgGradient: "from-rose-600 to-red-700",
      primaryClass: "bg-rose-600 text-white",
      borderClass: "border-rose-500",
      textClass: "text-rose-400",
      hexCode: "#E11D48",
    },
    {
      id: "violet",
      name: { ar: "البنفسجي الإمبراطوري", en: "Imperial Violet", fr: "Violet Impérial" },
      bgGradient: "from-purple-600 to-violet-800",
      primaryClass: "bg-violet-600 text-white",
      borderClass: "border-violet-500",
      textClass: "text-violet-400",
      hexCode: "#8B5CF6",
    },
    {
      id: "dark",
      name: { ar: "الأسود الفخم (Onyx)", en: "Luxury Onyx Black", fr: "Noir Onyx Luxueux" },
      bgGradient: "from-slate-800 to-slate-950",
      primaryClass: "bg-slate-800 text-amber-300 border border-amber-400/40",
      borderClass: "border-slate-700",
      textClass: "text-slate-200",
      hexCode: "#0F172A",
    },
  ];

  const currentThemeObj =
    themePresets.find((tp) => tp.id === themeColor) || themePresets[0];

  // Logo Presets
  const logoPresets: {
    id: LogoEmblemType;
    title: { ar: string; en: string; fr: string };
    icon: React.ReactNode;
    subtitle: string;
  }[] = [
    {
      id: "classic_taxi",
      title: { ar: "شعار الطاكسي الكلاسيكي", en: "Classic Taxi Emblem", fr: "Emblème Taxi Classique" },
      icon: <Car className="w-6 h-6 text-amber-400" />,
      subtitle: "TAXI VIP • 58 WILAYAS",
    },
    {
      id: "modern_speed",
      title: { ar: "أسطول السرعة الحديث", en: "Speed Fleet Pro", fr: "Flotte Rapide Pro" },
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      subtitle: "SPEED & RELIABILITY",
    },
    {
      id: "vip_chauffeur",
      title: { ar: "سائق خاص ورجال أعمال", en: "VIP Executive Chauffeur", fr: "Chauffeur Privé VIP" },
      icon: <ShieldCheck className="w-6 h-6 text-yellow-300" />,
      subtitle: "EXECUTIVE LUXURY RIDE",
    },
    {
      id: "eco_hybrid",
      title: { ar: "النقل الأخضر والمستدام", en: "Green Eco Hybrid", fr: "Transport Écologique" },
      icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
      subtitle: "HYBRID & ECO TRANSIT",
    },
    {
      id: "sahara_express",
      title: { ar: "إكسبريس بين الولايات", en: "Intercity Highway Express", fr: "Express Inter-Wilayas" },
      icon: <Compass className="w-6 h-6 text-amber-500" />,
      subtitle: "TRANS-ALGERIE EXPEDITION",
    },
    {
      id: "metro_transit",
      title: { ar: "شبكة النقل الحضري", en: "Urban Metro Transit", fr: "Réseau Urbain Métro" },
      icon: <Navigation className="w-6 h-6 text-indigo-400" />,
      subtitle: "CITY DISPATCH HUB",
    },
  ];

  const currentLogoObj =
    logoPresets.find((l) => l.id === logoType) || logoPresets[0];

  // Calculated Trip Fare for Simulator
  const simulatedDistanceKm = 14.5;
  const simulatedFare = Math.round(
    baseFareDzd +
      simulatedDistanceKm * perKmRateDzd * (simSelectedVehicleTier === "vip" ? 1.8 : simSelectedVehicleTier === "group" ? 1.4 : 1.0)
  );

  const handleSaveAndSync = () => {
    const config: FleetOwnerAppConfig = {
      appId: `APP-${activeTenant?.tenantId || "MAEK7"}-${Date.now().toString().slice(-4)}`,
      tenantId: activeTenant?.tenantId || "TNT-DEFAULT",
      appName,
      companyName,
      ownerName,
      tagline,
      contactPhone,
      dispatchWhatsApp,
      wilaya: selectedWilaya,
      wilayaCode: selectedWilaya,
      commune: selectedCommune,
      themeColor,
      logoType,
      selectedTemplateId: activeTemplate.id,
      enabledModules: { ...featureFlags },
      passengerAppEnabled: true,
      driverAppEnabled: true,
      dispatcherWebEnabled: true,
      allowCashPayment: allowCash,
      allowCardPayment: allowCard,
      allowBaridiMob: allowBaridiMob,
      baseFareDzd,
      perKmRateDzd,
      pwaShortName: appName.slice(0, 12),
      appVersion: "v2.4.0-Enterprise",
      customSubdomain: companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      generatedAt: new Date().toISOString(),
    };

    onSaveAppConfig?.(config);
    showToast(
      currentLang === "ar"
        ? `✅ تم توليد وتحديث تطبيق (${appName}) بنجاح وربطه بقالب المنصة (${activeTemplate.name[currentLang]})!`
        : `✅ App (${appName}) generated and synced with platform template (${activeTemplate.name[currentLang]})!`
    );
  };

  const handleGenerateApk = () => {
    setIsGeneratingApk(true);
    setTimeout(() => {
      setIsGeneratingApk(false);
      // Simulate downloading the APK package manifest
      const apkData = {
        appPackage: `com.maek7.fleet.${companyName.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
        appName,
        companyName,
        ownerName,
        version: "2.4.0",
        template: activeTemplate.name[currentLang],
        themeColor: currentThemeObj.hexCode,
        permissions: ["ACCESS_FINE_LOCATION", "CAMERA", "INTERNET", "WAKE_LOCK", "READ_PHONE_STATE"],
        modules: featureFlags,
      };
      const blob = new Blob([JSON.stringify(apkData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${companyName.replace(/\s+/g, "_")}_DriverPassengerApp_v2.4.apk.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(
        currentLang === "ar"
          ? `📲 تم بناء وتحميل حزمة أندرويد APK المخصصة لـ (${companyName}) بنجاح!`
          : `📲 Custom Android APK package for (${companyName}) compiled and downloaded!`
      );
    }, 1800);
  };

  const handleInstallPwa = () => {
    setIsInstallingPwa(true);
    setTimeout(() => {
      setIsInstallingPwa(false);
      showToast(
        currentLang === "ar"
          ? `🌐 تطبيق الويب التقدمي (PWA) جاهز ومتاح للتثبيت برابط مباشر للمسافرين والسائقين!`
          : `🌐 Progressive Web App (PWA) is ready and installable via direct link!`
      );
    }, 1200);
  };

  const handlePrintSticker = () => {
    setIsPrintingSticker(true);
    setTimeout(() => {
      setIsPrintingSticker(false);
      window.print();
    }, 600);
  };

  const handleCopyShareLink = () => {
    const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const link = `https://${slug || "taxi"}.maek7.dz/app`;
    navigator.clipboard.writeText(link);
    showToast(
      currentLang === "ar"
        ? `🔗 تم نسخ رابط التطبيق المباشر: ${link}`
        : `🔗 App direct link copied: ${link}`
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 animate-fade-in">
      {/* Floating Success Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-slate-900/95 border border-emerald-500/50 text-emerald-300 font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-3 backdrop-blur-md animate-bounce">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black flex items-center gap-1.5 shadow-xs">
                <Sparkles size={14} className="text-amber-400 animate-pulse" />
                <span>{currentLang === "ar" ? "استوديو العلامة التجارية والتطبيقات" : "White-Label App Studio"}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold font-mono">
                APK & PWA Generator v2.4
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {t.appGenTitle}
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {t.appGenSubtitle}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveAndSync}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <CheckCircle2 size={16} />
              <span>{t.appGenSaveAndUpdate}</span>
            </button>

            <button
              onClick={() => onNavigateTab("templates")}
              className="px-4 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Sliders size={16} className="text-amber-400" />
              <span>{currentLang === "ar" ? "تغيير قالب المنصة" : "Change Template"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Active Template Status Indicator */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Layers size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">{t.appGenActiveTemplate}:</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs">
                  {activeTemplate.name[currentLang]} ({activeTemplate.badge})
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {t.appGenTemplateNote}
              </p>
            </div>
          </div>

          {/* Active Template Capabilities Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {featureFlags.liveRadar && (
              <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                <Radio size={11} />
                <span>GPS Radar</span>
              </span>
            )}
            {featureFlags.dashcamSurveillance && (
              <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold flex items-center gap-1">
                <Video size={11} />
                <span>Dashcam AI</span>
              </span>
            )}
            {featureFlags.aiAgent && (
              <span className="px-2 py-1 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[10px] font-bold flex items-center gap-1">
                <Sparkles size={11} />
                <span>AI Copilot</span>
              </span>
            )}
            {featureFlags.whatsAppGateway && (
              <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                <MessageCircle size={11} />
                <span>WhatsApp</span>
              </span>
            )}
            {featureFlags.driverKpi && (
              <span className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold flex items-center gap-1">
                <Award size={11} />
                <span>Driver KPI</span>
              </span>
            )}
            {featureFlags.vipTier && (
              <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck size={11} />
                <span>VIP Limo</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Customizer Controls (Left/Start) & Interactive Mobile Simulator (Right/End) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Fleet Owner Identity Customization (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Fleet Owner & Company Identity */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-lg">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Building size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-white">{t.appGenBrandingSection}</h3>
                <p className="text-xs text-slate-400">
                  {currentLang === "ar"
                    ? "تحديد اسم المؤسسة، اسم صاحب الحظيرة، الشعار والعلامة التجارية التي ستظهر في التطبيق"
                    : "Configure company name, fleet owner name, logo emblem and brand slogan."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  {t.appGenOwnerName}
                </label>
                <div className="relative">
                  <User className="absolute rtl:right-3 ltr:left-3 top-3 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 text-xs sm:text-sm text-white font-semibold focus:border-amber-500 focus:outline-none"
                    placeholder="مثال: عبد القادر مويسات"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  {t.appGenCompanyName}
                </label>
                <div className="relative">
                  <Building className="absolute rtl:right-3 ltr:left-3 top-3 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 text-xs sm:text-sm text-white font-semibold focus:border-amber-500 focus:outline-none"
                    placeholder="مثال: مؤسسة الرمال الذهبية للتاكسي والنقل"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  {t.appGenAppName}
                </label>
                <div className="relative">
                  <Smartphone className="absolute rtl:right-3 ltr:left-3 top-3 text-amber-400 w-4 h-4" />
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 text-xs sm:text-sm text-amber-300 font-bold focus:border-amber-500 focus:outline-none"
                    placeholder="مثال: طاكسي الرمال الذهبية"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  {t.appGenTagline}
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  placeholder="مثال: رحلاتك اليومية بأمان وراحة في 58 ولاية"
                />
              </div>
            </div>

            {/* Logo Emblem Selection Grid */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-300">
                {t.appGenLogoSelection}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {logoPresets.map((preset) => {
                  const isSelected = logoType === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setLogoType(preset.id)}
                      className={`p-3 rounded-2xl border text-start transition flex flex-col items-center text-center gap-2 cursor-pointer ${
                        isSelected
                          ? "bg-slate-800 border-amber-400 shadow-md ring-2 ring-amber-400/40"
                          : "bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600"
                      }`}
                    >
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700">
                        {preset.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {preset.title[currentLang]}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {preset.subtitle}
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-amber-400">✓ {currentLang === "ar" ? "مختار" : "Selected"}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Colors Palette */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-300">
                {t.appGenThemeColor}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {themePresets.map((colorPreset) => {
                  const isSelected = themeColor === colorPreset.id;
                  return (
                    <button
                      key={colorPreset.id}
                      type="button"
                      onClick={() => setThemeColor(colorPreset.id)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition cursor-pointer ${
                        isSelected
                          ? "bg-slate-800 border-amber-400 ring-2 ring-amber-400/40"
                          : "bg-slate-800/60 border-slate-700 hover:bg-slate-800"
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full shrink-0 shadow-sm border border-white/20"
                        style={{ backgroundColor: colorPreset.hexCode }}
                      />
                      <span className="text-[11px] font-bold text-slate-200 truncate">
                        {colorPreset.name[currentLang]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Contact, Dispatch & Wilaya */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-white">{t.appGenContactInfo}</h3>
                <p className="text-xs text-slate-400">
                  {currentLang === "ar"
                    ? "أرقام الحجز السريع المباشر وزر واتساب التلقائي للزبائن داخل التطبيق"
                    : "Direct call center phone and fast WhatsApp booking integration."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  {t.appGenPhone}
                </label>
                <div className="relative">
                  <Phone className="absolute rtl:right-3 ltr:left-3 top-3 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 text-xs sm:text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                    placeholder="0550 12 34 56"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  {t.appGenWhatsApp}
                </label>
                <div className="relative">
                  <MessageCircle className="absolute rtl:right-3 ltr:left-3 top-3 text-emerald-400 w-4 h-4" />
                  <input
                    type="text"
                    value={dispatchWhatsApp}
                    onChange={(e) => setDispatchWhatsApp(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 text-xs sm:text-sm text-emerald-300 font-mono focus:border-emerald-500 focus:outline-none"
                    placeholder="213550123456"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  {currentLang === "ar" ? "الولاية الرئيسية للخدمة" : "Main Service Wilaya"}
                </label>
                <select
                  value={selectedWilaya}
                  onChange={(e) => {
                    setSelectedWilaya(e.target.value);
                    const found = algerianWilayasList.find((w) => w.code === e.target.value);
                    if (found && found.communes.length > 0) {
                      setSelectedCommune(found.communes[0]);
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  {algerianWilayasList.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code} — {w.arabicName} ({w.latinName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  {currentLang === "ar" ? "البلدية أو المركز الرئيسي" : "Municipality / Base Hub"}
                </label>
                <input
                  type="text"
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                  placeholder="الجزائر الوسطى"
                />
              </div>
            </div>
          </div>

          {/* Section 3: In-App Fare Meter & Payment Options */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <DollarSign size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-white">{t.appGenPricing}</h3>
                <p className="text-xs text-slate-400">
                  {currentLang === "ar"
                    ? "تحديد سعر فتح العداد وسعر الكيلومتر المعتمد في التطبيق لحساب تكلفة المشاوير تلقائياً"
                    : "Configure in-app taximeter flag drop and per-kilometer rates for automatic fare calculation."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  {t.appGenBaseFare}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={baseFareDzd}
                    onChange={(e) => setBaseFareDzd(Number(e.target.value))}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-white font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                  <span className="absolute rtl:left-3 ltr:right-3 top-2.5 text-xs text-amber-400 font-bold">
                    {t.currency}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  {t.appGenPerKmRate}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={perKmRateDzd}
                    onChange={(e) => setPerKmRateDzd(Number(e.target.value))}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-white font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                  <span className="absolute rtl:left-3 ltr:right-3 top-2.5 text-xs text-cyan-400 font-bold">
                    {t.currency} / كم
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods Accepted */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                {currentLang === "ar" ? "طرق الدفع المفعلة داخل التطبيق:" : "Accepted In-App Payment Methods:"}
              </label>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setAllowCash(!allowCash)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    allowCash
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-slate-800 text-slate-500 border-slate-700"
                  }`}
                >
                  <Check size={13} />
                  <span>{currentLang === "ar" ? "الدفع نقداً عند الوصول" : "Cash on Arrival"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAllowBaridiMob(!allowBaridiMob)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    allowBaridiMob
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-800 text-slate-500 border-slate-700"
                  }`}
                >
                  <Check size={13} />
                  <span>{currentLang === "ar" ? "بريدي موب (BaridiMob Rip)" : "BaridiMob"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAllowCard(!allowCard)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    allowCard
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                      : "bg-slate-800 text-slate-500 border-slate-700"
                  }`}
                >
                  <Check size={13} />
                  <span>{currentLang === "ar" ? "البطاقة الذهبية / CIB" : "Edahabia / CIB"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3-in-1 Interactive Smartphone Mockup Simulator (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl sticky top-20">
            {/* Simulator Mode Switcher Tabs */}
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Smartphone size={16} className="text-amber-400" />
                <span>{t.appGenSimulatorTitle}</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSimMode("passenger")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    simMode === "passenger"
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {currentLang === "ar" ? "الراكب" : "Client"}
                </button>
                <button
                  type="button"
                  onClick={() => setSimMode("driver")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    simMode === "driver"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {currentLang === "ar" ? "السائق" : "Driver"}
                </button>
                <button
                  type="button"
                  onClick={() => setSimMode("owner")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    simMode === "owner"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {currentLang === "ar" ? "المدير" : "Owner"}
                </button>
              </div>
            </div>

            {/* Realistic Smartphone Frame Mockup */}
            <div className="mt-4 mx-auto max-w-[340px] bg-slate-950 border-[6px] border-slate-800 rounded-[38px] overflow-hidden shadow-2xl relative min-h-[580px] flex flex-col justify-between">
              {/* Phone Speaker & Dynamic Island Notch */}
              <div className="pt-2 px-6 flex items-center justify-between text-[10px] text-slate-400 select-none bg-slate-950">
                <span>09:41</span>
                <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-950 border border-slate-800" />
                </div>
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Mobile Screen App Content */}
              <div className="flex-1 p-3.5 flex flex-col justify-between overflow-y-auto custom-scrollbar bg-slate-900/60">
                {/* 1. PASSENGER APP MODE */}
                {simMode === "passenger" && (
                  <div className="space-y-3.5">
                    {/* Passenger App Branded Header */}
                    <div
                      className={`p-3 rounded-2xl shadow-md text-white flex items-center justify-between ${currentThemeObj.bgGradient}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-950/80 flex items-center justify-center shadow-inner">
                          {currentLogoObj.icon}
                        </div>
                        <div>
                          <div className="text-xs font-black leading-tight text-white drop-shadow-xs">
                            {appName || "MAEK7 TAXI"}
                          </div>
                          <div className="text-[9px] text-slate-100 opacity-90 truncate max-w-[140px]">
                            {companyName || "مؤسسة النقل"}
                          </div>
                        </div>
                      </div>
                      <div className="px-2 py-0.5 rounded-full bg-slate-950/60 text-[9px] font-bold text-amber-300 border border-white/20">
                        {activeTemplate.badge}
                      </div>
                    </div>

                    {/* Booking Route Inputs */}
                    <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-2 shadow-inner">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <input
                          type="text"
                          value={simPickup}
                          onChange={(e) => setSimPickup(e.target.value)}
                          className="bg-transparent text-[11px] text-white font-semibold w-full focus:outline-none"
                          placeholder="موقع الانطلاق..."
                        />
                      </div>
                      <div className="border-t border-slate-800/80 my-1" />
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-400" />
                        <input
                          type="text"
                          value={simDropoff}
                          onChange={(e) => setSimDropoff(e.target.value)}
                          className="bg-transparent text-[11px] text-white font-semibold w-full focus:outline-none"
                          placeholder="وجهة الوصول..."
                        />
                      </div>
                    </div>

                    {/* Vehicle Tier Selection */}
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSimSelectedVehicleTier("standard")}
                        className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                          simSelectedVehicleTier === "standard"
                            ? "bg-slate-800 border-amber-400 text-white"
                            : "bg-slate-950/60 border-slate-800 text-slate-400"
                        }`}
                      >
                        <Car className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                        <div className="text-[10px] font-bold">عادي</div>
                        <div className="text-[9px] text-amber-300 font-mono font-black">
                          {simulatedFare} دج
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSimSelectedVehicleTier("vip")}
                        className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                          simSelectedVehicleTier === "vip"
                            ? "bg-slate-800 border-amber-400 text-white"
                            : "bg-slate-950/60 border-slate-800 text-slate-400"
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-yellow-300" />
                        <div className="text-[10px] font-bold">VIP فاخر</div>
                        <div className="text-[9px] text-amber-300 font-mono font-black">
                          {Math.round(simulatedFare * 1.8)} دج
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSimSelectedVehicleTier("group")}
                        className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                          simSelectedVehicleTier === "group"
                            ? "bg-slate-800 border-amber-400 text-white"
                            : "bg-slate-950/60 border-slate-800 text-slate-400"
                        }`}
                      >
                        <Navigation className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                        <div className="text-[10px] font-bold">جماعي</div>
                        <div className="text-[9px] text-amber-300 font-mono font-black">
                          {Math.round(simulatedFare * 1.4)} دج
                        </div>
                      </button>
                    </div>

                    {/* Simulated Nearby Driver Card */}
                    <div className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                          🚗
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-white">أمين بن علي (Amine)</div>
                          <div className="text-[9px] text-slate-400">01234-116-16 • وصول خلال 4 د</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400">⭐ 4.9</span>
                    </div>

                    {/* Passenger Action CTA Buttons */}
                    <div className="space-y-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          showToast(
                            currentLang === "ar"
                              ? `🚕 تم إرسال طلب المشوار لسائق (${companyName}) بنجاح!`
                              : `🚕 Ride request dispatched to (${companyName}) driver!`
                          )
                        }
                        className={`w-full py-2.5 rounded-xl font-black text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${currentThemeObj.primaryClass}`}
                      >
                        <Zap size={14} />
                        <span>طلب فوري ({simulatedFare} دج)</span>
                      </button>

                      <a
                        href={`https://wa.me/${dispatchWhatsApp}?text=${encodeURIComponent(
                          `السلام عليكم، أريد حجز سيارة عبر تطبيق ${appName} من ${simPickup} إلى ${simDropoff}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageCircle size={13} />
                        <span>حجز سريع عبر واتساب المؤسسة</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* 2. DRIVER APP MODE */}
                {simMode === "driver" && (
                  <div className="space-y-3.5">
                    {/* Driver Shift Banner */}
                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                          👨‍✈️
                        </div>
                        <div>
                          <div className="text-xs font-black text-white">الكابتن: أمين بن علي</div>
                          <div className="text-[10px] text-slate-400 font-mono">01234-116-16</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSimDriverOnline(!simDriverOnline)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                          simDriverOnline
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {simDriverOnline ? "متصل (متاح)" : "غير متاح"}
                      </button>
                    </div>

                    {/* In-App Taximeter Tool */}
                    <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-amber-500/40 p-3.5 rounded-2xl text-center space-y-2 shadow-lg">
                      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                        <DollarSign size={12} />
                        <span>العداد الرقمي المعتمد لـ ({appName})</span>
                      </div>

                      <div className="text-2xl font-black font-mono text-white tracking-tight">
                        {simTaximeterAmount} <span className="text-xs text-amber-400">دج</span>
                      </div>

                      <div className="text-[10px] text-slate-400 flex items-center justify-center gap-3">
                        <span>المسافة: 8.4 كم</span>
                        <span>الوقت: 14 د</span>
                      </div>

                      <div className="flex items-center justify-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setSimTaximeterRunning(!simTaximeterRunning)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            simTaximeterRunning
                              ? "bg-rose-600 hover:bg-rose-700 text-white"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white"
                          }`}
                        >
                          {simTaximeterRunning ? "إيقاف مؤقت" : "بدء العداد"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSimTaximeterAmount(baseFareDzd)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                        >
                          تصفير
                        </button>
                      </div>
                    </div>

                    {/* AI Dashcam Safety Indicator Badge */}
                    {featureFlags.dashcamSurveillance && (
                      <div className="bg-slate-950 border border-slate-800 p-2 rounded-xl flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Video size={12} className="text-red-400 animate-pulse" />
                          <span>كاميرا المقصورة الذكية</span>
                        </span>
                        <span className="text-emerald-400 font-bold">اليقظة: 98% (ممتازة)</span>
                      </div>
                    )}

                    {/* Incoming Trip Dispatch Simulation */}
                    <div className="bg-slate-950/90 border border-indigo-500/40 p-3 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-white">طلب مشوار جديد وارد ⚡</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px]">
                          1850 دج
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-300">
                        من: مطار هواري بومدين → إلى: فندق الأوراسي
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            showToast(currentLang === "ar" ? "✅ قبل السائق المشوار بنجاح!" : "✅ Driver accepted the trip!")
                          }
                          className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                        >
                          قبول (24 ث)
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold"
                        >
                          تخطي
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. FLEET OWNER FAST MOBILE MANAGER */}
                {simMode === "owner" && (
                  <div className="space-y-3.5">
                    {/* Owner Mobile Dashboard Header */}
                    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 border border-indigo-500/40 p-3 rounded-2xl text-white">
                      <div className="text-[10px] text-indigo-300 font-bold uppercase">
                        لوحة المالك السريعة • {ownerName}
                      </div>
                      <div className="text-sm font-black text-white mt-0.5 truncate">
                        {companyName}
                      </div>
                      <div className="text-[10px] text-slate-300 mt-1 font-mono">
                        القالب المعتمد: {activeTemplate.name[currentLang]}
                      </div>
                    </div>

                    {/* Fast KPI Counters */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center">
                        <div className="text-[10px] text-slate-400">إيرادات اليوم</div>
                        <div className="text-sm font-black text-amber-400 font-mono mt-0.5">
                          54,500 دج
                        </div>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center">
                        <div className="text-[10px] text-slate-400">السيارات النشطة</div>
                        <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">
                          12 / 15
                        </div>
                      </div>
                    </div>

                    {/* Quick Live GPS Radar simulation */}
                    <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-white flex items-center gap-1">
                          <Radio size={12} className="text-emerald-400 animate-pulse" />
                          <span>الرادار اللحظي للسيارات</span>
                        </span>
                        <span className="text-[10px] text-slate-400">الجزائر</span>
                      </div>
                      <div className="h-16 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 relative overflow-hidden">
                        <div className="absolute inset-0 bg-radial from-emerald-500/10 to-transparent" />
                        <div className="flex items-center gap-2 z-10">
                          <Car size={14} className="text-amber-400 animate-bounce" />
                          <span className="text-[10px] text-slate-300 font-bold">
                            3 سيارات في رحلات جارية الآن
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Broadcast Button */}
                    <button
                      type="button"
                      onClick={() =>
                        showToast(
                          currentLang === "ar"
                            ? "📢 تم إرسال تنبيه فوري لجميع سائقي الحظيرة!"
                            : "📢 Instant broadcast alert sent to all fleet drivers!"
                        )
                      }
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Zap size={13} />
                      <span>إرسال تعميم فوري للسائقين</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="pb-2 pt-1 flex justify-center bg-slate-950">
                <div className="w-28 h-1 bg-slate-700 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instant Generation & Export Suite (Bottom Section) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-black text-white">{t.appGenBuildSection}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentLang === "ar"
                ? `تصدير تطبيق (${appName}) لحضيرة (${companyName}) بصيغ APK وتطبيقات الويب وملصقات QR للسيارات`
                : `Export (${appName}) for (${companyName}) as Android APK, Web PWA and vehicle QR stickers.`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              ✓ جاهز للتوليد الفوري
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Android APK Package */}
          <div className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl space-y-4 flex flex-col justify-between transition group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Download size={20} />
              </div>
              <h4 className="text-sm font-black text-white">{t.appGenDownloadApk}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentLang === "ar"
                  ? "توليد ملف تثبيت أندرويد جاهز للتحميل والتوزيع على هواتف السائقين والركاب."
                  : "Compile and download standalone Android package for drivers and passengers."}
              </p>
            </div>
            <button
              type="button"
              disabled={isGeneratingApk}
              onClick={handleGenerateApk}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isGeneratingApk ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              <span>{isGeneratingApk ? "جارٍ البناء..." : t.appGenDownloadApk}</span>
            </button>
          </div>

          {/* Card 2: Installable PWA Web App */}
          <div className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl space-y-4 flex flex-col justify-between transition group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Globe size={20} />
              </div>
              <h4 className="text-sm font-black text-white">{t.appGenInstallPwa}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentLang === "ar"
                  ? "تطبيق ويب تقدمي (PWA) يثبت بنقرة واحدة على أي هاتف iPhone أو Android بدون متجر."
                  : "Installable PWA works instantly on iOS & Android browsers with offline support."}
              </p>
            </div>
            <button
              type="button"
              disabled={isInstallingPwa}
              onClick={handleInstallPwa}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Globe size={14} />
              <span>{isInstallingPwa ? "جارٍ التثبيت..." : t.appGenInstallPwa}</span>
            </button>
          </div>

          {/* Card 3: QR Code Taxi Window Sticker */}
          <div className="bg-slate-950 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl space-y-4 flex flex-col justify-between transition group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Printer size={20} />
              </div>
              <h4 className="text-sm font-black text-white">{t.appGenPrintQr}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentLang === "ar"
                  ? "طباعة بطاقة وملصق باركود لوضعه على زجاج التاكسي ومساند الرأس للركاب."
                  : "Generate printable QR code stickers for taxi windows and passenger headrests."}
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrintSticker}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer size={14} />
              <span>{t.appGenPrintQr}</span>
            </button>
          </div>

          {/* Card 4: Share Direct Link & Config */}
          <div className="bg-slate-950 border border-slate-800 hover:border-indigo-500/50 p-5 rounded-2xl space-y-4 flex flex-col justify-between transition group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Share2 size={20} />
              </div>
              <h4 className="text-sm font-black text-white">{currentLang === "ar" ? "رابط ومشاركة التطبيق" : "Share App Link"}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                https://{companyName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "taxi"}.maek7.dz/app
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Copy size={14} />
              <span>{currentLang === "ar" ? "نسخ الرابط المباشر" : "Copy Link"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
