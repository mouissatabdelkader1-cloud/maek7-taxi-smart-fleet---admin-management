import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Subtitles,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Layers,
  Navigation,
  Video,
  Smartphone,
  Wrench,
  Bot,
  MessageSquare,
  Shield,
  HelpCircle,
} from "lucide-react";
import { Language, VideoTutorialChapter } from "../types";
import { translations } from "../i18n/translations";

interface PlatformVideoTutorialViewProps {
  currentLang: Language;
  onNavigateTab: (tabId: string) => void;
}

export const PlatformVideoTutorialView: React.FC<PlatformVideoTutorialViewProps> = ({
  currentLang,
  onNavigateTab,
}) => {
  const t = translations[currentLang];
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0); // in seconds
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);

  const chapters: VideoTutorialChapter[] = [
    {
      id: "ch-1-intro",
      title: {
        ar: "1. نظرة عامة وبداية تشغيل حظيرتك المستقلة",
        en: "1. Platform Overview & Fleet Autonomy Setup",
        fr: "1. Vue d'Ensemble & Autonomie de Flotte",
      },
      duration: "01:45",
      startTime: 0,
      iconName: "Layers",
      summary: {
        ar: "شرح هيكل المنصة، استقلالية كل صاحب حظيرة ببيئة وبيانات مشفرة خاصة به، وفترة التجربة 6 أشهر.",
        en: "Understanding the independent tenant workspace, isolated databases, custom branding, and 6-month trial.",
        fr: "Comprendre l'espace dédié du propriétaire de flotte, l'isolation des données et la période d'essai de 6 mois.",
      },
      steps: [
        {
          title: {
            ar: "لوحة التحكم المركزية وهوية المؤسسة",
            en: "Central Dashboard & Brand Identity",
            fr: "Tableau de Bord & Identité",
          },
          description: {
            ar: "تعديل اسم الشركة، الشعار، ومتابعة إحصائيات جاهزية الأسطول والإيرادات اليومية.",
            en: "Configure company title, logo, and monitor live vehicle readiness and daily gross profit.",
            fr: "Personnaliser le nom, logo et superviser la disponibilité des véhicules et revenus.",
          },
          screenshotBadge: "DASHBOARD_OVERVIEW",
          actionTargetTab: "dashboard",
        },
        {
          title: {
            ar: "تسجيل المركبات وتعيين السائقين",
            en: "Registering Vehicles & Assigning Drivers",
            fr: "Enregistrement Flotte & Chauffeurs",
          },
          description: {
            ar: "إدخال رقم لوحة الترقيم، نوع الوقود، عداد الكيلومترات، وربط السائق بالسيارة مباشرة.",
            en: "Add license plates, fuel categories, initial mileage, and bind drivers to specific units.",
            fr: "Ajoutez immatriculations, type de carburant et associez les chauffeurs directement.",
          },
          screenshotBadge: "FLEET_REGISTRATION",
          actionTargetTab: "vehicles",
        },
      ],
    },
    {
      id: "ch-2-radar",
      title: {
        ar: "2. الرادار المباشر وتتبع المسارات بالـ GPS",
        en: "2. Live GPS Radar & Route Tracking",
        fr: "2. Radar en Direct & Géolocalisation GPS",
      },
      duration: "01:30",
      startTime: 105,
      iconName: "Navigation",
      summary: {
        ar: "متابعة حركة المركبات المباشرة، خطوط السير، سرعة القيادة ومواقع الزبائن.",
        en: "Track live vehicle markers, telemetry speed, route trajectories, and passenger pick-up points.",
        fr: "Supervisez le mouvement des taxis, la vitesse en direct et les trajectoires sur la carte.",
      },
      steps: [
        {
          title: {
            ar: "تتبع المركبات النشطة على الخريطة التفاعلية",
            en: "Real-time Interactive Map Markers",
            fr: "Marqueurs Taxis sur Carte Interactive",
          },
          description: {
            ar: "رؤية حالة كل سيارة (نشطة، متوقفة، قيد الصيانة) مع تفاصيل السائق والسرعة الحالية.",
            en: "View each vehicle state (active, parked, servicing) with instant driver details and speed.",
            fr: "Statut en temps réel de chaque véhicule avec vitesse et détails du chauffeur.",
          },
          screenshotBadge: "RADAR_TELEMETRY",
          actionTargetTab: "radar",
        },
      ],
    },
    {
      id: "ch-3-dashcam",
      title: {
        ar: "3. كاميرات المراقبة ورصد نعاس السائقين (Dashcam AI)",
        en: "3. AI Dashcam & Cabin Vigilance Telematics",
        fr: "3. Dashcam IA & Vigilance Cabine",
      },
      duration: "01:20",
      startTime: 195,
      iconName: "Video",
      summary: {
        ar: "استخدام خوارزميات الرؤية الحاسوبية لرصد النعاس، التشتت بالهاتف، والاتصال الصوتي بالمقصورة.",
        en: "Using computer vision to detect driver drowsiness, mobile phone distraction, and 2-way voice intercom.",
        fr: "Détection IA de somnolence au volant, distraction téléphonique et interphone cabine direct.",
      },
      steps: [
        {
          title: {
            ar: "بث المقصورة المزدوج وتنبيهات النعاس الحرجة",
            en: "Dual Camera Stream & Drowsiness Trigger",
            fr: "Flux Vidéo Double & Alerte Somnolence",
          },
          description: {
            ar: "إطلاق جرس صوتي في مقصورة السائق فور رصد إغماض العينين لأكثر من ثانيتين.",
            en: "Automated audible buzzer triggered inside the cabin whenever eye closure exceeds 2 seconds.",
            fr: "Alarme sonore déclenchée en cabine si le chauffeur ferme les yeux plus de 2 secondes.",
          },
          screenshotBadge: "CABIN_AI_SURVEILLANCE",
          actionTargetTab: "dashcam",
        },
      ],
    },
    {
      id: "ch-4-ai-healing",
      title: {
        ar: "4. الوكيل الذكي والصيانة الذاتية اللحظية للمنظومة",
        en: "4. Dedicated AI & Real-time Self-Healing Engine",
        fr: "4. IA Dédiée & Auto-Maintenance du Système",
      },
      duration: "01:40",
      startTime: 275,
      iconName: "Bot",
      summary: {
        ar: "وكيل ذكي محلي خاص بكل حظيرة يقوم بفحص قاعدة البيانات، تدقيق الوقود، وإصلاح المشاكل بنقرة واحدة.",
        en: "Dedicated tenant AI assistant auditing database health, fuel theft, and executing 1-click repairs.",
        fr: "Assistant IA privé vérifiant l'état de la base de données, les fuites de carburant et auto-réparation en 1 clic.",
      },
      steps: [
        {
          title: {
            ar: "مؤشر صحة المنظومة والفحص الاستباقي",
            en: "System Health Score & Predictive Audit",
            fr: "Score de Santé & Audit Prédictif",
          },
          description: {
            ar: "متابعة مؤشر الصحة (98-100%)، وفحص تسريب الوقود، ومواعيد تغيير زيت المحرك.",
            en: "Track platform health score, audit fuel variance, and schedule predictive engine service.",
            fr: "Suivez l'état de santé du système et anticipez les vidanges et révisions mécaniques.",
          },
          screenshotBadge: "AI_DIAGNOSTICS",
          actionTargetTab: "ai_agent",
        },
        {
          title: {
            ar: "الإصلاح الذاتي الفوري بنقرة واحدة (1-Click Auto-Fix)",
            en: "1-Click Self-Healing & Queue Rebalance",
            fr: "Réparation Automatique en 1 Clic",
          },
          description: {
            ar: "إعادة موازنة طوابير الرحلات، تنظيف الكاش، وحل أي تعليق تقني في ثوانٍ.",
            en: "Instantly rebalance dispatch queues, flush local cache, and resolve issues automatically.",
            fr: "Rééquilibrage des courses, purge du cache et correction instantanée.",
          },
          screenshotBadge: "AUTO_HEALING_BUTTON",
          actionTargetTab: "ai_agent",
        },
      ],
    },
    {
      id: "ch-5-app-generator",
      title: {
        ar: "5. استوديو وتوليد تطبيق صاحب الحظيرة (APK / PWA)",
        en: "5. Branded Mobile App Studio & APK Generation",
        fr: "5. Générateur d'Application Mobile & APK",
      },
      duration: "01:25",
      startTime: 375,
      iconName: "Smartphone",
      summary: {
        ar: "توليد تطبيق جوال مخصص للركاب والسائقين يحمل اسمك وشعارك وتسعيرتك مع تصدير APK فورياً.",
        en: "Generate custom mobile apps with your branding, fares, and 3-in-1 live passenger/driver simulator.",
        fr: "Générez votre application mobile dédiée aux passagers et chauffeurs avec export APK immédiat.",
      },
      steps: [
        {
          title: {
            ar: "تخصيص الهوية والتسعيرة والمحاكي المباشر",
            en: "Brand Customization, Rates & 3-in-1 Simulator",
            fr: "Personnalisation Marque, Tarifs & Simulateur",
          },
          description: {
            ar: "ضبط سعر الكيلومتر، فتحة العداد، تجربة شاشة الراكب وشاشة السائق، وتصدير APK.",
            en: "Configure base fares, per-km rates, test driver/passenger screens, and export Android packages.",
            fr: "Ajustez le prix au km, testez les écrans passager et chauffeur, puis téléchargez l'APK.",
          },
          screenshotBadge: "APP_BUILD_STUDIO",
          actionTargetTab: "app_generator",
        },
      ],
    },
  ];

  const currentChapter = chapters[currentChapterIdx];
  const currentStep = currentChapter.steps[currentStepIdx] || currentChapter.steps[0];

  // Video playback timer simulator
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          const next = prev + 1 * playbackSpeed;
          // Check if we need to progress steps or chapters
          if (next > 460) {
            setIsPlaying(false);
            return 460;
          }
          return next;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSelectChapter = (idx: number) => {
    setCurrentChapterIdx(idx);
    setCurrentStepIdx(0);
    setPlaybackTime(chapters[idx].startTime);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold mb-3">
            <Video className="w-3.5 h-3.5" />
            {currentLang === "ar"
              ? "فيديو الشرح التفاعلي لطريقة استعمال المنصة"
              : "Interactive Platform Video Tutorial"}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {currentLang === "ar"
              ? "دليل الفيديو التفاعلي: تسيير الحظيرة من الألف إلى الياء"
              : "Interactive Masterclass: Complete Fleet Management Walkthrough"}
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            {currentLang === "ar"
              ? "شاهد وتفاعل مع الشرح المرئي لكافة وظائف المنظومة: تفعيل استقلالية الحظيرة، الرادار المباشر، كاميرات المقصورة، الوكيل الذكي، وتوليد تطبيق APK."
              : "Step-by-step interactive video simulator demonstrating fleet telemetry, dashcam vigilance, AI auto-maintenance, and branded mobile app generation."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab("guide")}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold rounded-2xl text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>{currentLang === "ar" ? "الانتقال للدليل الملون" : "Open Illustrated Guide"}</span>
          </button>
        </div>
      </div>

      {/* Main Video Player & Playlist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Video Player Stage (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden relative flex flex-col">
            {/* Simulated Video Canvas / Screen */}
            <div className="aspect-video w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 relative flex flex-col justify-between p-6 sm:p-8 overflow-hidden group">
              {/* Animated Background Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

              {/* Watermark Logo */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-white text-xs font-black">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  MAEK7-TAXI VIDEO TUTORIAL
                </div>
                <div className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                  {currentChapter.duration}
                </div>
              </div>

              {/* Center Animated Presentation Slide */}
              <div className="relative z-10 my-auto text-center max-w-xl mx-auto space-y-4">
                <div className="inline-flex p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-2xl scale-105 transition-transform">
                  <Sparkles className="w-10 h-10 animate-spin [animation-duration:12s]" />
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    {currentStep.screenshotBadge}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {currentStep.title[currentLang]}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                    {currentStep.description[currentLang]}
                  </p>
                </div>

                {/* Big Center Play Overlay Button */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-2xl text-xs transition-all shadow-xl shadow-amber-500/30 inline-flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{currentLang === "ar" ? "تشغيل الفيديو والمحاكاة" : "Play Interactive Tutorial"}</span>
                  </button>
                )}
              </div>

              {/* Subtitles Bar */}
              {subtitlesEnabled && (
                <div className="relative z-10 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-center text-xs text-amber-300 font-medium">
                  {currentStep.description[currentLang]}
                </div>
              )}
            </div>

            {/* Video Controls Bar */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
              {/* Progress Scrubber Bar */}
              <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${(playbackTime / 460) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                {/* Left Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    onClick={() => {
                      setPlaybackTime(0);
                      setCurrentChapterIdx(0);
                      setCurrentStepIdx(0);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 transition-colors cursor-pointer"
                    title="Replay"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <span className="font-mono text-slate-400 text-xs">
                    {formatTime(playbackTime)} / 07:40
                  </span>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-2">
                  {/* Speed Switcher */}
                  <button
                    onClick={() => {
                      const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
                      setPlaybackSpeed(nextSpeed);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[11px] font-bold text-amber-400 cursor-pointer"
                  >
                    {playbackSpeed}x
                  </button>

                  {/* Subtitles Toggle */}
                  <button
                    onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      subtitlesEnabled
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                        : "bg-slate-800 border-slate-700 text-slate-500"
                    }`}
                    title="Toggle Subtitles"
                  >
                    <Subtitles className="w-4 h-4" />
                  </button>

                  {/* Audio Toggle */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      !isMuted
                        ? "bg-slate-800 border-slate-700 text-slate-300"
                        : "bg-slate-850 border-slate-800 text-slate-500"
                    }`}
                  >
                    {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Jump to Live Platform Action */}
          {currentStep.actionTargetTab && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {currentLang === "ar" ? "جرّب هذه الميزة مباشرة الآن في المنصة" : "Try this feature live in the platform"}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {currentLang === "ar" ? "اضغط لفتح الواجهة الفعلية وتطبيق ما شاهدته" : "Click to navigate directly to this module"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab(currentStep.actionTargetTab!)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>{currentLang === "ar" ? "فتح الواجهة" : "Open View"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Video Chapters Playlist (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center justify-between">
              <span>{currentLang === "ar" ? "فهرس محتويات الفيديو" : "Video Chapters"}</span>
              <span className="text-xs text-slate-400 font-normal">{chapters.length} محطات</span>
            </h3>

            <div className="space-y-2.5">
              {chapters.map((ch, idx) => {
                const isCurrent = currentChapterIdx === idx;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChapter(idx)}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all border flex items-start justify-between gap-3 cursor-pointer ${
                      isCurrent
                        ? "bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/40 text-amber-900 dark:text-amber-300 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-850/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${
                          isCurrent
                            ? "bg-amber-500 text-slate-950"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                        }`}
                      >
                        {isCurrent ? <Play className="w-3 h-3 fill-current" /> : idx + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate">
                          {ch.title[currentLang]}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {ch.summary[currentLang]}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {ch.duration}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
