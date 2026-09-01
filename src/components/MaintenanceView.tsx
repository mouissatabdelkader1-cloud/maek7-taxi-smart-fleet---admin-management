import React, { useState } from "react";
import {
  Wrench,
  Fuel,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Car,
  Plus,
  Filter,
  DollarSign,
  Calendar,
  Sparkles,
  Layers,
  FileText,
} from "lucide-react";
import { Language, MaintenanceRecord, FuelLog, Vehicle } from "../types";
import { initialMaintenanceRecords, initialFuelLogs } from "../data/mockData";

interface MaintenanceViewProps {
  currentLang: Language;
  vehicles: Vehicle[];
  onAddExpense?: (record: any) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  currentLang,
  vehicles,
  onAddExpense,
}) => {
  const isAr = currentLang === "ar";
  const isFr = currentLang === "fr";

  const [records, setRecords] = useState<MaintenanceRecord[]>(initialMaintenanceRecords);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(initialFuelLogs);
  const [activeTab, setActiveTab] = useState<"maintenance" | "fuel">("maintenance");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddingFuel, setIsAddingFuel] = useState<boolean>(false);
  const [newFuel, setNewFuel] = useState({
    plate: vehicles[0]?.plate || "",
    driver: vehicles[0]?.driver || "",
    liters: 45,
    cost: 1500,
    station: "محطة نفطال المركزية (Naftal)",
    fuelCardNum: "NAFTAL-99801",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Complete Maintenance Action
  const handleCompleteMaintenance = (record: MaintenanceRecord) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === record.id
          ? {
              ...r,
              status: "good",
              lastServicedMileage: r.currentMileage,
              dueMileage: r.currentMileage + 10000,
            }
          : r
      )
    );

    // Sync expense to Financial Ledger
    onAddExpense?.({
      id: `FN-MNT-${Date.now().toString().slice(-4)}`,
      label: `صيانة دورية: ${record.vehiclePlate} (${record.type})`,
      amount: record.estimatedCost,
      kind: "expense",
      category: "maintenance",
      date: "اليوم / Today",
    });

    setSuccessMessage(
      isAr
        ? `✅ تم تسجيل إتمام الصيانة للمركبة (${record.vehiclePlate}) وإدراج المصروف (${record.estimatedCost} دج) في السجل المالي!`
        : `✅ Maintenance recorded for (${record.vehiclePlate}) and expense synced to Financial Ledger!`
    );
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Add Fuel Log
  const handleSaveFuel = (e: React.FormEvent) => {
    e.preventDefault();
    const log: FuelLog = {
      id: `FL-${Date.now().toString().slice(-3)}`,
      vehiclePlate: newFuel.plate,
      driverName: newFuel.driver,
      date: new Date().toISOString().split("T")[0],
      liters: Number(newFuel.liters),
      cost: Number(newFuel.cost),
      odometer: 185000,
      fuelCardNum: newFuel.fuelCardNum,
      station: newFuel.station,
      efficiencyL100km: 7.2,
    };

    setFuelLogs([log, ...fuelLogs]);
    setIsAddingFuel(false);

    onAddExpense?.({
      id: `FN-FL-${Date.now().toString().slice(-4)}`,
      label: `تزويد وقود: ${newFuel.plate} (${newFuel.liters}L)`,
      amount: Number(newFuel.cost),
      kind: "expense",
      category: "fuel",
      date: "اليوم / Today",
    });

    setSuccessMessage(
      isAr
        ? `⛽ تم تسجيل تزويد الوقود لـ (${newFuel.plate}) بنجاح!`
        : `⛽ Fuel log recorded for (${newFuel.plate}) successfully!`
    );
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const overdueCount = records.filter((r) => r.status === "overdue").length;
  const dueSoonCount = records.filter((r) => r.status === "due_soon").length;

  const filteredRecords = records.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Wrench className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              {isAr
                ? "إدارة الصيانة الوقائية واستهلاك الوقود Naftal"
                : isFr
                ? "Maintenance Prédictive & Carburant Naftal"
                : "Predictive Maintenance & Naftal Fuel Tracker"}
              {overdueCount > 0 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold animate-pulse">
                  {overdueCount} {isAr ? "صيانة مستعجلة" : "overdue"}
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {isAr
                ? "جدولة تغيير الزيت، فحص الفرامل، الفحص التقني الدوري، وبطاقات الوقود الإلكترونية"
                : "Automated mileage schedules for oil changes, brake pads, technical inspections and fuel economy"}
            </p>
          </div>
        </div>

        {/* Tab & Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab("maintenance")}
              className={`px-3.5 py-2 rounded-xl transition ${
                activeTab === "maintenance"
                  ? "bg-amber-500 text-slate-950 font-black shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {isAr ? "الصيانة الوقائية" : "Maintenance"}
            </button>
            <button
              onClick={() => setActiveTab("fuel")}
              className={`px-3.5 py-2 rounded-xl transition ${
                activeTab === "fuel"
                  ? "bg-amber-500 text-slate-950 font-black shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {isAr ? "سجل الوقود Naftal" : "Fuel Logs"}
            </button>
          </div>

          {activeTab === "fuel" && (
            <button
              onClick={() => setIsAddingFuel(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              {isAr ? "تسجيل تعبئة وقود" : "Add Fuel Entry"}
            </button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold">{isAr ? "صيانة عاجلة متأخرة" : "Overdue Maintenance"}</span>
            <div className="text-2xl font-black text-rose-400 mt-1">{overdueCount} {isAr ? "مركبة" : "vehicles"}</div>
          </div>
          <span className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold">{isAr ? "صيانة قريبة الاستحقاق" : "Due Soon (<1000 km)"}</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{dueSoonCount} {isAr ? "مركبة" : "vehicles"}</div>
          </div>
          <span className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold">{isAr ? "متوسط استهلاك الأسطول" : "Average Fleet Economy"}</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">7.4 <span className="text-xs text-slate-300">L / 100km</span></div>
          </div>
          <span className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Fuel className="w-6 h-6" />
          </span>
        </div>
      </div>

      {/* Main Tab 1: Maintenance Board */}
      {activeTab === "maintenance" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          {/* Status Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Filter className="w-4 h-4" />
              <span>{isAr ? "تصفية الحالة:" : "Filter Status:"}</span>
              {["all", "overdue", "due_soon", "good"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    filterStatus === st
                      ? "bg-amber-500 text-slate-950 font-black"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {st === "all" ? (isAr ? "الكل" : "All") : st}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400">
              {isAr ? "تحديث تلقائي وفق عدادات الكيلومترات المسجلة" : "Auto-synced with vehicle odometers"}
            </span>
          </div>

          {/* Maintenance Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300 text-right rtl:text-right ltr:text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-black uppercase">
                  <th className="py-3 px-4">{isAr ? "المركبة واللوحة" : "Vehicle & Plate"}</th>
                  <th className="py-3 px-4">{isAr ? "نوع الصيانة" : "Service Type"}</th>
                  <th className="py-3 px-4">{isAr ? "العداد الحالي / المستحق" : "Odometer / Due"}</th>
                  <th className="py-3 px-4">{isAr ? "التكلفة التقديرية" : "Est. Cost"}</th>
                  <th className="py-3 px-4">{isAr ? "الحالة" : "Status"}</th>
                  <th className="py-3 px-4 text-center">{isAr ? "الإجراء" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-bold">
                {filteredRecords.map((rec) => {
                  const kmLeft = rec.dueMileage - rec.currentMileage;
                  return (
                    <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-black text-white">
                        {rec.vehiclePlate}
                        <span className="block text-[10px] text-slate-400 font-normal">{rec.vehicleModel}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-amber-400 uppercase">{rec.type}</span>
                        {rec.technicianNotes && (
                          <span className="block text-[10px] text-slate-400 font-normal truncate max-w-xs">
                            {rec.technicianNotes}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-white">{rec.currentMileage.toLocaleString()} km</span>
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {isAr ? "مستحقة عند:" : "Due at:"} {rec.dueMileage.toLocaleString()} km ({kmLeft > 0 ? `باقي ${kmLeft} km` : `تجاوز بـ ${Math.abs(kmLeft)} km`})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-mono font-black">
                        {rec.estimatedCost.toLocaleString()} دج
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                            rec.status === "overdue"
                              ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                              : rec.status === "due_soon"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {rec.status === "overdue"
                            ? isAr ? "متأخرة فوراً" : "OVERDUE"
                            : rec.status === "due_soon"
                            ? isAr ? "قريبة الاستحقاق" : "DUE SOON"
                            : isAr ? "مطابقة" : "GOOD"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleCompleteMaintenance(rec)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow transition flex items-center gap-1 mx-auto"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isAr ? "تسجيل الإنجاز" : "Complete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Tab 2: Fuel Logs */}
      {activeTab === "fuel" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <h3 className="text-base font-black text-white flex items-center justify-between">
            <span>{isAr ? "سجل استهلاك الوقود وبطاقات نفطال (Naftal Fleet Cards)" : "Naftal Fuel Consumption Records"}</span>
            <span className="text-xs text-slate-400 font-normal">{fuelLogs.length} {isAr ? "عملية مسجلة" : "entries"}</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300 text-right rtl:text-right ltr:text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-black uppercase">
                  <th className="py-3 px-4">{isAr ? "التاريخ" : "Date"}</th>
                  <th className="py-3 px-4">{isAr ? "المركبة" : "Vehicle"}</th>
                  <th className="py-3 px-4">{isAr ? "السائق" : "Driver"}</th>
                  <th className="py-3 px-4">{isAr ? "الكمية" : "Liters"}</th>
                  <th className="py-3 px-4">{isAr ? "المبلغ" : "Cost"}</th>
                  <th className="py-3 px-4">{isAr ? "بطاقة نفطال والمحطة" : "Card & Station"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-bold">
                {fuelLogs.map((fl) => (
                  <tr key={fl.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono text-slate-400">{fl.date}</td>
                    <td className="py-3 px-4 font-black text-white">{fl.vehiclePlate}</td>
                    <td className="py-3 px-4 text-slate-300">{fl.driverName}</td>
                    <td className="py-3 px-4 text-amber-400 font-mono font-black">{fl.liters} L</td>
                    <td className="py-3 px-4 text-emerald-400 font-mono font-black">{fl.cost.toLocaleString()} دج</td>
                    <td className="py-3 px-4 text-slate-400">
                      <span className="text-white font-mono">{fl.fuelCardNum}</span>
                      <span className="block text-[10px]">{fl.station}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Fuel Modal */}
      {isAddingFuel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Fuel className="w-5 h-5 text-amber-400" />
              {isAr ? "تسجيل تزويد وقود جديد" : "New Fuel Entry"}
            </h3>

            <form onSubmit={handleSaveFuel} className="space-y-3.5 text-xs font-bold">
              <div>
                <label className="block text-slate-400 mb-1">{isAr ? "المركبة" : "Vehicle"}</label>
                <select
                  value={newFuel.plate}
                  onChange={(e) => setNewFuel({ ...newFuel, plate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.plate}>
                      {v.plate} — {v.driver}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">{isAr ? "اللترات (L)" : "Liters"}</label>
                  <input
                    type="number"
                    value={newFuel.liters}
                    onChange={(e) => setNewFuel({ ...newFuel, liters: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{isAr ? "المبلغ (دج)" : "Cost (DZD)"}</label>
                  <input
                    type="number"
                    value={newFuel.cost}
                    onChange={(e) => setNewFuel({ ...newFuel, cost: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">{isAr ? "محطة نفطال" : "Naftal Station"}</label>
                <input
                  type="text"
                  value={newFuel.station}
                  onChange={(e) => setNewFuel({ ...newFuel, station: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingFuel(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400"
                >
                  {isAr ? "حفظ التعبئة" : "Save Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
