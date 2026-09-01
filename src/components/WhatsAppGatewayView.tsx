import React, { useState } from "react";
import {
  MessageCircle,
  Send,
  Users,
  Route,
  CheckCheck,
  Copy,
  Sparkles,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Language, Driver, Trip, Vehicle } from "../types";
import { translations } from "../i18n/translations";

interface WhatsAppGatewayViewProps {
  currentLang: Language;
  drivers: Driver[];
  trips: Trip[];
  vehicles: Vehicle[];
  institutionName: string;
}

export const WhatsAppGatewayView: React.FC<WhatsAppGatewayViewProps> = ({
  currentLang,
  drivers,
  trips,
  vehicles,
  institutionName,
}) => {
  const t = translations[currentLang];

  const [recipientType, setRecipientType] = useState<"driver" | "custom">("driver");
  const [selectedDriverId, setSelectedDriverId] = useState<string | number>(drivers[0]?.id || "");
  const [customPhone, setCustomPhone] = useState("");
  const [templateType, setTemplateType] = useState<"dispatch" | "maintenance" | "vip" | "custom">("dispatch");
  const [selectedTripId, setSelectedTripId] = useState<string | number>(trips[0]?.id || "");
  const [customMessage, setCustomMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedDriver = drivers.find((d) => String(d.id) === String(selectedDriverId)) || drivers[0];
  const selectedTrip = trips.find((tr) => String(tr.id) === String(selectedTripId)) || trips[0];

  const cleanPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("213")) return digits;
    if (digits.startsWith("0")) return "213" + digits.slice(1);
    return digits;
  };

  // Generate Message preview based on template
  const getCompiledMessage = () => {
    if (templateType === "dispatch" && selectedTrip) {
      return currentLang === "ar"
        ? `🚖 *مهمة رحلة جديدة من إدارة ${institutionName}*:\n- السائق: ${selectedDriver?.name}\n- خط السير: ${selectedTrip.from} ➔ ${selectedTrip.to}\n- الموعد: اليوم الساعة ${selectedTrip.time}\n- رقم المركبة: ${selectedTrip.vehicle}\n- السعر: ${selectedTrip.price} دج\nيرجى فتح التطبيق وتأكيد انطلاق الرحلة.`
        : currentLang === "fr"
        ? `🚖 *Nouvelle mission de course - ${institutionName}*:\n- Chauffeur: ${selectedDriver?.name}\n- Trajet: ${selectedTrip.from} ➔ ${selectedTrip.to}\n- Heure: Aujourd'hui à ${selectedTrip.time}\n- Véhicule: ${selectedTrip.vehicle}\n- Tarif: ${selectedTrip.price} DZD\nMerci d'ouvrir l'application pour démarrer la course.`
        : `🚖 *New Dispatch Mission - ${institutionName}*:\n- Driver: ${selectedDriver?.name}\n- Route: ${selectedTrip.from} ➔ ${selectedTrip.to}\n- Time: Today at ${selectedTrip.time}\n- Vehicle: ${selectedTrip.vehicle}\n- Fare: ${selectedTrip.price} DZD\nPlease start the trip on your mobile app.`;
    }

    if (templateType === "maintenance") {
      return currentLang === "ar"
        ? `⚠️ *تنبيه صيانة وقائية - ${institutionName}*:\nمرحباً كابتن ${selectedDriver?.name}، يُرجى التوجه لمركز الخدمة المعتمد لإجراء الفحص الدوري وتغيير الزيت لمركبتك (${selectedDriver?.vehicle}) حفاظاً على سلامتك وجاهزية الأسطول.`
        : currentLang === "fr"
        ? `⚠️ *Avis de Révision Préventive - ${institutionName}*:\nBonjour Capitaine ${selectedDriver?.name}, merci de vous présenter au centre technique pour la révision et la vidange de votre véhicule (${selectedDriver?.vehicle}).`
        : `⚠️ *Preventive Maintenance Notice - ${institutionName}*:\nHello Captain ${selectedDriver?.name}, please report to the maintenance bay for scheduled vehicle inspection and fluid renewal on unit (${selectedDriver?.vehicle}).`;
    }

    if (templateType === "vip") {
      return currentLang === "ar"
        ? `✨ *خدمة VIP رجال الأعمال - ${institutionName}*:\nمرحباً بك، سيارتكم الفاخرة مع الكابتن ${selectedDriver?.name} بانتظاركم في الموعد المحدد. نتمنى لكم رحلة راقية وآمنة.`
        : currentLang === "fr"
        ? `✨ *Service VIP Affaires - ${institutionName}*:\nBienvenue, votre véhicule VIP avec le Capitaine ${selectedDriver?.name} est prêt pour votre transfert. Excellent voyage.`
        : `✨ *VIP Executive Transfer - ${institutionName}*:\nWelcome! Your premium executive vehicle with Captain ${selectedDriver?.name} is on schedule for your transfer. Have a pleasant trip.`;
    }

    return customMessage || "رسالة مخصصة من MAEK7-TAXI";
  };

  const finalMessage = getCompiledMessage();
  const targetPhoneNumber =
    recipientType === "driver" ? cleanPhone(selectedDriver?.phone || "") : cleanPhone(customPhone);

  const whatsAppUrl = `https://wa.me/${targetPhoneNumber}?text=${encodeURIComponent(finalMessage)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(finalMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
          <MessageCircle size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">{t.whatsAppTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{t.whatsAppSubtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Controls */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">{t.whatsAppRecipient}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRecipientType("driver")}
                className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  recipientType === "driver"
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Users size={14} />
                <span>سائق من الأسطول</span>
              </button>
              <button
                type="button"
                onClick={() => setRecipientType("custom")}
                className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  recipientType === "custom"
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Phone size={14} />
                <span>رقم مخصص / عميل</span>
              </button>
            </div>
          </div>

          {recipientType === "driver" ? (
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5">اختر السائق</label>
              <select
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                className="w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.phone}) - {d.vehicle}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5">رقم الهاتف (الجزائر: 05/06/07)</label>
              <input
                type="text"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="0550123456"
                className="w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                dir="ltr"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">{t.whatsAppTemplate}</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "dispatch", label: "إشعار تفويج رحلة" },
                { id: "maintenance", label: "تذكير صيانة" },
                { id: "vip", label: "استقبال VIP" },
                { id: "custom", label: "نص مخصص" },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplateType(tpl.id as any)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition ${
                    templateType === tpl.id
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {templateType === "dispatch" && (
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5">اختر الرحلة للربط</label>
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {trips.map((tr) => (
                  <option key={tr.id} value={tr.id}>
                    {tr.from} ➔ {tr.to} ({tr.time} - {tr.price} دج)
                  </option>
                ))}
              </select>
            </div>
          )}

          {templateType === "custom" && (
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5">نص الرسالة</label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                placeholder="اكتب رسالتك هنا..."
                className="w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          )}
        </div>

        {/* Live WhatsApp Preview Screen */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                <MessageCircle size={14} />
                معاينة رسالة WhatsApp المباشرة
              </span>
              <span className="text-[11px] font-mono text-slate-400" dir="ltr">
                +{targetPhoneNumber || "213..."}
              </span>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-emerald-900/30 text-xs text-slate-100 font-sans leading-relaxed whitespace-pre-wrap">
              {finalMessage}
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition shadow-lg shadow-emerald-900/40"
            >
              <Send size={16} />
              <span>{t.whatsAppSend}</span>
            </a>

            <button
              onClick={handleCopy}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700"
            >
              {copied ? <CheckCheck size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? t.aiCopied : "نسخ نص الرسالة"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
