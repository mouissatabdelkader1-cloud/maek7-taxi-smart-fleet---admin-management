import React, { useState, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Star,
  Phone,
  Car,
  FileCheck,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Ban,
  MessageCircle,
} from "lucide-react";
import { Language, Driver, DriverStatus } from "../types";
import { translations } from "../i18n/translations";

interface DriversViewProps {
  currentLang: Language;
  drivers: Driver[];
  institutionName: string;
  onAddDriver: () => void;
  onEditDriver: (driver: Driver) => void;
  onDeleteDriver: (id: string | number) => void;
}

export const DriversView: React.FC<DriversViewProps> = ({
  currentLang,
  drivers,
  institutionName,
  onAddDriver,
  onEditDriver,
  onDeleteDriver,
}) => {
  const t = translations[currentLang];
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.license.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.vehicle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [drivers, searchQuery, statusFilter]);

  const cleanPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("213")) return digits;
    if (digits.startsWith("0")) return "213" + digits.slice(1);
    return digits;
  };

  const getWhatsAppLink = (driver: Driver) => {
    const greeting =
      currentLang === "ar"
        ? `مرحباً كابتن ${driver.name}، معك إدارة ${institutionName}. نرجو تأكيد جاهزيتك للرحلات المجدولة اليوم ومتابعة المهام في التطبيق.`
        : currentLang === "fr"
        ? `Bonjour Capitaine ${driver.name}, ici l'administration de ${institutionName}. Merci de confirmer votre disponibilité pour les courses programmées.`
        : `Hello Captain ${driver.name}, this is ${institutionName} fleet management. Please confirm your readiness for today's scheduled trips.`;

    return `https://wa.me/${cleanPhone(driver.phone)}?text=${encodeURIComponent(greeting)}`;
  };

  const statusBadge = (status: DriverStatus) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 size={12} /> {t.driverStatusActive}
          </span>
        );
      case "on_leave":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Clock size={12} /> {t.driverStatusOnLeave}
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <Ban size={12} /> {t.driverStatusSuspended}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">{t.driversTitle}</h1>
          <p className="text-sm text-slate-400 mt-0.5">{t.driversSubtitle}</p>
        </div>

        <button
          onClick={onAddDriver}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/20 transform hover:-translate-y-0.5 shrink-0"
        >
          <Plus size={18} />
          <span>{t.addDriver}</span>
        </button>
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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter Drivers by Status"
          className="rounded-2xl bg-slate-800/80 border border-slate-700/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
        >
          <option value="all">{t.notifFilterAll} (Drivers)</option>
          <option value="active">{t.driverStatusActive}</option>
          <option value="on_leave">{t.driverStatusOnLeave}</option>
          <option value="suspended">{t.driverStatusSuspended}</option>
        </select>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDrivers.map((driver) => {
          const avatarGradient = driver.avatarColor || "from-amber-400 to-amber-600";

          return (
            <div
              key={driver.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Driver Identity */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarGradient} text-slate-950 font-black text-lg flex items-center justify-center shadow-md shrink-0`}
                    >
                      {driver.name.trim().charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm text-white truncate">{driver.name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5" dir="ltr">
                        <Phone size={12} className="text-amber-400" />
                        <span>{driver.phone}</span>
                      </p>
                    </div>
                  </div>

                  <div>{statusBadge(driver.status)}</div>
                </div>

                {/* Scorecard (Rating, Trips, License) */}
                <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-slate-950/60 border border-slate-800 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.driverRating}</span>
                    <span className="text-xs sm:text-sm font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      {driver.rating}
                    </span>
                  </div>

                  <div className="border-x border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{t.driverTripsCount}</span>
                    <span className="text-xs sm:text-sm font-black text-white mt-0.5 block">
                      {driver.trips}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.driverLicense}</span>
                    <span className="text-[11px] font-mono font-bold text-slate-300 mt-0.5 block truncate" dir="ltr">
                      {driver.license}
                    </span>
                  </div>
                </div>

                {/* Assigned Vehicle Unit */}
                <div className="flex items-center gap-2 text-xs text-slate-300 px-1">
                  <Car size={14} className="text-amber-400 shrink-0" />
                  <span className="text-slate-400">{t.driverAssignedVehicle}:</span>
                  {driver.vehicle ? (
                    <span className="font-mono font-bold text-slate-100" dir="ltr">
                      {driver.vehicle}
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">{t.unassignedVehicle}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <a
                  href={getWhatsAppLink(driver)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                >
                  <MessageCircle size={14} />
                  <span>{t.actionWhatsAppDirect}</span>
                </a>

                <button
                  onClick={() => onEditDriver(driver)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  aria-label={t.editDriver}
                >
                  <Edit2 size={14} />
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(t.confirmDelete)) {
                      onDeleteDriver(driver.id);
                    }
                  }}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                  aria-label={t.deleteDriver}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="py-16 text-center text-slate-400 bg-slate-900/50 rounded-3xl border border-slate-800">
          <Users size={36} className="mx-auto mb-2 opacity-30 text-slate-500" />
          <p className="text-sm font-semibold">{t.liveTripsEmpty}</p>
        </div>
      )}
    </div>
  );
};
