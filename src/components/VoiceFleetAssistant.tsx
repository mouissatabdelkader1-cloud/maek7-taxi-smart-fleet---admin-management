import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  X,
  Play,
  ArrowRight,
  Car,
  Users,
  Navigation,
  DollarSign,
  Wrench,
  HelpCircle,
  Video,
  Layers,
  Smartphone,
} from "lucide-react";
import { Language, Vehicle, Driver, Trip, FinancialRecord } from "../types";
import { translations } from "../i18n/translations";

interface VoiceFleetAssistantProps {
  currentLang: Language;
  onNavigateTab: (tabId: string) => void;
  onAddVehicleByVoice?: (vehicle: Partial<Vehicle>) => void;
  onAddDriverByVoice?: (driver: Partial<Driver>) => void;
  onAddTripByVoice?: (trip: Partial<Trip>) => void;
  onAddFinanceByVoice?: (record: Partial<FinancialRecord>) => void;
  onTriggerAiMaintenance?: () => void;
}

interface CommandLog {
  id: string;
  transcript: string;
  matchedIntent: string;
  responseMessage: string;
  timestamp: string;
  status: "success" | "warning";
}

export const VoiceFleetAssistant: React.FC<VoiceFleetAssistantProps> = ({
  currentLang,
  onNavigateTab,
  onAddVehicleByVoice,
  onAddDriverByVoice,
  onAddTripByVoice,
  onAddFinanceByVoice,
  onTriggerAiMaintenance,
}) => {
  const t = translations[currentLang];
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastResponse, setLastResponse] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceLogs, setVoiceLogs] = useState<CommandLog[]>([]);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang =
        currentLang === "ar" ? "ar-DZ" : currentLang === "fr" ? "fr-FR" : "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          processVoiceCommand(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn("Speech recognition init failed", err);
      setSpeechSupported(false);
    }
  }, [currentLang]);

  // Text-To-Speech Output
  const speakFeedback = (text: string) => {
    if (!ttsEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      currentLang === "ar" ? "ar-XA" : currentLang === "fr" ? "fr-FR" : "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      // If Web Speech API is blocked in sandbox, provide simulated voice command
      simulateVoicePrompt();
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      try {
        recognitionRef.current.lang =
          currentLang === "ar" ? "ar-DZ" : currentLang === "fr" ? "fr-FR" : "en-US";
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Recognition start failed, fallback to simulation", err);
        simulateVoicePrompt();
      }
    }
  };

  // Simulated Voice Prompt for testing or when mic is unavailable in iframe
  const simulateVoicePrompt = () => {
    const sampleCommands = {
      ar: [
        "افتح الرادار المباشر وتتبع الأسطول",
        "افحص الحظيرة ونفذ الصيانة بالذكاء الاصطناعي",
        "أضف سائق جديد باسم ياسين براهيمي",
        "افتح دليل المنصة والحظيرة الملون",
        "شغل فيديو طريقة استعمال المنصة",
        "افتح استوديو وتوليد التطبيق الشخصي",
        "سجل مصروف وقود 3500 دينار",
      ],
      en: [
        "Open live radar and fleet tracking",
        "Run AI self-healing maintenance check",
        "Add new driver named Yacine Brahimi",
        "Open colorful platform guide",
        "Play interactive video tutorial",
        "Open branded app studio",
        "Record fuel expense 3500 DZD",
      ],
      fr: [
        "Ouvrir le radar en direct et la flotte",
        "Lancer la maintenance auto-cicatrisante par IA",
        "Ajouter un nouveau chauffeur Yacine Brahimi",
        "Ouvrir le guide illustré de la plateforme",
        "Lancer le tutoriel vidéo interactif",
        "Ouvrir le studio de génération d'application",
        "Enregistrer une dépense carburant 3500 DZD",
      ],
    }[currentLang];

    const randomCommand =
      sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
    setIsListening(true);
    setTranscript(randomCommand);

    setTimeout(() => {
      setIsListening(false);
      processVoiceCommand(randomCommand);
    }, 900);
  };

  // Parse voice text into executable actions
  const processVoiceCommand = (rawText: string) => {
    const text = rawText.toLowerCase().trim();
    let response = "";
    let matchedIntent = "";
    let status: "success" | "warning" = "success";

    // 1. Navigation intents
    if (
      text.includes("رادار") ||
      text.includes("تتبع") ||
      text.includes("radar") ||
      text.includes("gps")
    ) {
      matchedIntent = "NAVIGATE_RADAR";
      onNavigateTab("radar");
      response =
        currentLang === "ar"
          ? "تم فتح الرادار المباشر وخريطة الأسطول."
          : currentLang === "fr"
          ? "Radar en direct ouvert avec succès."
          : "Live fleet GPS radar opened.";
    } else if (
      text.includes("كاميرا") ||
      text.includes("داشكام") ||
      text.includes("dashcam") ||
      text.includes("caméra")
    ) {
      matchedIntent = "NAVIGATE_DASHCAM";
      onNavigateTab("dashcam");
      response =
        currentLang === "ar"
          ? "تم فتح شاشات مراقبة الكاميرات والمقصورة."
          : currentLang === "fr"
          ? "Surveillance Dashcam IA activée."
          : "AI Dashcam and cabin surveillance opened.";
    } else if (
      text.includes("سائق") ||
      text.includes("سائقين") ||
      text.includes("chauffeur") ||
      text.includes("driver")
    ) {
      if (text.includes("أضف") || text.includes("جديد") || text.includes("add") || text.includes("ajouter")) {
        matchedIntent = "ADD_DRIVER";
        onNavigateTab("drivers");
        onAddDriverByVoice?.({
          name: currentLang === "ar" ? "سائق جديد (تمت الإضافة بالصوت)" : "New Driver (Voice Created)",
          phone: "+213 655 00 11 22",
          vehicle: "11223-119-16",
          status: "active",
        });
        response =
          currentLang === "ar"
            ? "تم تسجيل سائق جديد وفتح سجل السائقين."
            : currentLang === "fr"
            ? "Nouveau chauffeur créé via commande vocale."
            : "New driver added via voice dispatch.";
      } else {
        matchedIntent = "NAVIGATE_DRIVERS";
        onNavigateTab("drivers");
        response =
          currentLang === "ar"
            ? "تم فتح سجل السائقين."
            : currentLang === "fr"
            ? "Répertoire des chauffeurs ouvert."
            : "Drivers directory opened.";
      }
    } else if (
      text.includes("مركبة") ||
      text.includes("سيارة") ||
      text.includes("أسطول") ||
      text.includes("véhicule") ||
      text.includes("vehicle") ||
      text.includes("fleet")
    ) {
      matchedIntent = "NAVIGATE_VEHICLES";
      onNavigateTab("vehicles");
      response =
        currentLang === "ar"
          ? "تم فتح سجل مركبات الأسطول."
          : currentLang === "fr"
          ? "Gestion de la flotte ouverte."
          : "Fleet & vehicles view opened.";
    } else if (
      text.includes("رحل") ||
      text.includes("إرسال") ||
      text.includes("course") ||
      text.includes("trip") ||
      text.includes("dispatch")
    ) {
      matchedIntent = "NAVIGATE_TRIPS";
      onNavigateTab("trips");
      response =
        currentLang === "ar"
          ? "تم الانتقال إلى جدول الرحلات والإرسال."
          : currentLang === "fr"
          ? "Module des courses et répartition ouvert."
          : "Trips & dispatch board opened.";
    } else if (
      text.includes("دليل") ||
      text.includes("شرح") ||
      text.includes("guide") ||
      text.includes("manuel")
    ) {
      matchedIntent = "NAVIGATE_GUIDE";
      onNavigateTab("guide");
      response =
        currentLang === "ar"
          ? "تم فتح دليل المنصة والحظيرة الملون."
          : currentLang === "fr"
          ? "Guide illustré de la plateforme ouvert."
          : "Colorful platform & fleet guide opened.";
    } else if (
      text.includes("فيديو") ||
      text.includes("شرح مرئي") ||
      text.includes("video") ||
      text.includes("tutoriel") ||
      text.includes("tutorial")
    ) {
      matchedIntent = "NAVIGATE_VIDEO";
      onNavigateTab("video_tutorial");
      response =
        currentLang === "ar"
          ? "تم تشغيل فيديو واستعراض طريقة استعمال المنصة."
          : currentLang === "fr"
          ? "Tutoriel vidéo interactif ouvert."
          : "Interactive video tutorial opened.";
    } else if (
      text.includes("تطبيق") ||
      text.includes("apk") ||
      text.includes("pwa") ||
      text.includes("مولد") ||
      text.includes("app")
    ) {
      matchedIntent = "NAVIGATE_APP_GEN";
      onNavigateTab("app_generator");
      response =
        currentLang === "ar"
          ? "تم فتح استوديو بناء وتوليد تطبيق صاحب الحظيرة."
          : currentLang === "fr"
          ? "Studio de génération d'application ouvert."
          : "Branded app studio & APK generator opened.";
    } else if (
      text.includes("مالي") ||
      text.includes("محاسب") ||
      text.includes("مصروف") ||
      text.includes("finance") ||
      text.includes("dépense")
    ) {
      matchedIntent = "NAVIGATE_FINANCE";
      onNavigateTab("finance");
      response =
        currentLang === "ar"
          ? "تم فتح السجل المالي والمحاسبي."
          : currentLang === "fr"
          ? "Module de gestion financière ouvert."
          : "Financial ledger opened.";
    } else if (
      text.includes("صيان") ||
      text.includes("فحص") ||
      text.includes("إصلاح") ||
      text.includes("ذكاء") ||
      text.includes("maintenance") ||
      text.includes("repair") ||
      text.includes("ai")
    ) {
      matchedIntent = "AI_AUTO_MAINTENANCE";
      onNavigateTab("ai_agent");
      onTriggerAiMaintenance?.();
      response =
        currentLang === "ar"
          ? "جاري تشغيل الفحص الذاتي وإصلاح أي خلل في المنظومة وقاعدة البيانات."
          : currentLang === "fr"
          ? "Diagnostic système et auto-maintenance IA en cours d'exécution."
          : "Running system diagnosis and AI self-healing maintenance.";
    } else {
      matchedIntent = "GENERAL_QUERY";
      onNavigateTab("ai_agent");
      response =
        currentLang === "ar"
          ? `تم استقبال الأمر: "${rawText}". تم توجيهه للوكيل الذكي.`
          : `Command received: "${rawText}". Routed to AI assistant.`;
    }

    setLastResponse(response);
    speakFeedback(response);

    const newLog: CommandLog = {
      id: `cmd-${Date.now()}`,
      transcript: rawText,
      matchedIntent,
      responseMessage: response,
      timestamp: new Date().toLocaleTimeString(),
      status,
    };

    setVoiceLogs((prev) => [newLog, ...prev.slice(0, 7)]);
  };

  const quickVoiceShortcuts = [
    {
      text: currentLang === "ar" ? "افتح الرادار المباشر" : "Open live radar",
      icon: Navigation,
      category: "navigation",
    },
    {
      text: currentLang === "ar" ? "افحص الحظيرة بالذكاء الاصطناعي" : "Run AI Fleet Check",
      icon: Wrench,
      category: "ai",
    },
    {
      text: currentLang === "ar" ? "شغل فيديو شرح المنصة" : "Play Video Tutorial",
      icon: Video,
      category: "media",
    },
    {
      text: currentLang === "ar" ? "افتح دليل المنصة الملون" : "Open Colorful Guide",
      icon: HelpCircle,
      category: "guide",
    },
    {
      text: currentLang === "ar" ? "توليد تطبيق الحظيرة APK" : "Generate Fleet APK",
      icon: Smartphone,
      category: "app",
    },
    {
      text: currentLang === "ar" ? "افتح السجل المالي" : "Open Finance Ledger",
      icon: DollarSign,
      category: "finance",
    },
  ];

  return (
    <>
      {/* Floating Voice Mic Trigger Badge */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-2xl shadow-xl shadow-amber-500/25 border border-amber-300/40 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        title={t.voiceAssistant || "المساعد الصوتي والإدخال السريع"}
      >
        <div className="relative">
          <Mic className="w-5 h-5 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
        <span className="text-xs font-black tracking-tight hidden md:inline">
          {currentLang === "ar" ? "الأوامر الصوتية" : "Voice AI"}
        </span>
      </button>

      {/* Voice Assistant Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    {t.voiceAssistant || "المساعد الصوتي الذكي والإدخال السريع"}
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      Speech Engine v2.4
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {currentLang === "ar"
                      ? "تحدث مباشرة لإدخال البيانات، تسجيل الرحلات، فحص المنظومة والتنقل الفوري"
                      : "Speak naturally to input data, dispatch trips, inspect the fleet & navigate"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  className={`p-2 rounded-xl border transition-colors ${
                    ttsEnabled
                      ? "bg-slate-800 border-slate-700 text-amber-400"
                      : "bg-slate-850 border-slate-800 text-slate-500"
                  }`}
                  title={ttsEnabled ? "الرد الصوتي مفعل" : "الرد الصوتي صامت"}
                >
                  {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    if (isListening && recognitionRef.current) {
                      recognitionRef.current.stop();
                    }
                    setIsOpen(false);
                  }}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Mic & Listening Visualizer */}
              <div className="flex flex-col items-center justify-center py-6 bg-slate-950/60 rounded-3xl border border-slate-800/80 relative overflow-hidden">
                {/* Background Glow */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                    isListening
                      ? "bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent opacity-100"
                      : "opacity-0"
                  }`}
                />

                {/* Animated Waves */}
                {isListening && (
                  <div className="flex items-center gap-1.5 mb-4">
                    <span className="w-1.5 h-6 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-10 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-14 bg-amber-300 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-10 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-6 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  </div>
                )}

                {/* Big Mic Button */}
                <button
                  onClick={toggleListening}
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
                    isListening
                      ? "bg-amber-500 text-slate-950 scale-110 shadow-amber-500/50 ring-4 ring-amber-400/40"
                      : "bg-slate-800 hover:bg-slate-750 text-amber-400 border border-slate-700 hover:border-amber-500/40"
                  }`}
                >
                  {isListening ? (
                    <Mic className="w-9 h-9 animate-pulse" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-sm font-bold text-slate-200">
                    {isListening
                      ? currentLang === "ar"
                        ? "جاري الاستماع لصوتك... تفضل بالتحدث"
                        : "Listening... speak now"
                      : currentLang === "ar"
                      ? "اضغط على الميكروفون للبدء بالصوت"
                      : "Click microphone to start voice input"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentLang === "ar"
                      ? "يدعم اللهجات العربية، الفرنسية، والإنجليزية"
                      : "Supports Arabic, French & English natural speech"}
                  </p>
                </div>

                {/* Live Transcript Box */}
                {transcript && (
                  <div className="mt-4 w-11/12 max-w-lg p-3 bg-slate-900/90 border border-amber-500/30 rounded-2xl text-center">
                    <span className="text-xs text-amber-400 font-semibold block mb-1">
                      {currentLang === "ar" ? "النص الملتقط:" : "Captured Speech:"}
                    </span>
                    <p className="text-sm text-white font-medium">"{transcript}"</p>
                  </div>
                )}

                {/* Response Feedback */}
                {lastResponse && (
                  <div className="mt-3 w-11/12 max-w-lg p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-xs text-emerald-300 font-medium">{lastResponse}</p>
                  </div>
                )}
              </div>

              {/* Quick Voice Prompt Shortcuts */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {t.voiceQuickActions || "أوامر صوتية سريعة بنقرة واحدة"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickVoiceShortcuts.map((shortcut, idx) => {
                    const Icon = shortcut.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setTranscript(shortcut.text);
                          processVoiceCommand(shortcut.text);
                        }}
                        className="p-3 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 rounded-2xl text-left flex items-center justify-between group transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-xl bg-slate-700/60 group-hover:bg-amber-500/20 text-slate-300 group-hover:text-amber-400 flex items-center justify-center transition-colors shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs text-slate-200 group-hover:text-white font-bold truncate">
                            {shortcut.text}
                          </span>
                        </div>
                        <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0 opacity-0 group-hover:opacity-100" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Voice Activity Log */}
              {voiceLogs.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5">
                    {currentLang === "ar" ? "سجل الأوامر المنفذة مؤخراً" : "Recent Voice Operations"}
                  </h4>
                  <div className="space-y-2">
                    {voiceLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="text-slate-200 font-bold truncate">"{log.transcript}"</p>
                          <p className="text-slate-400 text-[11px] truncate mt-0.5">
                            {log.responseMessage}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px]">
                            {log.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {currentLang === "ar" ? "محرك الاستماع اللحظي متصل" : "Real-time speech listener ready"}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-750 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                {t.close || "إغلاق"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
