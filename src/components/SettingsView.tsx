import React, { useState } from "react";
import {
  Settings,
  Building,
  User,
  Coins,
  MapPin,
  Save,
  Download,
  RotateCcw,
  Check,
  ShieldCheck,
  Globe2,
} from "lucide-react";
import { Language } from "../types";
import { translations } from "../i18n/translations";

interface SettingsViewProps {
  currentLang: Language;
  institutionName: string;
  supervisorName: string;
  onSaveSettings: (settings: {
    institutionName: string;
    supervisorName: string;
    wilayaHQ: string;
    currencySymbol: string;
  }) => void;
  onExportData: () => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentLang,
  institutionName: initialInst,
  supervisorName: initialSup,
  onSaveSettings,
  onExportData,
  onResetData,
}) => {
  const t = translations[currentLang];

  const [institutionName, setInstitutionName] = useState(initialInst);
  const [supervisorName, setSupervisorName] = useState(initialSup);
  const [wilayaHQ, setWilayaHQ] = useState("16 - الجزائر العاصمة (Algiers)");
  const [currencySymbol, setCurrencySymbol] = useState("DZD (دج)");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      institutionName,
      supervisorName,
      wilayaHQ,
      currencySymbol,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">{t.settingsTitle}</h1>
        <p className="text-sm text-slate-400 mt-0.5">{t.settingsSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Information */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <h2 className="text-base font-black text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building size={18} className="text-amber-400" />
            <span>بيانات المؤسسة والشعار / Enterprise Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">{t.companyNameLabel}</label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">{t.supervisorNameLabel}</label>
              <input
                type="text"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                className="w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">المقر الرئيسي (الولاية)</label>
              <input
                type="text"
                value={wilayaHQ}
                onChange={(e) => setWilayaHQ(e.target.value)}
                className="w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">العملة الافتراضية / Base Currency</label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition shadow-lg shadow-amber-500/20"
            >
              {savedSuccess ? <Check size={16} /> : <Save size={16} />}
              <span>{savedSuccess ? "تم الحفظ بنجاح!" : t.saveChanges}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Data Management & Export Tools */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-base font-black text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <ShieldCheck size={18} className="text-emerald-400" />
          <span>تصدير ونسخ البيانات / Data Vault & Backup</span>
        </h2>

        <p className="text-xs text-slate-400 leading-relaxed">
          يمكنك تصدير قاعدة بيانات الأسطول الحالية (المركبات، السائقين، الرحلات، السجلات المالية) كملف JSON كامل أو إعادة تعيين النظام للبيانات الافتراضية.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onExportData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition"
          >
            <Download size={15} />
            <span>تصدير بيانات الأسطول (JSON)</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("هل أنت متأكد من إعادة تعيين البيانات إلى الحالة الافتراضية؟")) {
                onResetData();
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition"
          >
            <RotateCcw size={15} />
            <span>إعادة تعيين البيانات الافتراضية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
