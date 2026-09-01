import React, { useState } from "react";
import {
  Layers,
  MapPin,
  Building,
  Car,
  CheckCircle,
  Sliders,
  DollarSign,
  Clock,
  Sparkles,
  ShieldCheck,
  Video,
  Smartphone,
  UserCheck,
  HelpCircle,
  ChevronRight,
  Zap,
} from "lucide-react";
import {
  Language,
  ScopeLevel,
  FeatureModules,
  ClientTenantConfig,
} from "../types";
import { algerianWilayasList } from "../data/mockData";

interface ScopePricingConfiguratorViewProps {
  language: Language;
  currency: string;
  activeTenant: ClientTenantConfig;
  onRequestUpgrade?: (notes: string) => void;
}

export const ScopePricingConfiguratorView: React.FC<ScopePricingConfiguratorViewProps> = ({
  language,
  currency,
  activeTenant,
  onRequestUpgrade,
}) => {
  const [selectedScope, setSelectedScope] = useState<ScopeLevel>(activeTenant.scopeLevel);
  const [selectedWilayaCode, setSelectedWilayaCode] = useState(activeTenant.wilayaCode || "16");
  const [selectedMunicipality, setSelectedMunicipality] = useState(activeTenant.municipality);
  const [fleetVehicles, setFleetVehicles] = useState(activeTenant.vehicleCapacity);
  const [features, setFeatures] = useState<FeatureModules>(activeTenant.features);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const selectedWilaya =
    algerianWilayasList.find((w) => w.code === selectedWilayaCode) || algerianWilayasList[0];

  // Dynamic Price Engine
  const calculatePrice = () => {
    let baseSetup = 25000;
    let baseMonthly = 8000;

    if (selectedScope === "nationwide") {
      baseSetup += 60000;
      baseMonthly += 35000;
    } else if (selectedScope === "wilaya") {
      baseSetup += 25000;
      baseMonthly += 12000;
    } else if (selectedScope === "city") {
      baseSetup += 15000;
      baseMonthly += 7000;
    } else {
      baseSetup += 8000;
      baseMonthly += 4000;
    }

    baseMonthly += fleetVehicles * 550;

    if (features.dashcamSurveillance) baseMonthly += 4500;
    if (features.aiAgent) baseMonthly += 3500;
    if (features.liveRadar) baseMonthly += 2500;
    if (features.whatsAppGateway) baseMonthly += 2000;
    if (features.vipTier) baseMonthly += 3000;
    if (features.analyticsCharts) baseMonthly += 1500;
    if (features.driverKpi) baseMonthly += 1500;

    return { setup: baseSetup, monthly: baseMonthly };
  };

  const calculated = calculatePrice();

  const handleRequestSubmit = () => {
    setIsSuccessModalOpen(true);
    if (onRequestUpgrade) {
      onRequestUpgrade(
        `Scope: ${selectedScope}, Wilaya: ${selectedWilaya.arabicName}, Vehicles: ${fleetVehicles}, Monthly: ${calculated.monthly} DZD`
      );
    }
  };

  return (
    <div id="scope-pricing-configurator" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
              <Sliders className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {language === "ar"
                  ? "تخصيص القالب، النطاق الجغرافي وحساب التكلفة"
                  : language === "fr"
                  ? "Configuration du Périmètre d'Activité & Tarification"
                  : "On-Demand Scope, Fleet Sizing & Price Configurator"}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === "ar"
                  ? "اختر تغطية منظومتك (وطنية، ولاية محددة، بلدية، أو مدينة)، عدد المركبات والميزات حسب نشاط مؤسستك مع فترة تجريبية 6 أشهر مجانية."
                  : "Customize your operational boundary, fleet size, and modular services with 6-month free trial guarantee."}
              </p>
            </div>
          </div>

          {/* Current Active Status Pill */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <Clock className="w-4 h-4 text-amber-500" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                {activeTenant.licenseStatus === "trial_active"
                  ? (language === "ar" ? `فترة تجريبية: باقي ${activeTenant.trialDaysRemaining} يوماً` : `Trial: ${activeTenant.trialDaysRemaining}d remaining`)
                  : (language === "ar" ? "ترخيص مفعل دائم ✅" : "Active License ✅")}
              </div>
              <div className="text-[10px] text-slate-500">
                {activeTenant.companyName}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Configurator */}
        <div className="lg:col-span-2 space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          {/* 1. Scope Selector */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-mono font-bold">
                1
              </span>
              <span>{language === "ar" ? "حدد نطاق تغطية المنصة:" : "Operating Boundary Level:"}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mt-3">
              {[
                {
                  id: "nationwide",
                  titleAr: "كامل الدولة (58 ولاية)",
                  titleEn: "Nationwide (All 58)",
                  descAr: "شبكة نقل وطنية، ربط المطارات والمحطات الكبرى",
                  descEn: "Intercity highways & national airports",
                  icon: Layers,
                },
                {
                  id: "wilaya",
                  titleAr: "مستوى الولاية",
                  titleEn: "Wilaya Level",
                  descAr: "تغطية كامل بلديات ومحيط الولاية المختارة",
                  descEn: "Full provincial coverage",
                  icon: MapPin,
                },
                {
                  id: "municipality",
                  titleAr: "مستوى البلدية",
                  titleEn: "Municipality",
                  descAr: "تركيز مكثف على دائرة أو بلدية محددة",
                  descEn: "Specific local district",
                  icon: Building,
                },
                {
                  id: "city",
                  titleAr: "المدينة والحضر",
                  titleEn: "Urban City Center",
                  descAr: "قلب المدينة والمناطق التجارية",
                  descEn: "Metropolitan urban center",
                  icon: Car,
                },
              ].map((scope) => {
                const Icon = scope.icon;
                const isSelected = selectedScope === scope.id;

                return (
                  <button
                    key={scope.id}
                    onClick={() => setSelectedScope(scope.id as ScopeLevel)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`} />
                      <div className="font-bold text-xs">
                        {language === "ar" ? scope.titleAr : scope.titleEn}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {language === "ar" ? scope.descAr : scope.descEn}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === "ar" ? "الولاية الرئيسية:" : "Main Wilaya:"}
              </label>
              <select
                value={selectedWilayaCode}
                onChange={(e) => {
                  setSelectedWilayaCode(e.target.value);
                  const w = algerianWilayasList.find((x) => x.code === e.target.value);
                  if (w && w.communes[0]) setSelectedMunicipality(w.communes[0]);
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                {algerianWilayasList.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code} - {w.arabicName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === "ar" ? "البلدية أو المركز:" : "Municipality / District:"}
              </label>
              <select
                value={selectedMunicipality}
                onChange={(e) => setSelectedMunicipality(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                {selectedWilaya.communes.map((comm) => (
                  <option key={comm} value={comm}>
                    {comm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Fleet Size Slider */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-mono font-bold">
                  2
                </span>
                <span>{language === "ar" ? "حجم أسطول المركبات المطلوب:" : "Target Fleet Size:"}</span>
              </div>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                {fleetVehicles} {language === "ar" ? "مركبة" : "Vehicles"}
              </span>
            </div>

            <input
              type="range"
              min={2}
              max={150}
              value={fleetVehicles}
              onChange={(e) => setFleetVehicles(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>2 {language === "ar" ? "مركبات" : "cars"}</span>
              <span>25 {language === "ar" ? "مركبة" : "cars"}</span>
              <span>75 {language === "ar" ? "مركبة" : "cars"}</span>
              <span>150+ {language === "ar" ? "مركبة" : "cars"}</span>
            </div>
          </div>

          {/* 3. Modular Feature Add-ons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-mono font-bold">
                3
              </span>
              <span>{language === "ar" ? "الميزات والوحدات البرمجية:" : "Select Modular Services:"}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
              {[
                {
                  key: "dashcamSurveillance",
                  labelAr: "كاميرات المراقبة المزدوجة ومراقبة السائق (Dashcam AI)",
                  labelEn: "AI Dual Dashcam & Driver Monitor",
                  icon: Video,
                  price: "+4,500 دج",
                },
                {
                  key: "aiAgent",
                  labelAr: "الوكيل الذكي للجدولة والإرسال (AI Copilot)",
                  labelEn: "AI Operations Dispatch Copilot",
                  icon: Sparkles,
                  price: "+3,500 دج",
                },
                {
                  key: "liveRadar",
                  labelAr: "رادار التتبع الجغرافي وتتبع السرعة (Live GPS)",
                  labelEn: "Live GPS Telemetry & Radar",
                  icon: MapPin,
                  price: "+2,500 دج",
                },
                {
                  key: "whatsAppGateway",
                  labelAr: "بوابة واتساب الآلية لإشعارات الزبائن",
                  labelEn: "WhatsApp Gateway Integration",
                  icon: Smartphone,
                  price: "+2,000 دج",
                },
                {
                  key: "financialLedger",
                  labelAr: "السجل المالي والمحاسبة الآلية",
                  labelEn: "Financial Ledger & Invoicing",
                  icon: DollarSign,
                  price: "مضمّن",
                },
                {
                  key: "driverKpi",
                  labelAr: "تنقيط وتقييم السائقين ومكافآت الأداء",
                  labelEn: "Driver KPI Scorecards",
                  icon: UserCheck,
                  price: "+1,500 دج",
                },
              ].map((f) => {
                const Icon = f.icon;
                const isChecked = !!features[f.key as keyof FeatureModules];

                return (
                  <div
                    key={f.key}
                    onClick={() =>
                      setFeatures({
                        ...features,
                        [f.key]: !isChecked,
                      })
                    }
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                      isChecked
                        ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500 text-slate-900 dark:text-white"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isChecked ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`} />
                      <span className="font-medium text-[11px]">
                        {language === "ar" ? f.labelAr : f.labelEn}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      {f.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Price Quote & 6-Mo Free Trial Guarantee */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === "ar" ? "عرض الأسعار الفوري" : "Instant SaaS Quote"}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                {language === "ar" ? "فترة تجريبية 6 أشهر" : "6-Mo Free Trial"}
              </span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{language === "ar" ? "النطاق المحدد:" : "Operating Scope:"}</span>
                <span className="font-bold text-slate-900 dark:text-white uppercase font-mono">
                  {selectedScope}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{language === "ar" ? "المنطقة / الولاية:" : "Region:"}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedWilaya.arabicName}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{language === "ar" ? "حجم الأسطول:" : "Fleet Capacity:"}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {fleetVehicles} {language === "ar" ? "مركبة" : "Vehicles"}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{language === "ar" ? "رسوم التهيئة المرجعية:" : "Setup & Onboarding:"}</span>
                  <span className="font-mono">{calculated.setup.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{language === "ar" ? "الاشتراك الشهري المرجعي:" : "Base Monthly Fee:"}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {calculated.monthly.toLocaleString()} {currency}/mo
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>{language === "ar" ? "خصم الفترة التجريبية (100%):" : "Trial Period Discount (100%):"}</span>
                  <span>-100% (0.00 {currency})</span>
                </div>
              </div>
            </div>

            {/* Big Highlight Box */}
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 text-white border border-emerald-500/30 text-center">
              <div className="text-xs text-emerald-300">
                {language === "ar"
                  ? "السعر المستحق خلال الـ 6 أشهر التجريبية الأولى"
                  : "Amount Due During 6-Month Free Trial"}
              </div>
              <div className="text-3xl font-black font-mono mt-1 text-emerald-400">
                0.00 {currency}
              </div>
              <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                {language === "ar"
                  ? "تشمل المنظومة تجربة كاملة الميزات لمدة 6 أشهر. بعد انتهاء المدة يتم تثبيت الترخيص بواسطة المطور الرئيسي."
                  : "Full unrestricted access for 6 months. Activates permanently through master developer authorization."}
              </p>
            </div>
          </div>

          <button
            onClick={handleRequestSubmit}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>
              {language === "ar"
                ? "تأكيد الطلب وتفعيل القالب للتجربة"
                : "Submit Configuration & Start Trial"}
            </span>
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {language === "ar"
                ? "تم تسجيل طلب تهيئة القالب بنجاح!"
                : "Configuration Request Submitted!"}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === "ar"
                ? `تم إرسال إعدادات النطاق (${selectedScope}) وحجم الأسطول (${fleetVehicles} مركبة) للمطور الرئيسي. فترتك التجريبية 6 أشهر مفعلة وجاهزة للعمل فوراً.`
                : `Your configuration for ${selectedScope} (${fleetVehicles} vehicles) is saved. 6-month trial is active!`}
            </p>

            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {language === "ar" ? "متابعة إلى لوحة التحكم" : "Continue to Dashboard"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
