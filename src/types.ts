export type Language = "ar" | "en" | "fr";

export type Direction = "rtl" | "ltr";

export type VehicleType = "taxi" | "bus" | "minibus" | "vip";

export type VehicleStatus = "active" | "in_maintenance" | "stopped";

export interface Vehicle {
  id: string | number;
  plate: string;
  type: VehicleType;
  driver: string;
  status: VehicleStatus;
  wilaya: string;
  commune: string;
  mileage: number;
  fuelType?: "diesel" | "essence" | "gpl" | "hybrid";
  modelYear?: number;
  capacity?: number;
}

export type DriverStatus = "active" | "on_leave" | "suspended";

export interface Driver {
  id: string | number;
  name: string;
  phone: string;
  license: string;
  vehicle: string;
  status: DriverStatus;
  rating: number;
  trips: number;
  wilaya?: string;
  avatarColor?: string;
}

export type TripStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

export type ServiceTier = "standard" | "vip" | "group";

export interface Trip {
  id: string | number;
  driver: string;
  vehicle: string;
  from: string;
  to: string;
  price: number;
  status: TripStatus;
  time: string;
  date: string;
  passengerName?: string;
  passengerPhone?: string;
  serviceTier?: ServiceTier;
}

export type TransactionKind = "income" | "expense";

export type TransactionCategory =
  | "trips"
  | "contracts"
  | "fuel"
  | "maintenance"
  | "salaries"
  | "insurance"
  | "taxes"
  | "other";

export interface FinancialRecord {
  id: string | number;
  kind: TransactionKind;
  label: string;
  category: TransactionCategory;
  amount: number;
  date: string;
}

export type NotificationType = "maintenance" | "license" | "fuel" | "trip" | "system" | "vip";

export type NotificationUrgency = "critical" | "warning" | "info" | "success";

export interface SmartNotification {
  id: string;
  type: NotificationType;
  urgency: NotificationUrgency;
  title: Record<Language, string>;
  message: Record<Language, string>;
  timestamp: string;
  read: boolean;
  actionKey?: string;
  actionTab?: string;
  recipientPhone?: string;
  driverName?: string;
}

export type TemplateId = "solo_micro" | "fleet_standard" | "enterprise_ai" | "custom";

export interface TlcFleetMetrics {
  month: string;
  uniqueVehicles: number;
  uniqueDrivers: number;
  tripsPerDay: number;
  fareboxPerDay: number;
  fareboxPerVehicle: number;
  fareboxPerDriver: number;
  fareboxPerTrip: number;
  fareboxPerMinute: number;
  tripsPerVehiclePerDay: number;
  activeTripHoursPerDay: number;
  sharedTripsFrac: number;
  avgMinutesPerTrip: number;
  yoyGrowthPct: number;
}

export type MaintenanceType =
  | "oil_change"
  | "brakes"
  | "tires"
  | "tech_inspection"
  | "insurance"
  | "battery"
  | "general";

export interface MaintenanceRecord {
  id: string;
  vehiclePlate: string;
  vehicleModel: string;
  type: MaintenanceType;
  lastServicedMileage: number;
  dueMileage: number;
  currentMileage: number;
  dueDate?: string;
  estimatedCost: number;
  status: "good" | "due_soon" | "overdue" | "completed";
  technicianNotes?: string;
}

export interface FuelLog {
  id: string;
  vehiclePlate: string;
  driverName: string;
  date: string;
  liters: number;
  cost: number;
  odometer: number;
  fuelCardNum: string;
  station: string;
  efficiencyL100km: number;
}

export interface DriverScorecard {
  driverId: string | number;
  driverName: string;
  safetyScore: number; // 0-100
  punctualityScore: number; // 0-100
  acceptanceRate: number; // %
  customerRating: number; // 1-5
  totalTripsMonth: number;
  revenueGenerated: number;
  bonusEarned: number;
  badge: "diamond" | "gold" | "silver" | "bronze";
  awards: string[];
}

export interface LiveTelemetryVehicle {
  id: string;
  plate: string;
  driver: string;
  type: VehicleType;
  status: "active_trip" | "idle_ready" | "in_maintenance";
  x: number; // map coordinate 0-100%
  y: number; // map coordinate 0-100%
  speedKmh: number;
  headingDeg: number;
  fuelPercent: number;
  currentRoute?: {
    from: string;
    to: string;
    etaMinutes: number;
    passenger: string;
  };
  zone: string;
}

export interface ZoneAnalytics {
  id: string;
  name: string;
  arabicName: string;
  zoneType: "airport" | "central_hub" | "university" | "intercity" | "suburb";
  dailyPickups: number;
  dailyDropoffs: number;
  surgeFactor: number;
  avgTripDurationMin: number;
  avgFareDzd: number;
  demandTrend: "up" | "stable" | "down";
}

export interface FeatureModules {
  aiAgent: boolean;
  financialLedger: boolean;
  smartNotifications: boolean;
  fleetMaintenance: boolean;
  intercityRouting: boolean;
  vipTier: boolean;
  driverKpi: boolean;
  liveRadar: boolean;
  whatsAppGateway: boolean;
  analyticsCharts: boolean;
  dashcamSurveillance: boolean;
}

export type ScopeLevel = "nationwide" | "wilaya" | "municipality" | "city";

export type LicenseStatus =
  | "trial_active"
  | "license_activated"
  | "trial_expired"
  | "suspended";

export type UserPortalMode = "developer" | "client";

export interface ClientTenantConfig {
  tenantId: string;
  clientName: string;
  companyName: string;
  contactPhone: string;
  email: string;
  country: string;
  wilaya: string;
  wilayaCode: string;
  municipality: string;
  city: string;
  scopeLevel: ScopeLevel;
  vehicleCapacity: number;
  features: FeatureModules;
  calculatedPriceMonthlyDzd: number;
  calculatedPriceSetupDzd: number;
  licenseStatus: LicenseStatus;
  trialStartDate: string;
  trialEndDate: string;
  trialDaysRemaining: number;
  licenseKey?: string;
  activatedAt?: string;
  notes?: string;
  aiConfig?: TenantAiConfig;
}

export type IncidentType =
  | "fatigue_drowsiness"
  | "phone_distraction"
  | "lane_departure"
  | "sudden_braking"
  | "passenger_sos"
  | "seatbelt_unbuckled"
  | "speeding";

export interface DashcamIncident {
  id: string;
  vehiclePlate: string;
  driverName: string;
  timestamp: string;
  type: IncidentType;
  severity: "critical" | "warning" | "info";
  details: string;
  cameraSource: "cabin" | "road";
  location: string;
  speedKmh: number;
  resolved: boolean;
}

export interface DashcamVehicleStream {
  vehicleId: string;
  plate: string;
  driverName: string;
  speedKmh: number;
  gpsLocation: string;
  driverDrowsinessPercent: number; // 0-100% (High = Drowsy)
  phoneDetected: boolean;
  seatbeltFastened: boolean;
  passengerCount: number;
  isRecording: boolean;
  isIntercomActive: boolean;
  roadStatus: "safe" | "warning" | "hazard";
  cabinStatus: "normal" | "alert" | "sos";
  lastIncidentNote?: string;
}

export interface PresetTemplate {
  id: TemplateId;
  name: Record<Language, string>;
  description: Record<Language, string>;
  badge: string;
  recommendedFor: Record<Language, string>;
  features: FeatureModules;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  modelUsed?: string;
  suggestions?: string[];
}

export interface AppSettings {
  appName: string;
  brandTagline: string;
  institutionName: string;
  supervisorName: string;
  wilayaOptional: boolean;
  defaultLanguage: Language;
  currency: string;
  enableSoundFx: boolean;
  autoDispatchInterval: number;
}

export type AppThemeColor =
  | "amber"
  | "emerald"
  | "indigo"
  | "rose"
  | "cyan"
  | "gold"
  | "violet"
  | "dark";

export type LogoEmblemType =
  | "classic_taxi"
  | "modern_speed"
  | "vip_chauffeur"
  | "eco_hybrid"
  | "sahara_express"
  | "metro_transit"
  | "custom";

export interface TenantAiConfig {
  aiName: string;
  aiProvider: "local_edge_ai" | "gemini_pro" | "hybrid_offline" | "enterprise_cloud";
  autoMaintenanceEnabled: boolean;
  lastSystemHealthScore: number;
  selfHealingActionsCount: number;
  customSystemInstructions?: string;
  offlineDatabaseSync: boolean;
  maintenanceIntervalMinutes: number;
  smartDispatchAggressiveness: "conservative" | "balanced" | "aggressive";
}

export interface SystemMaintenanceTask {
  id: string;
  category: "database" | "telemetry" | "engine_telemetry" | "driver_kpi" | "fuel_audit" | "security";
  title: string;
  description: string;
  status: "healthy" | "warning" | "critical" | "repaired";
  lastChecked: string;
  autoFixable: boolean;
  recommendedAction: string;
  metrics?: { label: string; value: string | number }[];
}

export interface VoiceCommandAction {
  id: string;
  transcript: string;
  recognizedIntent: string;
  executedAction: string;
  timestamp: string;
  status: "success" | "pending" | "clarification_needed";
  feedbackAudioText?: string;
}

export interface VideoTutorialChapter {
  id: string;
  title: Record<Language, string>;
  duration: string;
  startTime: number;
  summary: Record<Language, string>;
  iconName: string;
  steps: {
    title: Record<Language, string>;
    description: Record<Language, string>;
    screenshotBadge: string;
    actionTargetTab?: string;
  }[];
}

export interface FleetOwnerAppConfig {
  appId: string;
  tenantId: string;
  appName: string;
  companyName: string;
  ownerName: string;
  tagline: string;
  contactPhone: string;
  dispatchWhatsApp: string;
  wilaya: string;
  wilayaCode: string;
  commune: string;
  themeColor: AppThemeColor;
  logoType: LogoEmblemType;
  customLogoUrl?: string;
  selectedTemplateId: TemplateId;
  enabledModules: FeatureModules;
  passengerAppEnabled: boolean;
  driverAppEnabled: boolean;
  dispatcherWebEnabled: boolean;
  allowCashPayment: boolean;
  allowCardPayment: boolean;
  allowBaridiMob: boolean;
  baseFareDzd: number;
  perKmRateDzd: number;
  pwaShortName: string;
  appVersion: string;
  customSubdomain: string;
  generatedAt?: string;
  apkDownloadCount?: number;
  pwaInstallCount?: number;
}


