import React, { useState } from "react";
import {
  Shield,
  Key,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  Sliders,
  DollarSign,
  Plus,
  RefreshCw,
  Building,
  MapPin,
  Car,
  Layers,
  Sparkles,
  Users,
  Search,
  ExternalLink,
  Smartphone,
  Video,
  FileCheck,
  ChevronRight,
  UserCheck,
  Zap,
} from "lucide-react";
import {
  Language,
  ClientTenantConfig,
  ScopeLevel,
  LicenseStatus,
  FeatureModules,
  UserPortalMode,
} from "../types";
import { algerianWilayasList } from "../data/mockData";

interface DeveloperMasterPortalViewProps {
  language: Language;
  currency: string;
  tenants: ClientTenantConfig[];
  currentTenantId: string;
  portalMode: UserPortalMode;
  onUpdateTenantStatus: (tenantId: string, status: LicenseStatus, licenseKey?: string, daysToAdd?: number) => void;
  onSelectTenant: (tenantId: string) => void;
  onAddNewTenant: (newTenant: ClientTenantConfig) => void;
  onTogglePortalMode: (mode: UserPortalMode) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const DeveloperMasterPortalView: React.FC<DeveloperMasterPortalViewProps> = ({
  language,
  currency,
  tenants,
  currentTenantId,
  portalMode,
  onUpdateTenantStatus,
  onSelectTenant,
  onAddNewTenant,
  onTogglePortalMode,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<"tenants" | "calculator" | "licenses">("tenants");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScopeFilter, setSelectedScopeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewTenantModalOpen, setIsNewTenantModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Tenant Form State
  const [formClientName, setFormClientName] = useState("");
  const [formCompanyName, setFormCompanyName] = useState("");
  const [formPhone, setFormPhone] = useState("+213 ");
  const [formEmail, setFormEmail] = useState("");
  const [formScopeLevel, setFormScopeLevel] = useState<ScopeLevel>("wilaya");
  const [formWilayaCode, setFormWilayaCode] = useState("16");
  const [formMunicipality, setFormMunicipality] = useState("الجزائر الوسطى");
  const [formCity, setFormCity] = useState("مدينة الجزائر");
  const [formVehicleCapacity, setFormVehicleCapacity] = useState(15);
  const [formFeatures, setFormFeatures] = useState<FeatureModules>({
    aiAgent: true,
    financialLedger: true,
    smartNotifications: true,
    fleetMaintenance: true,
    intercityRouting: true,
    vipTier: false,
    driverKpi: true,
    liveRadar: true,
    whatsAppGateway: true,
    analyticsCharts: true,
    dashcamSurveillance: true,
  });

  // Calculate pricing dynamically
  const calculatePrice = (
    scope: ScopeLevel,
    vehicles: number,
    features: FeatureModules
  ) => {
    let baseSetup = 25000;
    let baseMonthly = 8000;

    // Scope multiplier
    if (scope === "nationwide") {
      baseSetup += 60000;
      baseMonthly += 35000;
    } else if (scope === "wilaya") {
      baseSetup += 25000;
      baseMonthly += 12000;
    } else if (scope === "city") {
      baseSetup += 15000;
      baseMonthly += 7000;
    } else {
      // municipality
      baseSetup += 8000;
      baseMonthly += 4000;
    }

    // Vehicle capacity pricing: 600 DZD per vehicle/month
    baseMonthly += vehicles * 550;

    // Features pricing
    if (features.dashcamSurveillance) baseMonthly += 4500;
    if (features.aiAgent) baseMonthly += 3500;
    if (features.liveRadar) baseMonthly += 2500;
    if (features.whatsAppGateway) baseMonthly += 2000;
    if (features.vipTier) baseMonthly += 3000;
    if (features.analyticsCharts) baseMonthly += 1500;
    if (features.driverKpi) baseMonthly += 1500;

    return {
      setup: baseSetup,
      monthly: baseMonthly,
    };
  };

  const currentFormPrice = calculatePrice(
    formScopeLevel,
    formVehicleCapacity,
    formFeatures
  );

  const selectedWilayaObj =
    algerianWilayasList.find((w) => w.code === formWilayaCode) || algerianWilayasList[0];

  const handleGenerateKey = (tenantId: string) => {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const key = `MAEK7-LCN-${tenantId.slice(-4)}-${randomHex}-PRO`;
    onUpdateTenantStatus(tenantId, "license_activated", key);
    setToastMessage(
      language === "ar"
        ? `🔑 تم توليد مفتاح الترخيص وتفعيل المنصة: ${key}`
        : `🔑 License key issued & activated: ${key}`
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleExtendTrial = (tenantId: string, days = 30) => {
    onUpdateTenantStatus(tenantId, "trial_active", undefined, days);
    setToastMessage(
      language === "ar"
        ? `⏳ تم تمديد الفترة التجريبية للزبون بمقدار ${days} يوماً بنجاح`
        : `⏳ Trial extended by ${days} days`
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleSuspend = (tenant: ClientTenantConfig) => {
    const newStatus: LicenseStatus =
      tenant.licenseStatus === "suspended"
        ? tenant.trialDaysRemaining > 0
          ? "trial_active"
          : "license_activated"
        : "suspended";

    onUpdateTenantStatus(tenant.tenantId, newStatus);
    setToastMessage(
      language === "ar"
        ? `🔄 تم تحديث حالة المنصة إلى: ${newStatus === "suspended" ? "موقوفة مؤقتاً" : "نشطة ومفعلة"}`
        : `🔄 Tenant status changed to ${newStatus}`
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateNewTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompanyName.trim() || !formClientName.trim()) return;

    const tenantId = `TNT-DZ-${formWilayaCode}${Math.floor(100 + Math.random() * 900)}`;
    const trialStartDate = new Date().toISOString().slice(0, 10);
    const trialEndDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    const newTenant: ClientTenantConfig = {
      tenantId,
      clientName: formClientName,
      companyName: formCompanyName,
      contactPhone: formPhone,
      email: formEmail || `contact@${tenantId.toLowerCase()}.dz`,
      country: "الجزائر (Algeria)",
      wilaya: selectedWilayaObj.arabicName,
      wilayaCode: formWilayaCode,
      municipality: formMunicipality,
      city: formCity,
      scopeLevel: formScopeLevel,
      vehicleCapacity: formVehicleCapacity,
      features: formFeatures,
      calculatedPriceMonthlyDzd: currentFormPrice.monthly,
      calculatedPriceSetupDzd: currentFormPrice.setup,
      licenseStatus: "trial_active",
      trialStartDate,
      trialEndDate,
      trialDaysRemaining: 180, // 6 months free trial
      licenseKey: `MAEK7-TRL-${tenantId.slice(-4)}-INIT-DZ`,
      notes: "تم الإنشاء عبر بوابة المطور مع فترة تجريبية مجانية 6 أشهر",
    };

    onAddNewTenant(newTenant);
    setIsNewTenantModalOpen(false);
    setFormCompanyName("");
    setFormClientName("");
    setToastMessage(
      language === "ar"
        ? `🎉 تم إنشاء منصة الزبون بنجاح مع فترة تجريبية 6 أشهر (180 يوماً)! المعرف: ${tenantId}`
        : `🎉 Client tenant provisioned with 6-month free trial! ID: ${tenantId}`
    );
    setTimeout(() => setToastMessage(null), 6000);
  };

  // Filtered tenants
  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tenantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.wilaya.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesScope =
      selectedScopeFilter === "all" || t.scopeLevel === selectedScopeFilter;

    const matchesStatus =
      statusFilter === "all" || t.licenseStatus === statusFilter;

    return matchesSearch && matchesScope && matchesStatus;
  });

  // Aggregated developer stats
  const totalFleetVehicles = tenants.reduce((acc, t) => acc + t.vehicleCapacity, 0);
  const totalMrrDzd = tenants.reduce(
    (acc, t) => (t.licenseStatus === "license_activated" ? acc + t.calculatedPriceMonthlyDzd : acc),
    0
  );
  const activeTrialsCount = tenants.filter((t) => t.licenseStatus === "trial_active").length;
  const activatedLicensesCount = tenants.filter((t) => t.licenseStatus === "license_activated").length;

  return (
    <div id="developer-master-portal" className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-slate-900 border border-emerald-500 text-emerald-300 px-4 py-3 rounded-xl shadow-xl flex items-center justify-between text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
          >
            {language === "ar" ? "إغلاق" : "Dismiss"}
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <Shield className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold">
                  {language === "ar"
                    ? "بوابة المطور والتحكم المركزي بالمنصات والتراخيص"
                    : language === "fr"
                    ? "Portail Développeur Master & Gestion Multi-Tenants"
                    : "Developer Master Console & Tenant Licensing Engine"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                  DEVELOPER ROOT
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-1 max-w-2xl">
                {language === "ar"
                  ? "إدارة المنصات وقوالب الزبائن حسب الطلب، تفعيل التراخيص، إدارة الفترة التجريبية (6 أشهر)، وحساب الأسعار بناءً على النطاق الجغرافي والأسطول والميزات."
                  : "Manage on-demand tenant instances, grant 6-month free trials, calculate custom pricing, and issue cryptographic licenses."}
              </p>
            </div>
          </div>

          {/* Portal Switcher & Action */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-800/80 backdrop-blur-xs p-1 rounded-xl border border-indigo-500/20 flex items-center gap-1 text-xs">
              <button
                onClick={() => onTogglePortalMode("developer")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  portalMode === "developer"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {language === "ar" ? "واجهة المطور (كاملة)" : "Developer Master"}
              </button>
              <button
                onClick={() => onTogglePortalMode("client")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  portalMode === "client"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {language === "ar" ? "واجهة الزبون (المشغل)" : "Client Mode"}
              </button>
            </div>

            <button
              onClick={() => setIsNewTenantModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>
                {language === "ar"
                  ? "إنشاء منصة زبون جديدة"
                  : "Deploy New Client Instance"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Developer Master KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>{language === "ar" ? "إجمالي المنصات المنشورة" : "Total Deployed Tenants"}</span>
            <Building className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {tenants.length}
            </span>
            <span className="text-xs text-slate-500">{language === "ar" ? "مؤسسة نقل" : "instances"}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>{language === "ar" ? "المركبات المدارة بالشبكة" : "Active Fleet Capacity"}</span>
            <Car className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {totalFleetVehicles}
            </span>
            <span className="text-xs text-slate-500">{language === "ar" ? "مركبة / مقعد" : "vehicles"}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>{language === "ar" ? "الفترة التجريبية النشطة (6 أشهر)" : "Active 6-Mo Trials"}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {activeTrialsCount}
            </span>
            <span className="text-xs text-slate-500">{language === "ar" ? "قيد التجربة المجانية" : "trials"}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>{language === "ar" ? "التراخيص المدفوعة والمفعلة" : "Activated Subscriptions"}</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {activatedLicensesCount}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({totalMrrDzd.toLocaleString()} {currency}/mo)
            </span>
          </div>
        </div>
      </div>

      {/* Main Section Navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("tenants")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "tenants"
              ? "bg-slate-900 text-white dark:bg-indigo-600 dark:text-white"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>{language === "ar" ? "مصفوفة الزبائن والتراخيص" : "Client Tenants & Licenses"}</span>
        </button>

        <button
          onClick={() => setActiveTab("calculator")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "calculator"
              ? "bg-slate-900 text-white dark:bg-indigo-600 dark:text-white"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{language === "ar" ? "حاسبة النطاق والأسعار الذكية" : "Scope & Dynamic Pricing Engine"}</span>
        </button>
      </div>

      {/* TAB 1: Tenants List & License Matrix */}
      {activeTab === "tenants" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  language === "ar"
                    ? "بحث باسم الزبون، المؤسسة، الولاية أو المعرف..."
                    : "Search tenant by company, client, wilaya..."
                }
                className="w-full pl-3 pr-9 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedScopeFilter}
                onChange={(e) => setSelectedScopeFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300"
              >
                <option value="all">{language === "ar" ? "كل النطاقات الجغرافية" : "All Scopes"}</option>
                <option value="nationwide">{language === "ar" ? "كامل الدولة (وطني)" : "Nationwide"}</option>
                <option value="wilaya">{language === "ar" ? "مستوى الولاية" : "Wilaya Level"}</option>
                <option value="municipality">{language === "ar" ? "مستوى البلدية" : "Municipality"}</option>
                <option value="city">{language === "ar" ? "مستوى المدينة" : "City Center"}</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300"
              >
                <option value="all">{language === "ar" ? "كل حالات الترخيص" : "All Statuses"}</option>
                <option value="trial_active">{language === "ar" ? "فترة تجريبية نشطة (6 أشهر)" : "Trial Active"}</option>
                <option value="license_activated">{language === "ar" ? "ترخيص دائم مفعل" : "License Activated"}</option>
                <option value="trial_expired">{language === "ar" ? "فترة تجريبية منتهية" : "Trial Expired"}</option>
                <option value="suspended">{language === "ar" ? "موقوفة مؤقتاً" : "Suspended"}</option>
              </select>
            </div>
          </div>

          {/* Tenants Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-y border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-3">{language === "ar" ? "المعرف والمؤسسة" : "Tenant / Company"}</th>
                  <th className="py-3 px-3">{language === "ar" ? "النطاق الجغرافي" : "Scope & Location"}</th>
                  <th className="py-3 px-3">{language === "ar" ? "الأسطول والميزات" : "Fleet & Modules"}</th>
                  <th className="py-3 px-3">{language === "ar" ? "حالة الترخيص والتجربة" : "Trial & License Status"}</th>
                  <th className="py-3 px-3">{language === "ar" ? "السعر المحسوب" : "Calculated Rate"}</th>
                  <th className="py-3 px-3 text-right">{language === "ar" ? "إجراءات المطور" : "Developer Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTenants.map((tenant) => {
                  const isCurrent = tenant.tenantId === currentTenantId;

                  return (
                    <tr
                      key={tenant.tenantId}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isCurrent ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                      }`}
                    >
                      {/* Company & Client */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{tenant.companyName}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-normal">
                              {language === "ar" ? "الحالي" : "Selected"}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          ID: {tenant.tenantId} • {tenant.clientName}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {tenant.contactPhone}
                        </div>
                      </td>

                      {/* Scope & Wilaya */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                          <span>
                            {tenant.scopeLevel === "nationwide"
                              ? (language === "ar" ? "كامل الدولة (58 ولاية)" : "Nationwide (58 Wilayas)")
                              : tenant.scopeLevel === "wilaya"
                              ? `${tenant.wilaya} (ولاية)`
                              : tenant.scopeLevel === "municipality"
                              ? `${tenant.municipality} (${tenant.wilaya})`
                              : `${tenant.city} (مدينة)`}
                          </span>
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-mono">
                          {tenant.scopeLevel}
                        </span>
                      </td>

                      {/* Fleet & Features */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <Car className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{tenant.vehicleCapacity} {language === "ar" ? "مركبة" : "Vehicles"}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1 max-w-xs">
                          {tenant.features.dashcamSurveillance && (
                            <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded text-[9px]">
                              Dashcam AI
                            </span>
                          )}
                          {tenant.features.aiAgent && (
                            <span className="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded text-[9px]">
                              AI Copilot
                            </span>
                          )}
                          {tenant.features.liveRadar && (
                            <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded text-[9px]">
                              Radar
                            </span>
                          )}
                          {tenant.features.whatsAppGateway && (
                            <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 rounded text-[9px]">
                              WhatsApp
                            </span>
                          )}
                        </div>
                      </td>

                      {/* License & 6-month trial status */}
                      <td className="py-3.5 px-3">
                        {tenant.licenseStatus === "trial_active" && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                              <Clock className="w-3 h-3" />
                              <span>{language === "ar" ? `تجريبي (باقي ${tenant.trialDaysRemaining} يوم)` : `Trial (${tenant.trialDaysRemaining}d left)`}</span>
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">
                              {language === "ar" ? "فترة مجانية 6 أشهر" : "6-month free trial"}
                            </div>
                          </div>
                        )}

                        {tenant.licenseStatus === "license_activated" && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{language === "ar" ? "ترخيص مفعل دائم" : "Activated"}</span>
                            </span>
                            <div className="text-[10px] font-mono text-slate-400 mt-1">
                              {tenant.licenseKey?.slice(0, 14)}...
                            </div>
                          </div>
                        )}

                        {tenant.licenseStatus === "trial_expired" && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800">
                              <Lock className="w-3 h-3" />
                              <span>{language === "ar" ? "فترة التجربة منتهية (مقفول)" : "Trial Expired (Locked)"}</span>
                            </span>
                          </div>
                        )}

                        {tenant.licenseStatus === "suspended" && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              <Lock className="w-3 h-3" />
                              <span>{language === "ar" ? "موقوفة مؤقتاً" : "Suspended"}</span>
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Pricing */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white font-mono">
                          {tenant.calculatedPriceMonthlyDzd.toLocaleString()} {currency}/mo
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {language === "ar" ? "رسوم الإعداد:" : "Setup:"}{" "}
                          {tenant.calculatedPriceSetupDzd.toLocaleString()} {currency}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Open Dedicated App Studio */}
                          <button
                            onClick={() => {
                              onSelectTenant(tenant.tenantId);
                              onNavigateTab?.("app_generator");
                            }}
                            title={language === "ar" ? "توليد وتخصيص تطبيق صاحب الحظيرة" : "Open Branded App Studio"}
                            className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{language === "ar" ? "تطبيق الحظيرة" : "App Studio"}</span>
                          </button>

                          {/* Switch active tenant */}
                          <button
                            onClick={() => onSelectTenant(tenant.tenantId)}
                            title={language === "ar" ? "معاينة وتشغيل هذه المنصة" : "Load this tenant"}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          {/* Generate Key / Activate */}
                          {tenant.licenseStatus !== "license_activated" && (
                            <button
                              onClick={() => handleGenerateKey(tenant.tenantId)}
                              title={language === "ar" ? "تفعيل الترخيص الدائم وتوليد المفتاح" : "Issue License"}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Key className="w-3 h-3" />
                              <span>{language === "ar" ? "تفعيل دائم" : "Activate"}</span>
                            </button>
                          )}

                          {/* Extend Trial */}
                          {tenant.licenseStatus === "trial_active" && (
                            <button
                              onClick={() => handleExtendTrial(tenant.tenantId, 30)}
                              title={language === "ar" ? "تمديد الفترة التجريبية +30 يوماً" : "Extend Trial +30d"}
                              className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Clock className="w-3 h-3" />
                              <span>+30d</span>
                            </button>
                          )}

                          {/* Suspend / Unlock */}
                          <button
                            onClick={() => handleToggleSuspend(tenant)}
                            title={tenant.licenseStatus === "suspended" ? "إلغاء التجميد" : "تجميد المنصة"}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              tenant.licenseStatus === "suspended"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/50"
                            }`}
                          >
                            {tenant.licenseStatus === "suspended" ? (
                              <Unlock className="w-3.5 h-3.5" />
                            ) : (
                              <Lock className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Dynamic Scope & Pricing Calculator */}
      {activeTab === "calculator" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Form Controls */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                {language === "ar"
                  ? "محرك تسعير القوالب وتخصيص النطاق الجغرافي"
                  : "On-Demand Scope & Dynamic Pricing Configurator"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === "ar"
                  ? "حدد النطاق (كامل الدولة، الولاية، البلدية، المدينة)، حجم الأسطول، والميزات المطلوبة لحساب تسعيرة القالب وفترة التجربة."
                  : "Adjust geographic coverage, fleet capacity, and modular add-ons to calculate custom SaaS pricing."}
              </p>
            </div>

            {/* Scope Level Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {language === "ar" ? "1. النطاق الجغرافي للمنظومة:" : "1. Geographic Operating Scope:"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "nationwide", labelAr: "كامل الدولة (58 ولاية)", labelEn: "Nationwide (58 Wilayas)", icon: Layers },
                  { id: "wilaya", labelAr: "مستوى الولاية", labelEn: "Wilaya Level", icon: MapPin },
                  { id: "municipality", labelAr: "مستوى البلدية", labelEn: "Municipality", icon: Building },
                  { id: "city", labelAr: "المحيط الحضري والمدينة", labelEn: "Urban City Center", icon: Car },
                ].map((s) => {
                  const Icon = s.icon;
                  const isSelected = formScopeLevel === s.id;

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setFormScopeLevel(s.id as ScopeLevel)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                      <span className="text-xs font-bold">
                        {language === "ar" ? s.labelAr : s.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Wilaya / Municipality Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "ar" ? "الولاية المحددة:" : "Target Wilaya:"}
                </label>
                <select
                  value={formWilayaCode}
                  onChange={(e) => {
                    setFormWilayaCode(e.target.value);
                    const w = algerianWilayasList.find((x) => x.code === e.target.value);
                    if (w && w.communes[0]) {
                      setFormMunicipality(w.communes[0]);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  {algerianWilayasList.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code} - {w.arabicName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "ar" ? "البلدية أو المقاطعة:" : "Municipality / District:"}
                </label>
                <select
                  value={formMunicipality}
                  onChange={(e) => setFormMunicipality(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  {selectedWilayaObj.communes.map((comm) => (
                    <option key={comm} value={comm}>
                      {comm}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Vehicle Capacity Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>{language === "ar" ? "2. عدد المركبات بالأسطول:" : "2. Fleet Vehicle Capacity:"}</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 text-sm font-bold">
                  {formVehicleCapacity} {language === "ar" ? "مركبة" : "Vehicles"}
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={200}
                value={formVehicleCapacity}
                onChange={(e) => setFormVehicleCapacity(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>2 {language === "ar" ? "مركبات" : "cars"}</span>
                <span>50 {language === "ar" ? "مركبة" : "cars"}</span>
                <span>100 {language === "ar" ? "مركبة" : "cars"}</span>
                <span>200+ {language === "ar" ? "مركبة" : "cars"}</span>
              </div>
            </div>

            {/* Modular Features Matrix */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {language === "ar" ? "3. الميزات الإضافية المخصصة للقالب:" : "3. Modular Feature Add-ons:"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: "dashcamSurveillance", labelAr: "كاميرات المراقبة المزدوجة (Dashcam AI)", labelEn: "AI Dual Dashcam & Cabin Telematics", price: "+4,500 دج/شهر", icon: Video },
                  { key: "aiAgent", labelAr: "الوكيل الذكي للتسيير الآلي (AI Copilot)", labelEn: "AI Operations & Project Agent", price: "+3,500 دج/شهر", icon: Sparkles },
                  { key: "liveRadar", labelAr: "رادار التتبع الجغرافي المباشر (GPS Radar)", labelEn: "Live GPS Telemetry & Radar", price: "+2,500 دج/شهر", icon: MapPin },
                  { key: "whatsAppGateway", labelAr: "بوابة إشعارات الواتساب للزبائن", labelEn: "WhatsApp Customer Notification Hub", price: "+2,000 دج/شهر", icon: Smartphone },
                  { key: "financialLedger", labelAr: "السجل المالي والمحاسبي المتقدم", labelEn: "Advanced Financial Ledger & Invoicing", price: "مضمّن", icon: DollarSign },
                  { key: "fleetMaintenance", labelAr: "إدارة الصيانة الدورية ووقود نفطال", labelEn: "Fleet Maintenance & Naftal Fuel", price: "مضمّن", icon: Sliders },
                  { key: "driverKpi", labelAr: "نظام تنقيط وتقييم السائقين والمكافآت", labelEn: "Driver KPI Scorecards & Gamification", price: "+1,500 دج/شهر", icon: UserCheck },
                  { key: "vipTier", labelAr: "فئة VIP الليموزين والرحلات الخاصة", labelEn: "VIP Luxury Class & Group Booking", price: "+3,000 دج/شهر", icon: Car },
                ].map((f) => {
                  const Icon = f.icon;
                  const isChecked = !!formFeatures[f.key as keyof FeatureModules];

                  return (
                    <div
                      key={f.key}
                      onClick={() =>
                        setFormFeatures({
                          ...formFeatures,
                          [f.key]: !isChecked,
                        })
                      }
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                        isChecked
                          ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-400 dark:border-indigo-800 text-slate-900 dark:text-white"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isChecked ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                        <span className="font-medium text-[11px]">
                          {language === "ar" ? f.labelAr : f.labelEn}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {f.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Live Price Estimate & Deployment Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === "ar" ? "ملخص التسعير والعرض" : "Price Quote Summary"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  {language === "ar" ? "6 أشهر مجانية" : "6-Mo Free Trial"}
                </span>
              </div>

              {/* Scope pill */}
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-xs">
                <div className="text-slate-500 dark:text-slate-400">
                  {language === "ar" ? "النطاق المحدد:" : "Scope:"}{" "}
                  <strong className="text-slate-900 dark:text-white uppercase font-mono">
                    {formScopeLevel}
                  </strong>
                </div>
                <div className="text-slate-700 dark:text-slate-300 text-[11px]">
                  {selectedWilayaObj.arabicName} • {formMunicipality}
                </div>
                <div className="text-slate-700 dark:text-slate-300 text-[11px]">
                  {formVehicleCapacity} {language === "ar" ? "مركبة نشطة" : "Active vehicles"}
                </div>
              </div>

              {/* Price Calculation details */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{language === "ar" ? "رسوم الإعداد والتهيئة الأولية:" : "Initial Setup & Deployment:"}</span>
                  <span className="font-mono">{currentFormPrice.setup.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{language === "ar" ? "الاشتراك الشهري المرجعي:" : "Base Monthly Subscription:"}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {currentFormPrice.monthly.toLocaleString()} {currency}/mo
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>{language === "ar" ? "خصم الفترة التجريبية (6 أشهر):" : "6-Month Trial Discount:"}</span>
                  <span>-100% (0.00 {currency})</span>
                </div>
              </div>

              {/* Net Price during trial */}
              <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white border border-indigo-500/30 text-center">
                <div className="text-xs text-indigo-300">
                  {language === "ar" ? "تكلفة البدء خلال الـ 6 أشهر التجريبية" : "Initial Cost During 6-Mo Trial"}
                </div>
                <div className="text-3xl font-black font-mono mt-1 text-emerald-400">
                  0.00 {currency}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {language === "ar"
                    ? `بعد 6 أشهر: ${currentFormPrice.monthly.toLocaleString()} دج/شهر لحين تفعيل المطور`
                    : `After 6 mo: ${currentFormPrice.monthly.toLocaleString()} DZD/mo upon activation`}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsNewTenantModalOpen(true)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>
                {language === "ar"
                  ? "نشر المنصة للزبون مع تجربة 6 أشهر"
                  : "Deploy Tenant with 6-Mo Trial"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Modal: Create New Tenant */}
      {isNewTenantModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                {language === "ar" ? "بيانات زبون المنصة الجديد" : "New Client Provisioning Form"}
              </h3>
              <button
                onClick={() => setIsNewTenantModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewTenantSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {language === "ar" ? "اسم الشركة أو مؤسسة النقل:" : "Company / Fleet Name:"} *
                </label>
                <input
                  type="text"
                  required
                  value={formCompanyName}
                  onChange={(e) => setFormCompanyName(e.target.value)}
                  placeholder={language === "ar" ? "مثال: مؤسسة النور للنقل والتاكسي السريع" : "e.g. Al-Nour Transit & Taxi"}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {language === "ar" ? "اسم المسؤول / الزبون:" : "Representative Full Name:"} *
                </label>
                <input
                  type="text"
                  required
                  value={formClientName}
                  onChange={(e) => setFormClientName(e.target.value)}
                  placeholder={language === "ar" ? "مثال: عبد القادر بلقاسم" : "e.g. Abdelkader Belkacem"}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {language === "ar" ? "رقم الهاتف:" : "Phone Number:"}
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {language === "ar" ? "البريد الإلكتروني:" : "Email:"}
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="client@transport.dz"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-800 dark:text-amber-300 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{language === "ar" ? "ضمان الفترة التجريبية (6 أشهر مجاناً)" : "6-Month Free Trial Guarantee"}</span>
                </div>
                <p>
                  {language === "ar"
                    ? "سيتم منح الزبون ترخيصاً تجريبياً لمدة 180 يوماً. بعد انتهاء المدة، تغلق المنصة تلقائياً لحين تفعيلك للترخيص الدائم."
                    : "The client gets 180 days free trial. After expiry, the instance locks until you permanently activate it."}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTenantModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs cursor-pointer"
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  {language === "ar" ? "تأكيد وإنشاء المنصة" : "Confirm & Deploy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
