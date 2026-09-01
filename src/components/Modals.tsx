import React, { useState, useEffect } from "react";
import {
  X,
  Car,
  Users,
  Route,
  Wallet,
  Bell,
  Save,
  Plus,
  Sparkles,
} from "lucide-react";
import {
  Language,
  Vehicle,
  VehicleType,
  VehicleStatus,
  Driver,
  DriverStatus,
  Trip,
  ServiceTier,
  FinancialRecord,
  TransactionKind,
  TransactionCategory,
  SmartNotification,
  NotificationType,
  NotificationUrgency,
} from "../types";
import { translations } from "../i18n/translations";

// ==========================================
// 1. Vehicle Modal (Add / Edit)
// ==========================================
interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Partial<Vehicle>) => void;
  currentLang: Language;
  initialVehicle?: Vehicle | null;
  drivers: Driver[];
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentLang,
  initialVehicle,
  drivers,
}) => {
  const t = translations[currentLang];

  const [plate, setPlate] = useState("");
  const [type, setType] = useState<VehicleType>("taxi");
  const [driver, setDriver] = useState("");
  const [status, setStatus] = useState<VehicleStatus>("active");
  const [mileage, setMileage] = useState(120000);
  const [wilaya, setWilaya] = useState("16 - الجزائر العاصمة");
  const [commune, setCommune] = useState("باب الزوار");
  const [modelYear, setModelYear] = useState(2023);

  useEffect(() => {
    if (initialVehicle) {
      setPlate(initialVehicle.plate);
      setType(initialVehicle.type);
      setDriver(initialVehicle.driver);
      setStatus(initialVehicle.status);
      setMileage(initialVehicle.mileage);
      setWilaya(initialVehicle.wilaya);
      setCommune(initialVehicle.commune || "");
      setModelYear(initialVehicle.modelYear || 2023);
    } else {
      setPlate("");
      setType("taxi");
      setDriver(drivers[0]?.name || "");
      setStatus("active");
      setMileage(85000);
      setWilaya("16 - الجزائر العاصمة");
      setCommune("الجزائر الوسطى");
      setModelYear(2023);
    }
  }, [initialVehicle, isOpen, drivers]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialVehicle ? initialVehicle.id : `VEH-${Date.now().toString().slice(-4)}`,
      plate,
      type,
      driver,
      status,
      mileage: Number(mileage),
      wilaya,
      commune,
      modelYear: Number(modelYear),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 rtl:left-5 ltr:right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Car size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {initialVehicle ? t.editVehicle : t.addVehicle}
            </h2>
            <p className="text-xs text-slate-400">MAEK7-TAXI Fleet Register</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.vehiclePlate}</label>
              <input
                type="text"
                required
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="10452-116-16"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.vehicleType}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as VehicleType)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white cursor-pointer"
              >
                <option value="taxi">{t.typeTaxi}</option>
                <option value="bus">{t.typeBus}</option>
                <option value="minibus">{t.typeMinibus}</option>
                <option value="vip">{t.typeVip}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.vehicleDriver}</label>
              <input
                type="text"
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                placeholder="اسم السائق"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.vehicleStatus}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white cursor-pointer"
              >
                <option value="active">{t.statusActive}</option>
                <option value="in_maintenance">{t.statusInMaintenance}</option>
                <option value="stopped">{t.statusStopped}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.vehicleMileage} (كم)</label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">سنة الصنع / Model Year</label>
              <input
                type="number"
                value={modelYear}
                onChange={(e) => setModelYear(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.vehicleWilaya}</label>
              <input
                type="text"
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                placeholder="16 - الجزائر"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">البلدية / Commune</label>
              <input
                type="text"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder="باب الزوار"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold"
            >
              {t.cancelAction}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Save size={15} />
              <span>{t.saveChanges}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 2. Driver Modal (Add / Edit)
// ==========================================
interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driver: Partial<Driver>) => void;
  currentLang: Language;
  initialDriver?: Driver | null;
  vehicles: Vehicle[];
}

export const DriverModal: React.FC<DriverModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentLang,
  initialDriver,
  vehicles,
}) => {
  const t = translations[currentLang];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [license, setLicense] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [status, setStatus] = useState<DriverStatus>("active");
  const [rating, setRating] = useState(4.8);
  const [trips, setTrips] = useState(0);

  useEffect(() => {
    if (initialDriver) {
      setName(initialDriver.name);
      setPhone(initialDriver.phone);
      setLicense(initialDriver.license);
      setVehicle(initialDriver.vehicle);
      setStatus(initialDriver.status);
      setRating(initialDriver.rating);
      setTrips(initialDriver.trips);
    } else {
      setName("");
      setPhone("0550 ");
      setLicense("ALG-B-");
      setVehicle(vehicles[0]?.plate || "");
      setStatus("active");
      setRating(5.0);
      setTrips(0);
    }
  }, [initialDriver, isOpen, vehicles]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialDriver ? initialDriver.id : `DRV-${Date.now().toString().slice(-4)}`,
      name,
      phone,
      license,
      vehicle,
      status,
      rating: Number(rating),
      trips: Number(trips),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 rtl:left-5 ltr:right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {initialDriver ? t.editDriver : t.addDriver}
            </h2>
            <p className="text-xs text-slate-400">MAEK7-TAXI Drivers Register</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">{t.driverName}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="الاسم واللقب"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.driverPhone}</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0550 12 34 56"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.driverLicense}</label>
              <input
                type="text"
                required
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="ALG-B-9988"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.driverAssignedVehicle}</label>
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white cursor-pointer font-mono"
              >
                <option value="">بدون تعيين / Unassigned</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.plate}>
                    {v.plate} ({v.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.driverStatus}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DriverStatus)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white cursor-pointer"
              >
                <option value="active">{t.driverStatusActive}</option>
                <option value="on_leave">{t.driverStatusOnLeave}</option>
                <option value="suspended">{t.driverStatusSuspended}</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold"
            >
              {t.cancelAction}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Save size={15} />
              <span>{t.saveChanges}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 3. Trip Modal (New Booking / Dispatch)
// ==========================================
interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trip: Trip) => void;
  currentLang: Language;
  drivers: Driver[];
  vehicles: Vehicle[];
}

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentLang,
  drivers,
  vehicles,
}) => {
  const t = translations[currentLang];

  const [from, setFrom] = useState("الجزائر العاصمة (مطار هواري بومدين)");
  const [to, setTo] = useState("البليدة (وسط المدينة)");
  const [driver, setDriver] = useState(drivers[0]?.name || "");
  const [vehicle, setVehicle] = useState(vehicles[0]?.plate || "");
  const [price, setPrice] = useState(2500);
  const [time, setTime] = useState("14:30");
  const [date, setDate] = useState("اليوم / Today");
  const [tier, setTier] = useState<ServiceTier>("standard");
  const [passengerName, setPassengerName] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrip: Trip = {
      id: `TRIP-${Math.floor(100 + Math.random() * 900)}`,
      from,
      to,
      driver,
      vehicle,
      price: Number(price),
      status: "scheduled",
      time,
      date,
      serviceTier: tier,
      passengerName: passengerName || undefined,
      passengerPhone: passengerPhone || undefined,
    };
    onSave(newTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 rtl:left-5 ltr:right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Route size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">{t.newTrip}</h2>
            <p className="text-xs text-slate-400">MAEK7-TAXI Instant Dispatch</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.tripFrom}</label>
              <input
                type="text"
                required
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.tripTo}</label>
              <input
                type="text"
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.vehicleDriver}</label>
              <select
                value={driver}
                onChange={(e) => {
                  setDriver(e.target.value);
                  const matchedDrv = drivers.find((d) => d.name === e.target.value);
                  if (matchedDrv?.vehicle) setVehicle(matchedDrv.vehicle);
                }}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white cursor-pointer"
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.vehiclePlate}</label>
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white cursor-pointer font-mono"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.plate}>
                    {v.plate} ({v.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.tripPrice} (دج)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.tripTime}</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="15:00"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.tripTier}</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as ServiceTier)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white cursor-pointer"
              >
                <option value="standard">عادي / Standard</option>
                <option value="vip">VIP فاخر</option>
                <option value="group">جماعي / Group</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">اسم الراكب (اختياري)</label>
              <input
                type="text"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                placeholder="أحمد شريف"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2 text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">هاتف الراكب (WhatsApp)</label>
              <input
                type="text"
                value={passengerPhone}
                onChange={(e) => setPassengerPhone(e.target.value)}
                placeholder="0660123456"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2 text-white font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold"
            >
              {t.cancelAction}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Save size={15} />
              <span>{t.saveChanges}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 4. Financial Transaction Modal
// ==========================================
interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: FinancialRecord) => void;
  currentLang: Language;
  defaultKind: TransactionKind;
}

export const FinanceModal: React.FC<FinanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentLang,
  defaultKind,
}) => {
  const t = translations[currentLang];

  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(5000);
  const [kind, setKind] = useState<TransactionKind>(defaultKind);
  const [category, setCategory] = useState<TransactionCategory>("fuel");
  const [date, setDate] = useState("اليوم / Today");

  useEffect(() => {
    setKind(defaultKind);
    setCategory(defaultKind === "income" ? "trips" : "fuel");
  }, [defaultKind, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `FN-${Date.now().toString().slice(-4)}`,
      label,
      amount: Number(amount),
      kind,
      category,
      date,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 rtl:left-5 ltr:right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              kind === "income"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-rose-500/20 text-rose-400"
            }`}
          >
            <Wallet size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {kind === "income" ? t.addIncome : t.addExpense}
            </h2>
            <p className="text-xs text-slate-400">MAEK7-TAXI Financial Vault</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">{t.transactionLabel}</label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="مثال: فاتورة وقود أسبوعية / اشتراك مطار"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.transactionAmount} (دج)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">{t.transactionKind}</label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as TransactionKind)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white cursor-pointer"
              >
                <option value="income">{t.kindIncome}</option>
                <option value="expense">{t.kindExpense}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">{t.transactionCategory}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white cursor-pointer"
            >
              <option value="trips">{t.catTrips}</option>
              <option value="contracts">{t.catContracts}</option>
              <option value="fuel">{t.catFuel}</option>
              <option value="maintenance">{t.catMaintenance}</option>
              <option value="salaries">{t.catSalaries}</option>
              <option value="insurance">{t.catInsurance}</option>
              <option value="other">{t.catOther}</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold"
            >
              {t.cancelAction}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Save size={15} />
              <span>{t.saveChanges}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 5. Broadcast Notification Modal
// ==========================================
interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notif: SmartNotification) => void;
  currentLang: Language;
  drivers: Driver[];
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentLang,
  drivers,
}) => {
  const t = translations[currentLang];

  const [titleAr, setTitleAr] = useState("تنبيه عاجل لسائقي الأسطول");
  const [msgAr, setMsgAr] = useState("يرجى الالتزام بالسرعة القانونية وتفقد ضغط الإطارات قبل الانطلاق.");
  const [urgency, setUrgency] = useState<NotificationUrgency>("warning");
  const [type, setType] = useState<NotificationType>("system");
  const [selectedDriverPhone, setSelectedDriverPhone] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotif: SmartNotification = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: { ar: titleAr, en: titleAr, fr: titleAr },
      message: { ar: msgAr, en: msgAr, fr: msgAr },
      timestamp: "الآن / Just now",
      urgency,
      type,
      read: false,
      recipientPhone: selectedDriverPhone || undefined,
    };
    onSave(newNotif);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 rtl:left-5 ltr:right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Bell size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">{t.notifBroadcastBtn}</h2>
            <p className="text-xs text-slate-400">MAEK7-TAXI Emergency & Alerts</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">عنوان التنبيه</label>
            <input
              type="text"
              required
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">نص الرسالة</label>
            <textarea
              required
              rows={3}
              value={msgAr}
              onChange={(e) => setMsgAr(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">درجة الأهمية</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as NotificationUrgency)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white cursor-pointer"
              >
                <option value="critical">حرج / Critical</option>
                <option value="warning">تحذير / Warning</option>
                <option value="info">معلومة / Info</option>
                <option value="success">نجاح / Success</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">نوع التنبيه</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as NotificationType)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white cursor-pointer"
              >
                <option value="system">نظامي / System</option>
                <option value="maintenance">صيانة / Maintenance</option>
                <option value="license">رخص / License</option>
                <option value="fuel">وقود / Fuel</option>
                <option value="vip">VIP</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold"
            >
              {t.cancelAction}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Plus size={15} />
              <span>إرسال التنبيه</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
