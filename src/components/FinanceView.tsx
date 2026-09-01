import React, { useState, useMemo } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Calendar,
  Fuel,
  Wrench,
  Users,
  Shield,
  Tag,
  Trash2,
} from "lucide-react";
import { Language, FinancialRecord, TransactionKind } from "../types";
import { translations } from "../i18n/translations";

interface FinanceViewProps {
  currentLang: Language;
  financialRecords: FinancialRecord[];
  onAddTransaction: (kind: TransactionKind) => void;
  onDeleteTransaction: (id: string | number) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  currentLang,
  financialRecords,
  onAddTransaction,
  onDeleteTransaction,
}) => {
  const t = translations[currentLang];
  const [filterKind, setFilterKind] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const totalIncome = useMemo(
    () =>
      financialRecords
        .filter((r) => r.kind === "income")
        .reduce((sum, r) => sum + r.amount, 0),
    [financialRecords]
  );

  const totalExpense = useMemo(
    () =>
      financialRecords
        .filter((r) => r.kind === "expense")
        .reduce((sum, r) => sum + r.amount, 0),
    [financialRecords]
  );

  const netBalance = totalIncome - totalExpense;

  const filteredRecords = useMemo(() => {
    return financialRecords.filter((r) => {
      const matchesSearch = r.label.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesKind = filterKind === "all" || r.kind === filterKind;
      return matchesSearch && matchesKind;
    });
  }, [financialRecords, searchQuery, filterKind]);

  const categoryLabels: Record<string, { label: string; icon: any; color: string }> = {
    trips: { label: t.catTrips, icon: Wallet, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    contracts: { label: t.catContracts, icon: TrendingUp, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
    fuel: { label: t.catFuel, icon: Fuel, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    maintenance: { label: t.catMaintenance, icon: Wrench, color: "text-rose-400 bg-rose-500/10 border-rose-500/30" },
    salaries: { label: t.catSalaries, icon: Users, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
    insurance: { label: t.catInsurance, icon: Shield, color: "text-teal-400 bg-teal-500/10 border-teal-500/30" },
    other: { label: t.catOther, icon: Tag, color: "text-slate-400 bg-slate-500/10 border-slate-500/30" },
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">{t.financeTitle}</h1>
          <p className="text-sm text-slate-400 mt-0.5">{t.financeSubtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddTransaction("income")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-900/30"
          >
            <Plus size={16} />
            <span>{t.addIncome}</span>
          </button>
          <button
            onClick={() => onAddTransaction("expense")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 font-bold text-xs sm:text-sm transition"
          >
            <Plus size={16} />
            <span>{t.addExpense}</span>
          </button>
        </div>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">{t.totalIncome}</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
              +{totalIncome.toLocaleString()} {t.currency}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">{t.totalExpense}</p>
            <p className="text-xl sm:text-2xl font-black text-rose-400 mt-0.5">
              -{totalExpense.toLocaleString()} {t.currency}
            </p>
          </div>
        </div>

        <div
          className={`p-5 rounded-3xl border shadow-md flex items-center gap-4 ${
            netBalance >= 0
              ? "bg-gradient-to-br from-emerald-950/40 to-slate-900 border-emerald-500/40"
              : "bg-gradient-to-br from-rose-950/40 to-slate-900 border-rose-500/40"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              netBalance >= 0
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
            }`}
          >
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300">{t.netProfit}</p>
            <p
              className={`text-xl sm:text-2xl font-black mt-0.5 ${
                netBalance >= 0 ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {netBalance.toLocaleString()} {t.currency}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute top-1/2 -translate-y-1/2 rtl:right-3.5 ltr:left-3.5 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchVehiclesPlaceholder}
            className="w-full rounded-2xl bg-slate-800/80 border border-slate-700/80 rtl:pr-10 rtl:pl-4 ltr:pl-10 ltr:pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
          />
        </div>

        <div className="flex rounded-2xl bg-slate-800 p-1 border border-slate-700">
          <button
            onClick={() => setFilterKind("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterKind === "all" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            {t.notifFilterAll}
          </button>
          <button
            onClick={() => setFilterKind("income")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterKind === "income"
                ? "bg-emerald-500 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t.kindIncome}
          </button>
          <button
            onClick={() => setFilterKind("expense")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterKind === "expense"
                ? "bg-rose-500 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t.kindExpense}
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[640px]">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 text-xs">
                <th className="px-5 py-3.5 text-start font-extrabold">{t.transactionLabel}</th>
                <th className="px-5 py-3.5 text-start font-extrabold">{t.transactionCategory}</th>
                <th className="px-5 py-3.5 text-start font-extrabold">{t.transactionDate}</th>
                <th className="px-5 py-3.5 text-start font-extrabold">{t.transactionKind}</th>
                <th className="px-5 py-3.5 text-start font-extrabold">{t.transactionAmount}</th>
                <th className="px-5 py-3.5 text-center font-extrabold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.map((item) => {
                const catInfo = categoryLabels[item.category] || categoryLabels.other;
                const isIncome = item.kind === "income";

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-4 font-bold text-white max-w-xs truncate">
                      {item.label}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-semibold ${catInfo.color}`}>
                        {catInfo.label}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-400 text-xs">{item.date}</td>

                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-bold ${
                          isIncome ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isIncome ? t.kindIncome : t.kindExpense}
                      </span>
                    </td>

                    <td
                      className={`px-5 py-4 font-black text-sm whitespace-nowrap ${
                        isIncome ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isIncome ? "+" : "-"} {item.amount.toLocaleString()} {t.currency}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => {
                          if (window.confirm(t.confirmDelete)) {
                            onDeleteTransaction(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        aria-label="Delete Record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="py-16 text-center text-slate-400">
            <Wallet size={36} className="mx-auto mb-2 opacity-30 text-slate-500" />
            <p className="text-sm font-semibold">{t.liveTripsEmpty}</p>
          </div>
        )}
      </div>
    </div>
  );
};
