import React, { useState, useEffect } from "react";
import {
  Language,
  PresetTemplate,
  FeatureModules,
  Vehicle,
  Driver,
  Trip,
  FinancialRecord,
  SmartNotification,
  TransactionKind,
  TripStatus,
  ClientTenantConfig,
  UserPortalMode,
  LicenseStatus,
  DashcamVehicleStream,
  DashcamIncident,
} from "./types";
import { translations } from "./i18n/translations";
import {
  initialVehicles,
  initialDrivers,
  initialTrips,
  initialFinancialRecords,
  initialNotifications,
  presetTemplates,
  initialTenantConfigs,
  initialDashcamStreams,
  initialDashcamIncidents,
} from "./data/mockData";

import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/DashboardView";
import { RadarMapView } from "./components/RadarMapView";
import { AnalyticsTLCView } from "./components/AnalyticsTLCView";
import { VehiclesView } from "./components/VehiclesView";
import { DriversView } from "./components/DriversView";
import { DriverKpiView } from "./components/DriverKpiView";
import { TripsView } from "./components/TripsView";
import { MaintenanceView } from "./components/MaintenanceView";
import { FinanceView } from "./components/FinanceView";
import { AIAgentView } from "./components/AIAgentView";
import { TemplatesView } from "./components/TemplatesView";
import { AppGeneratorView } from "./components/AppGeneratorView";
import { NotificationsView } from "./components/NotificationsView";
import { WhatsAppGatewayView } from "./components/WhatsAppGatewayView";
import { SettingsView } from "./components/SettingsView";
import { DashcamSurveillanceView } from "./components/DashcamSurveillanceView";
import { DeveloperMasterPortalView } from "./components/DeveloperMasterPortalView";
import { ScopePricingConfiguratorView } from "./components/ScopePricingConfiguratorView";

import {
  VehicleModal,
  DriverModal,
  TripModal,
  FinanceModal,
  BroadcastModal,
} from "./components/Modals";
import { Lock, Key, Shield, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export default function App() {
  // Localization State
  const [currentLang, setCurrentLang] = useState<Language>("ar");

  // Portal Role & Tenant Management State
  const [portalMode, setPortalMode] = useState<UserPortalMode>("developer");
  const [tenants, setTenants] = useState<ClientTenantConfig[]>(initialTenantConfigs);
  const [currentTenantId, setCurrentTenantId] = useState<string>(initialTenantConfigs[0].tenantId);

  // Dashcam Surveillance State
  const [dashcamStreams, setDashcamStreams] = useState<DashcamVehicleStream[]>(initialDashcamStreams);
  const [dashcamIncidents, setDashcamIncidents] = useState<DashcamIncident[]>(initialDashcamIncidents);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Institution Profile
  const [institutionName, setInstitutionName] = useState("المؤسسة الذكية لتسيير سيارات الأجرة والنقل");
  const [supervisorName, setSupervisorName] = useState("المدير العام للتشغيل");

  // Template & Feature Modules State
  const [activeTemplate, setActiveTemplate] = useState<PresetTemplate>(presetTemplates[2]); // Enterprise AI default
  const [featureFlags, setFeatureFlags] = useState<FeatureModules>(presetTemplates[2].features);

  // Fleet Entity State
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(initialFinancialRecords);
  const [notifications, setNotifications] = useState<SmartNotification[]>(initialNotifications);

  // Modal States
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const [isTripModalOpen, setIsTripModalOpen] = useState(false);

  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);
  const [financeModalKind, setFinanceModalKind] = useState<TransactionKind>("income");

  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [activationKeyInput, setActivationKeyInput] = useState("");
  const [activationError, setActivationError] = useState<string | null>(null);

  const activeTenant =
    tenants.find((t) => t.tenantId === currentTenantId) || tenants[0];

  // Sync document direction and title
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    document.title =
      currentLang === "ar"
        ? "MAEK7-TAXI | المنظومة الإدارية الذكية لتسيير الأسطول"
        : currentLang === "fr"
        ? "MAEK7-TAXI | Plateforme Intelligente de Gestion de Flotte"
        : "MAEK7-TAXI | Smart Fleet & Transport Management Platform";
  }, [currentLang]);

  // When active tenant changes, adapt name and feature modules
  useEffect(() => {
    if (activeTenant) {
      setInstitutionName(activeTenant.companyName);
      setSupervisorName(activeTenant.clientName);
      setFeatureFlags((prev) => ({
        ...prev,
        ...activeTenant.features,
      }));
    }
  }, [currentTenantId]);

  // Tenant Status & License Management Handlers
  const handleUpdateTenantStatus = (
    tenantId: string,
    status: LicenseStatus,
    licenseKey?: string,
    daysToAdd?: number
  ) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.tenantId !== tenantId) return t;

        let newDays = t.trialDaysRemaining;
        if (daysToAdd) newDays += daysToAdd;
        if (status === "license_activated") newDays = 9999;

        return {
          ...t,
          licenseStatus: status,
          licenseKey: licenseKey || t.licenseKey,
          trialDaysRemaining: newDays,
        };
      })
    );
  };

  const handleAddNewTenant = (newTenant: ClientTenantConfig) => {
    setTenants((prev) => [newTenant, ...prev]);
    setCurrentTenantId(newTenant.tenantId);
  };

  const handleClientSelfActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationKeyInput.trim()) return;

    if (
      activationKeyInput.toUpperCase().startsWith("MAEK7-") ||
      activationKeyInput.length >= 10
    ) {
      handleUpdateTenantStatus(activeTenant.tenantId, "license_activated", activationKeyInput);
      setActivationError(null);
      setActivationKeyInput("");
    } else {
      setActivationError(
        currentLang === "ar"
          ? "مفتاح الترخيص غير صالح. يرجى الحصول على المفتاح الصحيح من المطور الرئيسي."
          : "Invalid license key format. Please request from master developer."
      );
    }
  };

  // Handler: Apply Template
  const handleApplyTemplate = (tpl: PresetTemplate) => {
    setActiveTemplate(tpl);
    setFeatureFlags({ ...tpl.features });
  };

  // Handler: Toggle single feature module
  const handleToggleFeature = (featKey: keyof FeatureModules) => {
    setFeatureFlags((prev) => {
      const updated = { ...prev, [featKey]: !prev[featKey] };
      setActiveTemplate((tPrev) => ({
        ...tPrev,
        id: "custom",
        name: { ar: "قالب مخصص", en: "Custom Template", fr: "Modèle Personnalisé" },
        features: updated,
      }));
      return updated;
    });
  };

  // Handlers: Vehicles CRUD
  const handleSaveVehicle = (vehicleData: Partial<Vehicle>) => {
    if (editingVehicle) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === editingVehicle.id ? ({ ...v, ...vehicleData } as Vehicle) : v))
      );
    } else {
      setVehicles((prev) => [vehicleData as Vehicle, ...prev]);
    }
  };

  const handleDeleteVehicle = (id: string | number) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  // Handlers: Drivers CRUD
  const handleSaveDriver = (driverData: Partial<Driver>) => {
    if (editingDriver) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === editingDriver.id ? ({ ...d, ...driverData } as Driver) : d))
      );
    } else {
      setDrivers((prev) => [driverData as Driver, ...prev]);
    }
  };

  const handleDeleteDriver = (id: string | number) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
  };

  // Handlers: Trips CRUD
  const handleSaveTrip = (tripData: Partial<Trip>) => {
    setTrips((prev) => [tripData as Trip, ...prev]);
  };

  const handleTripStatusChange = (tripId: string, newStatus: TripStatus) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: newStatus } : t))
    );
  };

  // Handlers: Finance
  const handleSaveFinance = (recordData: Partial<FinancialRecord>) => {
    const newRecord: FinancialRecord = {
      id: `TRX-${Date.now().toString().slice(-4)}`,
      date: recordData.date || new Date().toISOString().slice(0, 10),
      kind: recordData.kind || "income",
      label: recordData.label || "إيراد تشغيلي / رحلة",
      category: recordData.category || "trips",
      amount: recordData.amount || 0,
    };
    setFinancialRecords((prev) => [newRecord, ...prev]);
  };

  const handleDeleteFinance = (id: string) => {
    setFinancialRecords((prev) => prev.filter((f) => f.id !== id));
  };

  // Handlers: Notifications
  const handleNotificationItemClick = (notif: SmartNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    if (notif.actionTab) {
      setCurrentTab(notif.actionTab);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  const handleBroadcastNotification = (notifData: {
    title: string;
    message: string;
    target: "all" | "active_drivers" | "supervisors";
    urgency: "critical" | "warning" | "info";
  }) => {
    const newNotif: SmartNotification = {
      id: `BC-${Date.now()}`,
      type: "system",
      urgency: notifData.urgency,
      title: { ar: notifData.title, en: notifData.title, fr: notifData.title },
      message: { ar: notifData.message, en: notifData.message, fr: notifData.message },
      timestamp: "الآن",
      read: false,
      actionTab: "trips",
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Export and Reset
  const handleExportData = () => {
    const data = { vehicles, drivers, trips, financialRecords, notifications };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MAEK7_TAXI_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    setVehicles(initialVehicles);
    setDrivers(initialDrivers);
    setTrips(initialTrips);
    setFinancialRecords(initialFinancialRecords);
    setNotifications(initialNotifications);
  };

  const unreadAlerts = notifications.filter((n) => !n.read).length;
  const ongoingTripsCount = trips.filter((t) => t.status === "ongoing").length;

  // SaaS Expired & Locked Screen Guard for Client Mode
  const isClientLocked =
    portalMode === "client" &&
    (activeTenant.licenseStatus === "trial_expired" ||
      activeTenant.licenseStatus === "suspended");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 antialiased">
      {/* Top Header Navigation */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTemplate={activeTemplate}
        notifications={notifications}
        onNotificationClick={handleNotificationItemClick}
        onMarkAllRead={handleMarkAllRead}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onNavigateTab={setCurrentTab}
        supervisorName={supervisorName}
        portalMode={portalMode}
        onTogglePortalMode={setPortalMode}
        activeTenant={activeTenant}
      />

      {/* Expired / Locked Screen for Client */}
      {isClientLocked ? (
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-950">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/40 rounded-3xl p-8 text-center space-y-5 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-white">
                {currentLang === "ar"
                  ? "انتهت الفترة التجريبية (6 أشهر)"
                  : "6-Month Free Trial Expired"}
              </h2>
              <p className="text-xs text-slate-400">
                {currentLang === "ar"
                  ? `المنصة الخاصة بـ (${activeTenant.companyName}) مقفلة لحين التفعيل من المنصة الرئيسية للمطور.`
                  : `This tenant instance is locked until permanent activation by the master developer.`}
              </p>
            </div>

            {/* Quick Key Activation Form */}
            <form onSubmit={handleClientSelfActivate} className="space-y-2 text-start">
              <label className="block text-xs font-semibold text-slate-300">
                {currentLang === "ar"
                  ? "لديك مفتاح ترخيص صادر من المطور؟"
                  : "Have an official license key?"}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={activationKeyInput}
                  onChange={(e) => setActivationKeyInput(e.target.value)}
                  placeholder="MAEK7-LCN-XXXX-XXXX"
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {currentLang === "ar" ? "تفعيل" : "Activate"}
                </button>
              </div>
              {activationError && (
                <p className="text-[11px] text-red-400">{activationError}</p>
              )}
            </form>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => setPortalMode("developer")}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>
                  {currentLang === "ar"
                    ? "التبديل إلى واجهة المطور لإعادة التفعيل"
                    : "Switch to Developer Master Mode to Unlock"}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Structural Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 h-[calc(100vh-4.25rem)] sticky top-[4.25rem]">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              currentLang={currentLang}
              featureFlags={featureFlags}
              activeTemplate={activeTemplate}
              portalMode={portalMode}
              counts={{
                vehicles: vehicles.length,
                drivers: drivers.length,
                ongoingTrips: ongoingTripsCount,
                unreadNotifs: unreadAlerts,
              }}
              institutionName={institutionName}
              supervisorName={supervisorName}
            />
          </aside>

          {/* Mobile Drawer Sidebar */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="relative w-80 max-w-[85vw] h-full z-10 animate-in slide-in-from-start">
                <Sidebar
                  currentTab={currentTab}
                  onSelectTab={setCurrentTab}
                  currentLang={currentLang}
                  featureFlags={featureFlags}
                  activeTemplate={activeTemplate}
                  portalMode={portalMode}
                  counts={{
                    vehicles: vehicles.length,
                    drivers: drivers.length,
                    ongoingTrips: ongoingTripsCount,
                    unreadNotifs: unreadAlerts,
                  }}
                  institutionName={institutionName}
                  supervisorName={supervisorName}
                  onCloseMobile={() => setMobileMenuOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto pb-12">
              {currentTab === "dashboard" && (
                <DashboardView
                  currentLang={currentLang}
                  vehicles={vehicles}
                  drivers={drivers}
                  trips={trips}
                  financialRecords={financialRecords}
                  notifications={notifications}
                  featureFlags={featureFlags}
                  activeTemplate={activeTemplate}
                  onNavigate={setCurrentTab}
                  onTripStatusChange={handleTripStatusChange}
                  onResolveAlert={handleNotificationItemClick as any}
                />
              )}

              {currentTab === "radar" && featureFlags.liveRadar && (
                <RadarMapView
                  currentLang={currentLang}
                  institutionName={institutionName}
                />
              )}

              {currentTab === "dashcam" && featureFlags.dashcamSurveillance && (
                <DashcamSurveillanceView
                  language={currentLang}
                  streams={dashcamStreams}
                  incidents={dashcamIncidents}
                  onResolveIncident={(incidentId) => {
                    setDashcamIncidents((prev) =>
                      prev.map((inc) =>
                        inc.id === incidentId ? { ...inc, resolved: true } : inc
                      )
                    );
                  }}
                  onTriggerBroadcast={(vehicleId, msg) => {
                    handleBroadcastNotification({
                      title: `تنبيه أمني فوري: ${vehicleId}`,
                      message: msg,
                      target: "active_drivers",
                      urgency: "critical",
                    });
                  }}
                />
              )}

              {currentTab === "tlc_analytics" && featureFlags.analyticsCharts && (
                <AnalyticsTLCView
                  currentLang={currentLang}
                  institutionName={institutionName}
                />
              )}

              {currentTab === "vehicles" && (
                <VehiclesView
                  currentLang={currentLang}
                  vehicles={vehicles}
                  onAddVehicle={() => {
                    setEditingVehicle(null);
                    setIsVehicleModalOpen(true);
                  }}
                  onEditVehicle={(veh) => {
                    setEditingVehicle(veh);
                    setIsVehicleModalOpen(true);
                  }}
                  onDeleteVehicle={handleDeleteVehicle}
                />
              )}

              {currentTab === "drivers" && (
                <DriversView
                  currentLang={currentLang}
                  drivers={drivers}
                  institutionName={institutionName}
                  onAddDriver={() => {
                    setEditingDriver(null);
                    setIsDriverModalOpen(true);
                  }}
                  onEditDriver={(drv) => {
                    setEditingDriver(drv);
                    setIsDriverModalOpen(true);
                  }}
                  onDeleteDriver={handleDeleteDriver}
                />
              )}

              {currentTab === "driver_kpi" && featureFlags.driverKpi && (
                <DriverKpiView
                  currentLang={currentLang}
                  drivers={drivers}
                  institutionName={institutionName}
                />
              )}

              {currentTab === "trips" && (
                <TripsView
                  currentLang={currentLang}
                  trips={trips}
                  drivers={drivers}
                  institutionName={institutionName}
                  onNewTrip={() => setIsTripModalOpen(true)}
                  onStatusChange={handleTripStatusChange}
                />
              )}

              {currentTab === "maintenance" && featureFlags.fleetMaintenance && (
                <MaintenanceView
                  currentLang={currentLang}
                  vehicles={vehicles}
                  onAddExpense={handleSaveFinance}
                />
              )}

              {currentTab === "finance" && featureFlags.financialLedger && (
                <FinanceView
                  currentLang={currentLang}
                  financialRecords={financialRecords}
                  onAddTransaction={(kind) => {
                    setFinanceModalKind(kind);
                    setIsFinanceModalOpen(true);
                  }}
                  onDeleteTransaction={handleDeleteFinance}
                />
              )}

              {currentTab === "ai" && featureFlags.aiAgent && (
                <AIAgentView
                  currentLang={currentLang}
                  vehicles={vehicles}
                  drivers={drivers}
                  trips={trips}
                  financialRecords={financialRecords}
                />
              )}

              {currentTab === "scope_config" && (
                <ScopePricingConfiguratorView
                  language={currentLang}
                  currency={currentLang === "ar" ? "دج" : "DZD"}
                  activeTenant={activeTenant}
                  onRequestUpgrade={(notes) => {
                    const newNotif: SmartNotification = {
                      id: `UPG-${Date.now()}`,
                      type: "system",
                      urgency: "info",
                      title: {
                        ar: "طلب تعديل قالب ونطاق المؤسسة",
                        en: "Scope & Template Upgrade Request",
                        fr: "Demande de Mise à niveau de Périmètre",
                      },
                      message: {
                        ar: `تم تسجيل طلبك: ${notes}`,
                        en: `Your request was logged: ${notes}`,
                        fr: `Votre demande a été enregistrée: ${notes}`,
                      },
                      timestamp: "الآن",
                      read: false,
                      actionTab: "developer_portal",
                    };
                    setNotifications((prev) => [newNotif, ...prev]);
                  }}
                />
              )}

              {currentTab === "developer_portal" && (
                <DeveloperMasterPortalView
                  language={currentLang}
                  currency={currentLang === "ar" ? "دج" : "DZD"}
                  tenants={tenants}
                  currentTenantId={currentTenantId}
                  portalMode={portalMode}
                  onUpdateTenantStatus={handleUpdateTenantStatus}
                  onSelectTenant={setCurrentTenantId}
                  onAddNewTenant={handleAddNewTenant}
                  onTogglePortalMode={setPortalMode}
                  onNavigateTab={setCurrentTab}
                />
              )}

              {currentTab === "templates" && (
                <TemplatesView
                  currentLang={currentLang}
                  activeTemplate={activeTemplate}
                  featureFlags={featureFlags}
                  onApplyTemplate={handleApplyTemplate}
                  onToggleFeature={handleToggleFeature}
                  onNavigateTab={setCurrentTab}
                />
              )}

              {currentTab === "app_generator" && (
                <AppGeneratorView
                  currentLang={currentLang}
                  activeTemplate={activeTemplate}
                  featureFlags={featureFlags}
                  activeTenant={activeTenant}
                  institutionName={institutionName}
                  supervisorName={supervisorName}
                  onNavigateTab={setCurrentTab}
                />
              )}

              {currentTab === "notifications" && featureFlags.smartNotifications && (
                <NotificationsView
                  currentLang={currentLang}
                  notifications={notifications}
                  institutionName={institutionName}
                  onMarkAllRead={handleMarkAllRead}
                  onClearRead={handleClearRead}
                  onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
                  onNotificationClick={handleNotificationItemClick}
                />
              )}

              {currentTab === "whatsapp" && featureFlags.whatsAppGateway && (
                <WhatsAppGatewayView
                  currentLang={currentLang}
                  drivers={drivers}
                  trips={trips}
                  vehicles={vehicles}
                  institutionName={institutionName}
                />
              )}

              {currentTab === "settings" && (
                <SettingsView
                  currentLang={currentLang}
                  institutionName={institutionName}
                  supervisorName={supervisorName}
                  onSaveSettings={(s) => {
                    setInstitutionName(s.institutionName);
                    setSupervisorName(s.supervisorName);
                  }}
                  onExportData={handleExportData}
                  onResetData={handleResetData}
                />
              )}
            </div>
          </main>
        </div>
      )}

      {/* Global Interactive Modals */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSave={handleSaveVehicle}
        currentLang={currentLang}
        initialVehicle={editingVehicle}
        drivers={drivers}
      />

      <DriverModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        onSave={handleSaveDriver}
        currentLang={currentLang}
        initialDriver={editingDriver}
        vehicles={vehicles}
      />

      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onSave={handleSaveTrip}
        currentLang={currentLang}
        drivers={drivers}
        vehicles={vehicles}
      />

      <FinanceModal
        isOpen={isFinanceModalOpen}
        onClose={() => setIsFinanceModalOpen(false)}
        onSave={handleSaveFinance}
        currentLang={currentLang}
        defaultKind={financeModalKind}
      />

      <BroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onSave={handleBroadcastNotification}
        currentLang={currentLang}
        drivers={drivers}
      />
    </div>
  );
}
