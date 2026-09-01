import React from "react";
import {
  Sliders,
  CheckCircle2,
  Sparkles,
  Layers,
  Zap,
  Check,
  ShieldCheck,
  Settings2,
  Smartphone,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  Language,
  PresetTemplate,
  FeatureModules,
  TemplateId,
} from "../types";
import { translations } from "../i18n/translations";
import { presetTemplates } from "../data/mockData";

interface TemplatesViewProps {
  currentLang: Language;
  activeTemplate: PresetTemplate;
  featureFlags: FeatureModules;
  onApplyTemplate: (template: PresetTemplate) => void;
  onToggleFeature: (featureKey: keyof FeatureModules) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  currentLang,
  activeTemplate,
  featureFlags,
  onApplyTemplate,
  onToggleFeature,
  onNavigateTab,
}) => {
  const t = translations[currentLang];

  const featureMetadata: {
    key: keyof FeatureModules;
    title: string;
    description: Record<Language, string>;
  }[] = [
    {
      key: "aiAgent",
      title: t.featureAiAgent,
      description: {
        ar: "مستشار ومدير عمليات مدعوم بالذكاء الاصطناعي لتحليل الرحلات والصيانة والأرباح.",
        en: "Autonomous executive AI copilot for telemetry, maintenance, and revenue analysis.",
        fr: "Copilote IA décisionnel pour l'analyse des tournées, maintenance et rentabilité.",
      },
    },
    {
      key: "financialLedger",
      title: t.featureFinancialLedger,
      description: {
        ar: "سجل متكامل لتسجيل المداخيل، المصاريف، فواتير الوقود وصافي الأرباح.",
        en: "Comprehensive double-entry bookkeeping, fuel invoices, and cash flow margins.",
        fr: "Comptabilité complète, facturation carburant et suivi des marges nettes.",
      },
    },
    {
      key: "smartNotifications",
      title: t.featureSmartNotifications,
      description: {
        ar: "رادار المراقبة الحية لتنبيهات الصيانة، انتهاء الرخص، وارتفاع استهلاك الوقود.",
        en: "Continuous proactive monitoring for maintenance due, expired documents, and fuel surges.",
        fr: "Surveillance proactive pour révisions moteur, permis expirés et alertes conso.",
      },
    },
    {
      key: "fleetMaintenance",
      title: t.featureFleetMaintenance,
      description: {
        ar: "تتبع دقيق لعدادات المسافة (الكيلومترات) وجدولة الصيانة الوقائية قبل الأعطال.",
        en: "High-precision odometer tracking and preventive overhaul scheduling.",
        fr: "Suivi kilométrique détaillé et planification des révisions préventives.",
      },
    },
    {
      key: "intercityRouting",
      title: t.featureIntercityRouting,
      description: {
        ar: "تسيير المسارات بين الولايات والربط بين المحطات والمطارات الكبرى.",
        en: "Multi-wilaya long-distance transit and airport hub corridor management.",
        fr: "Gestion des liaisons inter-wilayas et couloirs aéroportuaires.",
      },
    },
    {
      key: "vipTier",
      title: t.featureVipTier,
      description: {
        ar: "فئة نقل رجال الأعمال والوفود مع سيارات فخمة وأسعار ممتازة.",
        en: "VIP limousine and executive private chauffeur tier with premium pricing.",
        fr: "Prestation VIP limousine et chauffeur privé d'affaires à tarification premium.",
      },
    },
    {
      key: "driverKpi",
      title: t.featureDriverKpi,
      description: {
        ar: "لوحة تقييم نجوم السائقين، تتبع عدد الرحلات، ومكافأة السائقين الأفضل.",
        en: "Driver rating scoreboard, trip volume metrics, and performance bonuses.",
        fr: "Évaluation des chauffeurs, métriques de ponctualité et primes d'excellence.",
      },
    },
    {
      key: "liveRadar",
      title: t.featureLiveRadar,
      description: {
        ar: "محاكاة تتبع الرحلات الجارية ومواقع المركبات بالزمن الفعلي.",
        en: "Real-time ongoing trip dispatch and transit telemetry simulation.",
        fr: "Télématique en direct des courses en transit et statut des chauffeurs.",
      },
    },
    {
      key: "whatsAppGateway",
      title: t.featureWhatsAppGateway,
      description: {
        ar: "إرسال إشعارات وتأكيدات الحجز والتذكير عبر روابط واتساب المباشرة.",
        en: "Automated instant WhatsApp message dispatch for passengers and drivers.",
        fr: "Envoi immédiat de notifications et confirmations de course par WhatsApp.",
      },
    },
    {
      key: "analyticsCharts",
      title: t.featureAnalyticsCharts,
      description: {
        ar: "رسوم بيانية أسبوعية وساعية لتحليل ساعات الذروة وتطور الأرباح.",
        en: "Visual interactive charts for weekly revenue and peak hour demand curves.",
        fr: "Graphiques visuels pour l'évolution hebdomadaire et les pics d'affluence.",
      },
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
          <Sliders size={14} />
          <span>{t.templatesTitle}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">{t.templatesTitle}</h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {t.templatesSubtitle}
        </p>
      </div>

      {/* Prominent App Generator Direct Link Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/60 border border-amber-500/30 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            <Smartphone size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-white">
                {currentLang === "ar"
                  ? "توليد وتخصيص تطبيق جوال شخصي لصاحب الحظيرة"
                  : "Generate & Brand Fleet Owner Mobile App"}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px]">
                {activeTemplate.name[currentLang]}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {currentLang === "ar"
                ? "يمكنك الآن تخصيص الشعار، اسم المؤسسة، الهوية البصرية، وتوليد تطبيق APK أو PWA مدمج مع هذا القالب مباشرة."
                : "Customize your brand logo, company name, theme color and generate APK/PWA with this active template."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab?.("app_generator")}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer shrink-0"
        >
          <span>{currentLang === "ar" ? "واجهة توليد التطبيق" : "Go to App Generator"}</span>
          {currentLang === "ar" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </button>
      </div>

      {/* 3 Preset Templates Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {presetTemplates.map((tpl) => {
          const isSelected = activeTemplate.id === tpl.id;

          const tierColor = {
            solo_micro: "from-blue-900/40 via-slate-900 to-slate-900 border-blue-500/30",
            fleet_standard: "from-amber-900/40 via-slate-900 to-slate-900 border-amber-500/40",
            enterprise_ai: "from-violet-900/50 via-slate-900 to-slate-900 border-violet-500/40",
            custom: "from-slate-900 to-slate-950 border-slate-700",
          }[tpl.id];

          return (
            <div
              key={tpl.id}
              className={`rounded-3xl p-6 border transition-all relative flex flex-col justify-between shadow-lg ${
                isSelected
                  ? `bg-gradient-to-b ${tierColor} ring-2 ring-amber-400/60 scale-[1.02]`
                  : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 rtl:left-4 ltr:right-4 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                  ✓ {t.activeTemplateBadge}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
                    {tpl.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">{tpl.name[currentLang]}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {tpl.description[currentLang]}
                  </p>
                </div>

                {/* Feature Checklist Summary */}
                <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.recommendedFor[currentLang] ? `يناسب: ${tpl.recommendedFor[currentLang]}` : ""}
                  </div>

                  <ul className="space-y-1.5 text-slate-300">
                    {Object.entries(tpl.features).map(([featKey, enabled]) => {
                      if (!enabled) return null;
                      const featTitle =
                        featureMetadata.find((m) => m.key === featKey)?.title || featKey;
                      return (
                        <li key={featKey} className="flex items-center gap-2 text-[11px]">
                          <Check size={13} className="text-emerald-400 shrink-0 font-bold" />
                          <span className="truncate">{featTitle}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-4">
                <button
                  onClick={() => onApplyTemplate(tpl)}
                  disabled={isSelected}
                  className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-black transition shadow-md ${
                    isSelected
                      ? "bg-slate-800 text-slate-500 cursor-default"
                      : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20"
                  }`}
                >
                  {isSelected ? t.activeTemplateBadge : t.applyTemplate}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Granular Feature Switchboard (Add or remove modules on-demand) */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Settings2 size={20} className="text-amber-400" />
              <span>{t.customModulesTitle}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              يمكنك تشغيل أو إيقاف أي وحدة فردية حسب حاجة مشروعك الحالية
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
            {Object.values(featureFlags).filter(Boolean).length} / {Object.keys(featureFlags).length} ميزة مفعلة
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featureMetadata.map((feat) => {
            const isEnabled = featureFlags[feat.key];

            return (
              <div
                key={feat.key}
                onClick={() => onToggleFeature(feat.key)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                  isEnabled
                    ? "bg-slate-800/80 border-amber-500/40 hover:border-amber-400"
                    : "bg-slate-950/40 border-slate-800/80 opacity-60 hover:opacity-100 hover:border-slate-700"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white truncate">{feat.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {feat.description[currentLang]}
                  </p>
                </div>

                {/* Custom Toggle Switch */}
                <div
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors shrink-0 flex items-center ${
                    isEnabled ? "bg-amber-500" : "bg-slate-800"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transform transition-transform ${
                      isEnabled ? "rtl:-translate-x-5.5 ltr:translate-x-5.5" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
