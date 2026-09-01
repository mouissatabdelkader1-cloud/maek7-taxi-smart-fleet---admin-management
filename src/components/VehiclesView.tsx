import React, { useState, useMemo } from "react";
import {
  Car,
  Plus,
  Search,
  Wrench,
  Gauge,
  MapPin,
  User,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Language, Vehicle, VehicleType, VehicleStatus } from "../types";
import { translations } from "../i18n/translations";

interface VehiclesViewProps {
  currentLang: Language;
  vehicles: Vehicle[];
  onAddVehicle: () => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (id: string | number) => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({
  currentLang,
  vehicles,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
}) => {
  const t = translations[currentLang];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.wilaya.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.commune.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "all" || v.type === selectedType;
      const matchesStatus = selectedStatus === "all" || v.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [vehicles, searchQuery, selectedType, selectedStatus]);

  const typeLabels: Record<VehicleType, { label: string; icon: any; color: string }> = {
    taxi: { label: t.typeTaxi, icon: Car, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    bus: { label: t.typeBus, icon: Car, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
    minibus: { label: t.typeMinibus, icon: Car, color: "text-teal-400 bg-teal-500/10 border-teal-500/30" },
    vip: { label: t.typeVip, icon: Sparkles, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  };

  const statusBadge = (status: VehicleStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 size={12} /> {t.statusActive}
          </span>
        );
      case "in_maintenance":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Wrench size={12} /> {t.statusInMaintenance}
          </span>
        );
      case "stopped":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <AlertCircle size={12} /> {t.statusStopped}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">{t.vehiclesTitle}</h1>
          <p className="text-sm text-slate-400 mt-0.5">{t.vehiclesSubtitle}</p>
        </div>

        <button
          onClick={onAddVehicle}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/20 transform hover:-translate-y-0.5 shrink-0"
        >
          <Plus size={18} />
          <span>{t.addVehicle}</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
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

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by Status"
              className="rounded-2xl bg-slate-800/80 border border-slate-700/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">{t.notifFilterAll} (Status)</option>
              <option value="active">{t.statusActive}</option>
              <option value="in_maintenance">{t.statusInMaintenance}</option>
              <option value="stopped">{t.statusStopped}</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedType === "all"
                ? "bg-amber-500 text-slate-950 shadow"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {t.notifFilterAll} ({vehicles.length})
          </button>

          {(["taxi", "bus", "minibus", "vip"] as VehicleType[]).map((type) => {
            const count = vehicles.filter((v) => v.type === type).length;
            const info = typeLabels[type];
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedType === type
                    ? "bg-amber-500 text-slate-950 shadow"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <span>{info.label}</span>
                <span className="px-1.5 py-0.2 rounded-md bg-slate-950/30 text-[10px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vehicles Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle) => {
          const typeInfo = typeLabels[vehicle.type] || typeLabels.taxi;
          const isHighMileage = vehicle.mileage > 200000;

          return (
            <div
              key={vehicle.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Plate, Class Badge, Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-base text-white tracking-wider px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800" dir="ltr">
                        {vehicle.plate}
                      </span>
                    </div>
                    <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-lg border text-[10px] font-bold ${typeInfo.color}`}>
                      {typeInfo.label} • {vehicle.modelYear || 2022}
                    </span>
                  </div>

                  <div>{statusBadge(vehicle.status)}</div>
                </div>

                {/* Details Breakdown */}
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400 shrink-0" />
                    <span className="text-slate-400">{t.vehicleDriver}:</span>
                    <span className="font-bold text-white truncate">{vehicle.driver}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    <span className="text-slate-400">{t.vehicleWilaya}:</span>
                    <span className="font-semibold text-slate-200">
                      {vehicle.wilaya} {vehicle.commune ? `— ${vehicle.commune}` : ""}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <Gauge size={14} className="text-slate-400 shrink-0" />
                      <span className="text-slate-400">{t.vehicleMileage}:</span>
                      <span className="font-mono font-bold text-slate-100" dir="ltr">
                        {vehicle.mileage.toLocaleString()} {t.km}
                      </span>
                    </div>

                    {isHighMileage && (
                      <span
                        className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1"
                        title={t.alertMaintenanceDue}
                      >
                        <Wrench size={10} /> {t.alertMaintenanceDue.split(" ")[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => onEditVehicle(vehicle)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700/60"
                >
                  <Edit2 size={13} />
                  <span>{t.editVehicle}</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(t.confirmDelete)) {
                      onDeleteVehicle(vehicle.id);
                    }
                  }}
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                  aria-label={t.deleteVehicle}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="py-16 text-center text-slate-400 bg-slate-900/50 rounded-3xl border border-slate-800">
          <Car size={36} className="mx-auto mb-2 opacity-30 text-slate-500" />
          <p className="text-sm font-semibold">{t.liveTripsEmpty}</p>
        </div>
      )}
    </div>
  );
};
