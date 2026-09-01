import React, { useState } from "react";
import {
  BookOpen,
  Car,
  Users,
  Navigation,
  Video,
  Shield,
  Smartphone,
  DollarSign,
  Wrench,
  Bot,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Zap,
  Search,
  Printer,
  ChevronRight,
  Flame,
  Award,
  Layers,
  Key,
} from "lucide-react";
import { Language, UserPortalMode } from "../types";
import { translations } from "../i18n/translations";

interface PlatformGuideViewProps {
  currentLang: Language;
  onNavigateTab: (tabId: string) => void;
  portalMode: UserPortalMode;
}

export const PlatformGuideView: React.FC<PlatformGuideViewProps> = ({
  currentLang,
  onNavigateTab,
  portalMode,
}) => {
  const t = translations[currentLang];
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const guideSections = [
    {
      id: "architecture_onboarding",
      title:
        currentLang === "ar"
          ? "1. بنية المنظومة واستقلالية الحظيرة"
          : currentLang === "fr"
          ? "1. Architecture & Autonomie de Flotte"
          : "1. Architecture & Fleet Autonomy",
      category: "core",
      badgeColor: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
      accentBg: "from-amber-500/10 to-amber-600/5",
      icon: Layers,
      description:
        currentLang === "ar"
          ? "كل صاحب حظيرة يحصل على بيئة عمل معزولة ومستقلة بالكامل تحمل علامته التجارية ومزود ذكاء خاص به دون تداخل مع منصة المطور."
          : "Each fleet owner gets an isolated, autonomous workspace with their brand, local AI engine, and zero dependency on master developer tools.",
      steps: [
        {
          title: currentLang === "ar" ? "بيئة الحظيرة المستقلة (Tenant Vault)" : "Independent Fleet Vault",
          text:
            currentLang === "ar"
              ? "فصل تام للبيانات، الإيرادات، سجلات السائقين، والتحليلات عن باقي الحظائر."
              : "Complete isolation of telemetry, financial records, driver databases, and AI models.",
        },
        {
          title: currentLang === "ar" ? "فترة التجربة الشاملة 6 أشهر" : "6-Month Free Trial",
          text:
            currentLang === "ar"
              ? "تجربة كاملة غير مقيدة لكافة الميزات المتقدمة (الرادار، الكاميرات، الذكاء الاصطناعي)."
              : "Full unlocked access to radar, dashcam, dispatching, and AI tools for 180 days.",
        },
        {
          title: currentLang === "ar" ? "الهوية البصرية الخاصة" : "Custom Branding",
          text:
            currentLang === "ar"
              ? "شعار مخصص، اسم الشركة، ألوان التطبيق، وأرقام الحجز الخاصة بالحجز المباشر."
              : "Personalized brand logo, company title, custom theme colors, and hotline dispatching.",
        },
      ],
      targetTab: "dashboard",
    },
    {
      id: "live_radar_dashcam",
      title:
        currentLang === "ar"
          ? "2. الرادار المباشر وكاميرات المراقبة (Dashcam AI)"
          : currentLang === "fr"
          ? "2. Radar en Direct & Dashcam IA"
          : "2. Live GPS Radar & AI Dashcam",
      category: "operations",
      badgeColor: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
      accentBg: "from-cyan-500/10 to-cyan-600/5",
      icon: Navigation,
      description:
        currentLang === "ar"
          ? "متابعة مسارات المركبات لحظة بلحظة مع خوارزميات رصد نعاس السائق واستخدام الهاتف الذكي بالذكاء الاصطناعي."
          : "Real-time vehicle tracking with live cabin dashcam, driver drowsiness detection, and road hazard radar.",
      steps: [
        {
          title: currentLang === "ar" ? "تتبع GPS اللحظي والتوجيه الذكي" : "Real-time GPS Telemetry",
          text:
            currentLang === "ar"
              ? "عرض مواقع المركبات وسرعاتها الحالية واتجاه حركتها على الخريطة التفاعلية."
              : "Live pins displaying vehicle speeds, trip trajectories, and passenger pick-up points.",
        },
        {
          title: currentLang === "ar" ? "مراقبة المقصورة ورصد النعاس (Drowsiness Alert)" : "Cabin Drowsiness AI",
          text:
            currentLang === "ar"
              ? "تحليل حركة العيون وإطلاق جرس تنبيه فوري عند النعاس أو التشتت بالهاتف."
              : "Computer vision analyzing eye closure and phone distraction with instant cabin alerts.",
        },
        {
          title: currentLang === "ar" ? "الاتصال الصوتي الداخلي المباشر (Intercom)" : "Two-Way Voice Intercom",
          text:
            currentLang === "ar"
              ? "تحدث فوري مباشر مع السائق في المقصورة بنقرة زر واحدة في الحالات الطارئة."
              : "Instant push-to-talk voice communication directly to the vehicle cabin.",
        },
      ],
      targetTab: "dashcam",
    },
    {
      id: "fleet_drivers_management",
      title:
        currentLang === "ar"
          ? "3. إدارة المركبات، السائقين وتنقيط الأداء (KPI)"
          : currentLang === "fr"
          ? "3. Gestion de Flotte, Chauffeurs & KPI"
          : "3. Fleet, Drivers & Performance KPI",
      category: "fleet",
      badgeColor: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      accentBg: "from-emerald-500/10 to-emerald-600/5",
      icon: Users,
      description:
        currentLang === "ar"
          ? "سجل رقمي متكامل لكل مركبة وسائق، متابعة صلاحية الوثائق، وتنقيط السلوك والالتزام بمواعيد الرحلات."
          : "Complete digital profile for each vehicle and driver, tracking licenses, safety scores, and trip ratings.",
      steps: [
        {
          title: currentLang === "ar" ? "إضافة وتحديث المركبات والسائقين" : "Driver & Vehicle Directory",
          text:
            currentLang === "ar"
              ? "تسجيل بيانات لوحة الترقيم، نوع الوقود، العداد، ورقم رخصة السياقة مع ربط السائق بالمركبة."
              : "Manage license plates, fuel types, mileage, and driver credentials with zero friction.",
        },
        {
          title: currentLang === "ar" ? "تنقيط السائقين ومكافأة الملتزمين" : "Performance KPI & Badges",
          text:
            currentLang === "ar"
              ? "تقييم أسبوعي مبني على عدد الرحلات، التقييمات الإيجابية، وقلة المخالفات أو المكابح الحادة."
              : "Automated scoring based on customer reviews, completed bookings, and safety compliance.",
        },
      ],
      targetTab: "drivers",
    },
    {
      id: "ai_self_healing_maintenance",
      title:
        currentLang === "ar"
          ? "4. مزود الذكاء والصيانة الذاتية للحظيرة"
          : currentLang === "fr"
          ? "4. IA Dédiée & Auto-Maintenance"
          : "4. Dedicated AI & Self-Healing Engine",
      category: "ai",
      badgeColor: "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
      accentBg: "from-purple-500/10 to-purple-600/5",
      icon: Bot,
      description:
        currentLang === "ar"
          ? "وكيل ذكي مخصص لكل صاحب حظيرة يعمل محلياً أو سحابياً لفحص صحة المنظومة، تدقيق الوقود، وإصلاح المشاكل آلياً."
          : "A dedicated intelligent assistant running locally/offline to audit database integrity, fuel theft, and trigger 1-click self-repair.",
      steps: [
        {
          title: currentLang === "ar" ? "الصيانة الذاتية والفحص اللحظي" : "Self-Healing Platform Diagnostics",
          text:
            currentLang === "ar"
              ? "فحص أوتوماتيكي لسلامة قاعدة البيانات المحلية، التزامن، ومستشعرات المركبات."
              : "Continuous auto-checks of local database sync, camera telemetry, and latency.",
        },
        {
          title: currentLang === "ar" ? "كشف تباين الوقود والصيانة الوقائية" : "Predictive Maintenance & Fuel Audit",
          text:
            currentLang === "ar"
              ? "رصد أي تسريب أو استهلاك شاذ للوقود وتذكير آلي بمواعيد تغيير الزيت والفحمات."
              : "Detect fuel anomalies and auto-schedule oil changes before mechanical breakdown occurs.",
        },
        {
          title: currentLang === "ar" ? "إصلاح فوري شامل بنقرة واحدة" : "1-Click Full System Auto-Fix",
          text:
            currentLang === "ar"
              ? "زر ذكي يعيد ضبط الموازنة، تنظيف الذاكرة المؤقتة، وتحديث جاهزية الأسطول إلى 100%."
              : "Instantly rebalance queues, purge stale cache, and restore 100% platform health.",
        },
      ],
      targetTab: "ai_agent",
    },
    {
      id: "branded_app_generator",
      title:
        currentLang === "ar"
          ? "5. استوديو توليد وتصدير التطبيق الشخصي (APK / PWA)"
          : currentLang === "fr"
          ? "5. Studio de Génération d'Application Mobile"
          : "5. Branded Mobile App Studio & APK",
      category: "mobile",
      badgeColor: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
      accentBg: "from-amber-500/10 to-amber-600/5",
      icon: Smartphone,
      description:
        currentLang === "ar"
          ? "بناء وتوليد تطبيق جوال كامل للركاب والسائقين يحمل اسم صاحب الحظيرة وشعاره وتسعيرته الخاصة."
          : "Build and export a complete white-label mobile app for passengers and drivers with your branding and custom fare settings.",
      steps: [
        {
          title: currentLang === "ar" ? "تخصيص الهوية والتسعير" : "Customize Branding & Rates",
          text:
            currentLang === "ar"
              ? "تحديد اسم التطبيق، الشعار، لون الواجهة، وسعر فتح العداد وسعر الكيلومتر."
              : "Set app name, emblem, brand palette, and base fare / per-km rates.",
        },
        {
          title: currentLang === "ar" ? "محاكي مباشر 3 في 1" : "3-in-1 Live Simulator",
          text:
            currentLang === "ar"
              ? "معاينة فورية لتطبيق الراكب، تطبيق السائق، ولوحة صاحب الحظيرة على الهاتف."
              : "Test the passenger booking, driver acceptance, and owner oversight screens live.",
        },
        {
          title: currentLang === "ar" ? "تصدير حزم APK وتثبيت PWA والباركود" : "APK Export & QR Stickers",
          text:
            currentLang === "ar"
              ? "تحميل ملف التطبيق، تثبيت PWA فورياً، وطباعة ملصقات الباركود لسيارات الأجرة."
              : "Download Android APK packages, install PWA offline, and print vehicle QR stickers.",
        },
      ],
      targetTab: "app_generator",
    },
    {
      id: "voice_command_system",
      title:
        currentLang === "ar"
          ? "6. النظام الصوتي الموحد لإدخال البيانات والتسيير"
          : currentLang === "fr"
          ? "6. Commandes Vocales & Saisie Vocale"
          : "6. Universal Voice Commands & Speech Dispatch",
      category: "voice",
      badgeColor: "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30",
      accentBg: "from-rose-500/10 to-rose-600/5",
      icon: Sparkles,
      description:
        currentLang === "ar"
          ? "التحكم في المنظومة وإدخال السائقين، المركبات، الرحلات والمصاريف بصوتك الطبيعي باللغة العربية أو الفرنسية أو الإنجليزية."
          : "Voice-driven operational dispatch: add drivers, record fuel costs, dispatch trips, and navigate with your natural voice.",
      steps: [
        {
          title: currentLang === "ar" ? "الاستماع اللحظي والرد الصوتي (TTS)" : "Live Speech Recognition & TTS",
          text:
            currentLang === "ar"
              ? "التعرف الذكي على نبرات الصوت وتقديم رد صوتي فوري يؤكد تنفيذ الأمر."
              : "High accuracy multi-lingual speech recognition paired with natural voice feedback.",
        },
        {
          title: currentLang === "ar" ? "الإدخال السريع بدون لوحة المفاتيح" : "Hands-free Data Entry",
          text:
            currentLang === "ar"
              ? "قل: 'أضف سائق جديد باسم ياسين' أو 'سجل مصروف وقود 3500 دج' ليتم حفظه فوراً."
              : "Simply speak commands to record drivers, vehicle telemetry, or expenses instantly.",
        },
      ],
      targetTab: "dashboard",
    },
  ];

  const filteredSections = guideSections.filter((sec) => {
    const matchesCategory = selectedCategory === "all" || sec.category === selectedCategory;
    const matchesSearch =
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: "all", label: currentLang === "ar" ? "جميع الأقسام" : "All Sections" },
    { id: "core", label: currentLang === "ar" ? "البنية والاستقلالية" : "Core & Autonomy" },
    { id: "operations", label: currentLang === "ar" ? "الرادار والكاميرات" : "Radar & Dashcam" },
    { id: "fleet", label: currentLang === "ar" ? "الأسطول والسائقون" : "Fleet & Drivers" },
    { id: "ai", label: currentLang === "ar" ? "الذكاء والصيانة الذاتية" : "AI & Maintenance" },
    { id: "mobile", label: currentLang === "ar" ? "توليد التطبيق الشخصي" : "Branded App" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              {currentLang === "ar"
                ? "الدليل التشغيلي الملون الشامل 2026"
                : "Illustrated Platform & Fleet Guide 2026"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentLang === "ar"
                ? "دليل منصة MAEK7-TAXI وإدارة الحظائر الذكية"
                : "MAEK7-TAXI Smart Fleet Platform Master Guide"}
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
              {currentLang === "ar"
                ? "مرجع ملون وتفاعلي يشرح كافة أدوات إدارة الأسطول، استقلالية الحظيرة، الرادار، كاميرات المقصورة، مزود الذكاء والصيانة الذاتية، وتوليد التطبيق المخصص."
                : "Comprehensive illustrated handbook detailing fleet operations, autonomous tenant vaults, AI self-healing maintenance, live telematics, and branded mobile app generation."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab("video_tutorial")}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-2xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>{currentLang === "ar" ? "شاهد الفيديو التفاعلي" : "Watch Video Tutorial"}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold rounded-2xl text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>{currentLang === "ar" ? "طباعة الدليل" : "Print Guide"}</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentLang === "ar" ? "ابحث في محتويات الدليل..." : "Search guide topics..."}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-2xl pr-9 pl-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold mb-1 ${sec.badgeColor}`}
                      >
                        {sec.category.toUpperCase()}
                      </span>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {sec.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                  {sec.description}
                </p>

                {/* Steps List */}
                <div className="space-y-3 mb-6">
                  {sec.steps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        {sIdx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {currentLang === "ar" ? "ميزة مفعلة وجاهزة" : "Live Feature"}
                </span>

                <button
                  onClick={() => onNavigateTab(sec.targetTab)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-500 dark:bg-slate-800 dark:hover:bg-amber-500 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{currentLang === "ar" ? "الانتقال للواجهة وتجربتها" : "Open Live View"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Role-Based Workflow Cheatsheet */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white">
        <h3 className="text-lg font-black mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          {currentLang === "ar"
            ? "دليل الأدوار والمهام اليومية في الحظيرة"
            : "Role-Based Daily Operational Cheatsheet"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider block mb-1">
              {currentLang === "ar" ? "صاحب الحظيرة / المدير" : "Fleet Owner / Director"}
            </span>
            <ul className="text-xs text-slate-300 space-y-1.5 mt-2">
              <li>• مراجعة الإيرادات اليومية وصافي الأرباح</li>
              <li>• متابعة فحص الصيانة الذاتية بالذكاء الاصطناعي</li>
              <li>• تخصيص وتوليد تطبيق الهاتف (APK) للزبائن</li>
              <li>• تجديد رخص السائقين وتدقيق استهلاك الوقود</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block mb-1">
              {currentLang === "ar" ? "مشرف الإرسال والتحكم" : "Dispatcher & Controller"}
            </span>
            <ul className="text-xs text-slate-300 space-y-1.5 mt-2">
              <li>• متابعة شاشة الرادار المباشر وسرعة المركبات</li>
              <li>• استقبال وتوجيه حجوزات الزبائن عبر واتساب</li>
              <li>• الاستجابة الفورية لتنبيهات النعاس والمكابح</li>
              <li>• استخدام الأوامر الصوتية للإدخال السريع</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block mb-1">
              {currentLang === "ar" ? "السائق المعتمد" : "Authorized Driver"}
            </span>
            <ul className="text-xs text-slate-300 space-y-1.5 mt-2">
              <li>• تشغيل تطبيق السائق وقبول الرحلات القريبة</li>
              <li>• الالتزام بمعايير السلامة وتجنب التشتت بالهاتف</li>
              <li>• تسجيل نفقات الوقود وإيصالات الصيانة</li>
              <li>• الحفاظ على مؤشر تقييم أداء مرتفع للحصول على المكافآت</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
