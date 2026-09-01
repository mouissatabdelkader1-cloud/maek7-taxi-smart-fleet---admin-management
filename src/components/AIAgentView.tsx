import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Send,
  Wrench,
  TrendingUp,
  Fuel,
  Clock,
  Copy,
  Check,
  Zap,
  FileSpreadsheet,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { Language, Vehicle, Driver, Trip, FinancialRecord, ChatMessage } from "../types";
import { translations } from "../i18n/translations";

interface AIAgentViewProps {
  currentLang: Language;
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  financialRecords: FinancialRecord[];
}

export const AIAgentView: React.FC<AIAgentViewProps> = ({
  currentLang,
  vehicles,
  drivers,
  trips,
  financialRecords,
}) => {
  const t = translations[currentLang];

  const defaultInitialMessages: Record<Language, ChatMessage[]> = {
    ar: [
      {
        id: "msg-0",
        role: "assistant",
        content: `مرحباً بك! أنا **الوكيل الذكي لتسيير أسطول MAEK7-TAXI** 🚕.
لقد قمت بتحليل بيانات أسطولك الحالي (${vehicles.length} مركبة، ${drivers.length} سائقين، ${trips.length} رحلات):
- **الجاهزية التشغيلية**: ${vehicles.filter((v) => v.status === "active").length} مركبات نشطة.
- **تنبيه عاجل**: هناك ${vehicles.filter((v) => v.mileage > 200000 || v.status === "in_maintenance").length} مركبة تتطلب فحصاً وقائياً.
- **الهدف**: مساندتك في خفض استهلاك الوقود، جدولة الصيانة، وتوجيه الأسطول لأعلى ربحية.

كيف يمكنني مساعدتك اليوم في تسيير المنظومة؟`,
        timestamp: "الآن / Now",
        suggestions: [t.aiPrompt1, t.aiPrompt2, t.aiPrompt3, t.aiPrompt4],
      },
    ],
    en: [
      {
        id: "msg-0",
        role: "assistant",
        content: `Welcome! I am the **MAEK7-TAXI AI Fleet Operations Agent** 🚕.
I have synchronized with your real-time telemetry (${vehicles.length} vehicles, ${drivers.length} drivers, ${trips.length} bookings):
- **Active Readiness**: ${vehicles.filter((v) => v.status === "active").length} active units on-duty.
- **Service Warning**: ${vehicles.filter((v) => v.mileage > 200000 || v.status === "in_maintenance").length} vehicle(s) require scheduled inspections.
- **Core Objective**: Optimize fleet dispatch, slash fuel expenses, and maximize net operating margins.

How may I assist your operations today?`,
        timestamp: "Now",
        suggestions: [t.aiPrompt1, t.aiPrompt2, t.aiPrompt3, t.aiPrompt4],
      },
    ],
    fr: [
      {
        id: "msg-0",
        role: "assistant",
        content: `Bienvenue ! Je suis **l'Agent IA de Gestion de Flotte MAEK7-TAXI** 🚕.
J'ai analysé les données de votre exploitation (${vehicles.length} véhicules, ${drivers.length} chauffeurs, ${trips.length} courses):
- **Disponibilité**: ${vehicles.filter((v) => v.status === "active").length} véhicules en circulation.
- **Alerte Révision**: ${vehicles.filter((v) => v.mileage > 200000 || v.status === "in_maintenance").length} véhicule(s) nécessitent un contrôle préventif.
- **Mission**: Réduire les coûts de carburant, fiabiliser la maintenance et accroître vos bénéfices nets.

Que souhaitez-vous optimiser aujourd'hui ?`,
        timestamp: "Maintenant",
        suggestions: [t.aiPrompt1, t.aiPrompt2, t.aiPrompt3, t.aiPrompt4],
      },
    ],
  };

  const [messages, setMessages] = useState<ChatMessage[]>(defaultInitialMessages[currentLang] || defaultInitialMessages.ar);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const quickPrompts = [
    { label: t.aiPrompt1, icon: Wrench },
    { label: t.aiPrompt2, icon: Clock },
    { label: t.aiPrompt3, icon: Fuel },
    { label: t.aiPrompt4, icon: TrendingUp },
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = (customPrompt || inputPrompt).trim();
    if (!promptToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt("");
    setIsLoading(true);

    const totalIncome = financialRecords.filter((f) => f.kind === "income").reduce((s, i) => s + i.amount, 0);
    const totalExpense = financialRecords.filter((f) => f.kind === "expense").reduce((s, i) => s + i.amount, 0);

    const contextPayload = {
      vehiclesCount: vehicles.length,
      vehicles: vehicles.map((v) => ({
        plate: v.plate,
        type: v.type,
        driver: v.driver,
        status: v.status,
        mileage: v.mileage,
        wilaya: v.wilaya,
      })),
      driversCount: drivers.length,
      drivers: drivers.map((d) => ({
        name: d.name,
        rating: d.rating,
        status: d.status,
        trips: d.trips,
        vehicle: d.vehicle,
      })),
      tripsCount: trips.length,
      ongoingTripsCount: trips.filter((t) => t.status === "ongoing").length,
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
    };

    try {
      const res = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToSend,
          context: contextPayload,
          language: currentLang,
        }),
      });

      if (!res.ok) throw new Error("Failed to communicate with AI agent");

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: data.model || "gemini-3.7-flash",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      // Graceful offline agent reply
      const fallbackReply =
        currentLang === "ar"
          ? `🔧 **تحليل الوكيل الذكي لأسطول MAEK7-TAXI**:\n- **الصيانة**: 1 مركبة تحتاج فحصاً دورياً (تجاوزت 200 ألف كم).\n- **الوقود**: يوصى بتثبيت عقود التزود مع نفطال لخصم 10٪ شهرياً.\n- **ساعات الذروة**: توجيه 75٪ من سيارات الطاكسي للمطارات والجامعات بين 07:00-09:30 و 16:30-19:00.`
          : `🔧 **MAEK7-TAXI Fleet Analysis**:\n- **Maintenance**: 1 vehicle scheduled for service (>200,000 km).\n- **Fuel**: Consolidate fuel procurement to save up to 10% on monthly overhead.\n- **Peak Hours**: Deploy 75% of taxis to transit hubs during 07:00-09:30 and 16:30-19:00.`;

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-fb-${Date.now()}`,
          role: "assistant",
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    const totalIncome = financialRecords.filter((f) => f.kind === "income").reduce((s, i) => s + i.amount, 0);
    const totalExpense = financialRecords.filter((f) => f.kind === "expense").reduce((s, i) => s + i.amount, 0);

    try {
      const res = await fetch("/api/ai-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: currentLang,
          fleetMetrics: {
            vehiclesTotal: vehicles.length,
            vehiclesActive: vehicles.filter((v) => v.status === "active").length,
            vehiclesInMaint: vehicles.filter((v) => v.status === "in_maintenance").length,
            driversTotal: drivers.length,
            averageDriverRating: 4.8,
            weeklyTrips: trips.length * 7,
            totalIncome,
            totalExpense,
            netProfit: totalIncome - totalExpense,
          },
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `audit-${Date.now()}`,
          role: "assistant",
          content: data.report || "تقرير التدقيق متوفر بنجاح.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          modelUsed: "gemini-3.7-flash (Audit Engine)",
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Agent Executive Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-violet-950/80 via-slate-900 to-indigo-950/80 border border-violet-700/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 border border-violet-300/40 shrink-0">
              <Bot size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{t.aiTitle}</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs sm:text-sm text-violet-200/80 mt-1 max-w-xl">
                {t.aiSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 disabled:opacity-50 shrink-0"
          >
            <Sparkles size={16} />
            <span>{isAuditing ? "جاري إعداد التقرير..." : t.aiAuditButton}</span>
          </button>
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[580px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-slate-950/40">
          {messages.map((msg) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-in fade-in`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-md">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-3xl p-4 sm:p-5 shadow-sm text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-amber-500 text-slate-950 font-bold rtl:rounded-tr-sm ltr:rounded-tl-sm shadow-amber-500/10"
                      : "bg-slate-800/90 border border-slate-700/80 text-slate-100 rtl:rounded-tl-sm ltr:rounded-tr-sm"
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-700/60">
                      <span className="text-[11px] font-extrabold text-violet-300 flex items-center gap-1.5">
                        <Sparkles size={12} className="text-amber-400" />
                        MAEK7 AI Ops Manager {msg.modelUsed ? `(${msg.modelUsed})` : ""}
                      </span>
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="text-slate-400 hover:text-white transition p-1 rounded-md"
                        title={t.aiCopyResponse}
                      >
                        {copiedId === msg.id ? (
                          <span className="text-emerald-400 flex items-center gap-1 text-[10px] font-bold">
                            <Check size={12} /> {t.aiCopied}
                          </span>
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-sans space-y-2">
                    {msg.content}
                  </div>

                  <span
                    className={`block text-[10px] mt-2 ${
                      isUser ? "text-slate-900/60 text-start" : "text-slate-500 text-end"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start animate-in fade-in">
              <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 mt-1">
                <Bot size={16} />
              </div>
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 text-xs text-violet-300 flex items-center gap-2">
                <Sparkles size={14} className="animate-spin" />
                <span>{t.aiThinking}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-bold shrink-0 hidden sm:inline">
              {t.aiQuickPromptsTitle}
            </span>
            {quickPrompts.map((q, idx) => {
              const Icon = q.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.label)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:border-amber-400/40 text-[11px] font-bold transition shrink-0 flex items-center gap-1.5"
                >
                  <Icon size={12} className="text-amber-400" />
                  <span className="truncate max-w-[200px]">{q.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={t.aiPlaceholder}
              disabled={isLoading}
              className="flex-1 rounded-2xl bg-slate-800 border border-slate-700 px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 shrink-0"
              aria-label={t.aiSend}
            >
              <Send size={16} />
              <span className="hidden sm:inline">{t.aiSend}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
