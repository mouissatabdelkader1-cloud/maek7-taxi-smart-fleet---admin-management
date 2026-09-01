import React, { useState, useMemo } from "react";
import {
  Route,
  Plus,
  Search,
  MapPin,
  Clock,
  Calendar,
  Users,
  Car,
  CheckCircle2,
  AlertCircle,
  Play,
  Check,
  X,
  MessageCircle,
  Sparkles,
  Phone,
} from "lucide-react";
import { Language, Trip, TripStatus, Driver } from "../types";
import { translations } from "../i18n/translations";

interface TripsViewProps {
  currentLang: Language;
  trips: Trip[];
  drivers: Driver[];
  institutionName: string;
  onNewTrip: () => void;
  onStatusChange: (tripId: string | number, status: TripStatus) => void;
}

export const TripsView: React.FC<TripsViewProps> = ({
  currentLang,
  trips,
  drivers,
  institutionName,
  onNewTrip,
  onStatusChange,
}) => {
  const t = translations[currentLang];
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch =
        trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trip.passengerName && trip.passengerName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [trips, searchQuery, statusFilter]);

  const cleanPhone = (phone?: string) => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("213")) return digits;
    if (digits.startsWith("0")) return "213" + digits.slice(1);
    return digits;
  };

  const getTripWhatsAppLink = (trip: Trip) => {
    const driverObj = drivers.find((d) => trip.driver.includes(d.name) || d.vehicle === trip.vehicle);
    const targetPhone = cleanPhone(trip.passengerPhone || driverObj?.phone);

    const message =
      currentLang === "ar"
        ? `🚖 *إشعار رحلة MAEK7-TAXI*:\n- المسار: ${trip.from} ➔ ${trip.to}\n- السائق: ${trip.driver}\n- المركبة: ${trip.vehicle}\n- الموعد: ${trip.time} (${trip.date})\n- السعر: ${trip.price} دج.\nإدارة ${institutionName} تتمنى لكم رحلة آمنة ومريحة!`
        : currentLang === "fr"
        ? `🚖 *Avis de Course MAEK7-TAXI*:\n- Trajet: ${trip.from} ➔ ${trip.to}\n- Chauffeur: ${trip.driver}\n- Véhicule: ${trip.vehicle}\n- Heure: ${trip.time} (${trip.date})\n- Tarif: ${trip.price} DZD.\n${institutionName} vous souhaite un excellent trajet !`
        : `🚖 *MAEK7-TAXI Trip Dispatch*:\n- Route: ${trip.from} ➔ ${trip.to}\n- Driver: ${trip.driver}\n- Vehicle: ${trip.vehicle}\n- Time: ${trip.time} (${trip.date})\n- Fare: ${trip.price} DZD.\n${institutionName} wishes you a safe journey!`;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  };

  const statusBadge = (status: TripStatus) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
            <Clock size={12} /> {t.tripStatusScheduled}
          </span>
        );
      case "ongoing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
            <Play size={12} /> {t.tripStatusOngoing}
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <CheckCircle2 size={12} /> {t.tripStatusCompleted}
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <AlertCircle size={12} /> {t.tripStatusCancelled}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">{t.tripsTitle}</h1>
          <p className="text-sm text-slate-400 mt-0.5">{t.tripsSubtitle}</p>
        </div>

        <button
          onClick={onNewTrip}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/20 transform hover:-translate-y-0.5 shrink-0"
        >
          <Plus size={18} />
          <span>{t.newTrip}</span>
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
          aria-label="Filter Trips by Status"
          className="rounded-2xl bg-slate-800/80 border border-slate-700/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
        >
          <option value="all">{t.notifFilterAll} (Trips)</option>
          <option value="scheduled">{t.tripStatusScheduled}</option>
          <option value="ongoing">{t.tripStatusOngoing}</option>
          <option value="completed">{t.tripStatusCompleted}</option>
          <option value="cancelled">{t.tripStatusCancelled}</option>
        </select>
      </div>

      {/* Trips Table & Cards */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[760px]">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 text-xs">
                <th className="px-5 py-3.5 text-start font-extrabold">ID / {t.tripTier}</th>
                <th className="px-5 py-3.5 text-start font-extrabold">{t.tripFrom} ➔ {t.tripTo}</th>
                <th className="px-5 py-3.5 text-start font-extrabold">{t.vehicleDriver}</th>
                <th className="px-5 py-3.5 text-start font-extrabold">{t.vehiclePlate}</th>
                <th className="px-5 py-3.5 text-start font-extrabold">{t.tripPrice}</th>
                <th className="px-5 py-3.5 text-start font-extrabold">{t.tripTime}</th>
                <th className="px-5 py-3.5 text-start font-extrabold">{t.tripStatus}</th>
                <th className="px-5 py-3.5 text-center font-extrabold">الإجراءات / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTrips.map((trip) => {
                return (
                  <tr key={trip.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-slate-300 block">{trip.id}</span>
                      {trip.serviceTier === "vip" && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                          <Sparkles size={10} /> VIP
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 font-semibold text-white">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-amber-400 shrink-0" />
                        <span className="truncate max-w-[160px]">{trip.from}</span>
                        <span className="text-slate-500">➔</span>
                        <span className="truncate max-w-[160px] text-amber-300">{trip.to}</span>
                      </div>
                      {trip.passengerName && (
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          العميل: {trip.passengerName}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-300 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Users size={13} className="text-slate-500" />
                        <span className="truncate max-w-[140px]">{trip.driver}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-mono font-bold text-slate-200" dir="ltr">
                      {trip.vehicle}
                    </td>

                    <td className="px-5 py-4 font-black text-amber-400 whitespace-nowrap">
                      {trip.price.toLocaleString()} {t.currency}
                    </td>

                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap text-xs">
                      <div>{trip.time}</div>
                      <div className="text-[10px] text-slate-500">{trip.date}</div>
                    </td>

                    <td className="px-5 py-4">{statusBadge(trip.status)}</td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* WhatsApp Dispatch Button */}
                        <a
                          href={getTripWhatsAppLink(trip)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition"
                          title="WhatsApp Dispatch"
                        >
                          <MessageCircle size={14} />
                        </a>

                        {/* Lifecycle Status Transitions */}
                        {trip.status === "scheduled" && (
                          <button
                            onClick={() => onStatusChange(trip.id, "ongoing")}
                            className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                            title={t.actionStartTrip}
                          >
                            <Play size={12} />
                          </button>
                        )}

                        {trip.status === "ongoing" && (
                          <button
                            onClick={() => onStatusChange(trip.id, "completed")}
                            className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
                            title={t.actionCompleteTrip}
                          >
                            <Check size={12} />
                          </button>
                        )}

                        {(trip.status === "scheduled" || trip.status === "ongoing") && (
                          <button
                            onClick={() => onStatusChange(trip.id, "cancelled")}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition"
                            title={t.actionCancelTrip}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTrips.length === 0 && (
          <div className="py-16 text-center text-slate-400">
            <Route size={36} className="mx-auto mb-2 opacity-30 text-slate-500" />
            <p className="text-sm font-semibold">{t.liveTripsEmpty}</p>
          </div>
        )}
      </div>
    </div>
  );
};
