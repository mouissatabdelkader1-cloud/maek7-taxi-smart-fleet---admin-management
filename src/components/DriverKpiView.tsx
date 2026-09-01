import React, { useState } from "react";
import {
  Award,
  Trophy,
  Star,
  ShieldCheck,
  Zap,
  TrendingUp,
  Percent,
  DollarSign,
  QrCode,
  Medal,
  Sparkles,
  Share2,
  CheckCircle2,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Language, DriverScorecard, Driver } from "../types";
import { initialDriverScorecards } from "../data/mockData";

interface DriverKpiViewProps {
  currentLang: Language;
  drivers: Driver[];
  institutionName: string;
}

export const DriverKpiView: React.FC<DriverKpiViewProps> = ({
  currentLang,
  drivers,
  institutionName,
}) => {
  const isAr = currentLang === "ar";
  const isFr = currentLang === "fr";

  const [scorecards, setScorecards] = useState<DriverScorecard[]>(initialDriverScorecards);
  const [selectedDriver, setSelectedDriver] = useState<DriverScorecard>(scorecards[0]);
  const [bonusTargetTrips, setBonusTargetTrips] = useState<number>(100);
  const [bonusPerTripAboveTarget, setBonusPerTripAboveTarget] = useState<number>(500);

  // Badge Color & Icon Helper
  const getBadgeInfo = (badge: string) => {
    switch (badge) {
      case "diamond":
        return {
          label: isAr ? "الدرجة الماسية (Diamond)" : "Diamond Tier",
          color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
          icon: Sparkles,
        };
      case "gold":
        return {
          label: isAr ? "الدرجة الذهبية (Gold)" : "Gold Tier",
          color: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          icon: Trophy,
        };
      case "silver":
        return {
          label: isAr ? "الدرجة الفضية (Silver)" : "Silver Tier",
          color: "bg-slate-400/20 text-slate-300 border-slate-400/40",
          icon: Medal,
        };
      default:
        return {
          label: isAr ? "الدرجة البرونزية (Bronze)" : "Bronze Tier",
          color: "bg-orange-500/20 text-orange-300 border-orange-500/40",
          icon: Award,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Trophy className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              {isAr
                ? "لوحة تنقيط وتقييم السائقين ومكافآت التميز"
                : isFr
                ? "Évaluation & Tableau d'Honneur Chauffeurs"
                : "Driver KPI Leaderboard & Performance Gamification"}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                {isAr ? "نظام الحوافز النشط" : "Bonus Active"}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {isAr
                ? `مؤشرات السلامة المرورية، انضباط المواعيد، التقييمات، وحساب المكافآت التشجيعية لـ ${institutionName}`
                : `Safety scoring, punctuality index, passenger ratings, and automated performance bonuses`}
            </p>
          </div>
        </div>
      </div>

      {/* Podium Top 3 Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scorecards.slice(0, 3).map((sc, index) => {
          const badge = getBadgeInfo(sc.badge);
          const BadgeIcon = badge.icon;
          const isFirst = index === 0;

          return (
            <div
              key={sc.driverId}
              onClick={() => setSelectedDriver(sc)}
              className={`cursor-pointer rounded-3xl p-5 sm:p-6 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                isFirst
                  ? "bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 border-amber-500/40 shadow-xl shadow-amber-500/10 scale-[1.02]"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              {isFirst && (
                <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-lg">
                  👑 {isAr ? "سائق الشهر الأول" : "#1 Driver of the Month"}
                </span>
              )}

              <div>
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center text-xl font-black text-amber-400 shadow">
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base">{sc.driverName}</h3>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{sc.customerRating}</span>
                      <span className="text-slate-400 font-normal">({sc.totalTripsMonth} {isAr ? "رحلة" : "trips"})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>{isAr ? "مؤشر السلامة:" : "Safety Score:"}</span>
                    <span className="font-mono font-black text-emerald-400">{sc.safetyScore}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>{isAr ? "انضباط المواعيد:" : "Punctuality:"}</span>
                    <span className="font-mono font-black text-blue-400">{sc.punctualityScore}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>{isAr ? "الإيرادات المحققة:" : "Revenue:"}</span>
                    <span className="font-mono font-black text-white">{sc.revenueGenerated.toLocaleString()} دج</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black border flex items-center gap-1 ${badge.color}`}>
                  <BadgeIcon className="w-3 h-3" />
                  {badge.label}
                </span>

                <span className="text-emerald-400 font-mono font-black text-xs">
                  +{sc.bonusEarned.toLocaleString()} دج
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Detailed Scorecards & Bonus Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scorecards Table (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <h3 className="text-base font-black text-white flex items-center justify-between">
            <span>{isAr ? "جدول التقييم الشامل للكوادر" : "All Drivers Scorecard Matrix"}</span>
            <span className="text-xs text-slate-400 font-normal">{scorecards.length} {isAr ? "سائقين مسجلين" : "drivers"}</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300 text-right rtl:text-right ltr:text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-black uppercase">
                  <th className="py-3 px-4">{isAr ? "السائق" : "Driver"}</th>
                  <th className="py-3 px-4">{isAr ? "التقييم" : "Rating"}</th>
                  <th className="py-3 px-4">{isAr ? "السلامة" : "Safety"}</th>
                  <th className="py-3 px-4">{isAr ? "الانضباط" : "Punctuality"}</th>
                  <th className="py-3 px-4">{isAr ? "الرحلات" : "Trips"}</th>
                  <th className="py-3 px-4">{isAr ? "المكافأة" : "Bonus"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-bold">
                {scorecards.map((sc) => (
                  <tr
                    key={sc.driverId}
                    onClick={() => setSelectedDriver(sc)}
                    className={`cursor-pointer hover:bg-slate-800/60 transition ${
                      selectedDriver.driverId === sc.driverId ? "bg-slate-800/40" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-black text-white">
                      {sc.driverName}
                      <span className="block text-[10px] text-amber-400 font-normal">
                        {sc.awards[0]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-amber-400 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {sc.customerRating}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-mono">{sc.safetyScore}%</td>
                    <td className="py-3 px-4 text-blue-400 font-mono">{sc.punctualityScore}%</td>
                    <td className="py-3 px-4 font-mono text-white">{sc.totalTripsMonth}</td>
                    <td className="py-3 px-4 text-emerald-400 font-mono font-black">
                      +{sc.bonusEarned.toLocaleString()} دج
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Driver Digital Badge & Bonus Simulator (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Digital Badge Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                {isAr ? "بطاقة السائق الرقمية" : "Driver ID Card"}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{institutionName}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
                {selectedDriver.driverName.charAt(0)}
              </div>
              <div>
                <h4 className="font-black text-white text-base">{selectedDriver.driverName}</h4>
                <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isAr ? "سائق معتمد ومفوض" : "Certified Fleet Driver"}
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{isAr ? "الأوسمة والجوائز:" : "Honors & Badges:"}</span>
              </div>
              <div className="space-y-1">
                {selectedDriver.awards.map((aw, i) => (
                  <span key={i} className="block text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    🎖️ {aw}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Contact */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`https://wa.me/213550123456?text=${encodeURIComponent(
                  `تهانينا كابتن ${selectedDriver.driverName}، تم اعتماد مكافأة الأداء الشهري بقيمة ${selectedDriver.bonusEarned} دج من إدارة ${institutionName}!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {isAr ? "إرسال تهنئة" : "Send Bonus"}
              </a>
              <button
                onClick={() => alert(isAr ? "جاري تصدير بطاقة السائق بصيغة قابلة للطباعة..." : "Exporting Driver ID...")}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 transition"
              >
                <QrCode className="w-3.5 h-3.5" />
                {isAr ? "رمز QR" : "QR Badge"}
              </button>
            </div>
          </div>

          {/* Bonus Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3.5 text-xs font-bold">
            <h4 className="text-xs font-black text-slate-200 flex items-center gap-2 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-amber-400" />
              {isAr ? "حاسبة أهداف المكافآت التحفيزية" : "Bonus Goal Calculator"}
            </h4>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>{isAr ? "الحد الأدنى لرحلات الشهر:" : "Monthly Target Trips:"}</span>
                <span className="text-amber-400 font-mono">{bonusTargetTrips} {isAr ? "رحلة" : "trips"}</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                step="5"
                value={bonusTargetTrips}
                onChange={(e) => setBonusTargetTrips(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>{isAr ? "مكافأة كل رحلة إضافية:" : "Bonus per extra trip:"}</span>
                <span className="text-emerald-400 font-mono">{bonusPerTripAboveTarget} دج</span>
              </div>
              <input
                type="range"
                min="200"
                max="1000"
                step="50"
                value={bonusPerTripAboveTarget}
                onChange={(e) => setBonusPerTripAboveTarget(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400">{isAr ? "المكافأة التقديرية للسائق المختار:" : "Est. Driver Bonus:"}</span>
              <div className="text-xl font-black text-emerald-400 mt-0.5">
                {Math.max(
                  5000,
                  (selectedDriver.totalTripsMonth - bonusTargetTrips) * bonusPerTripAboveTarget
                ).toLocaleString()} دج
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
