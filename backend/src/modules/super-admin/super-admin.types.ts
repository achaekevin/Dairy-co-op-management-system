export interface SuperAdminDashboardStats {
  totalFarmers: number;
  totalCustomers: number;
  totalEmployees: number;
  totalMilkCollected: number;
  todaysMilkCollection: number;
  monthlyRevenue: number;
  activeLoans: number;
  outstandingPayments: number;
  inventoryValue: number;
  totalBranches: number;
  activeUsers: number;
  systemHealth: SystemHealth;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  database: ServiceStatus;
  redis: ServiceStatus;
  api: ServiceStatus;
  uptime: number;
  memory: MemoryStats;
  cpu: number;
}

export interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
  lastChecked: Date;
}

export interface MemoryStats {
  used: number;
  total: number;
  percentage: number;
}

export interface AuditLogQuery {
  userId?: string;
  action?: string;
  entity?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface LoginHistoryQuery {
  userId?: string;
  status?: 'success' | 'failed';
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface SystemSettings {
  general: GeneralSettings;
  branding: BrandingSettings;
  financial: FinancialSettings;
  milkPricing: MilkPricingSettings;
  loanSettings: LoanSettings;
  shareSettings: ShareSettings;
  taxSettings: TaxSettings;
}

export interface GeneralSettings {
  siteName: string;
  siteUrl: string;
  adminEmail: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  timezone: string;
  currency: string;
  dateFormat: string;
}

export interface BrandingSettings {
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface FinancialSettings {
  fiscalYearStart: string;
  accountingMethod: 'cash' | 'accrual';
  baseCurrency: string;
}

export interface MilkPricingSettings {
  basePrice: number;
  fatPrice: number;
  snfPrice: number;
  qualityBonus: {
    excellent: number;
    good: number;
  };
}

export interface LoanSettings {
  minLoanAmount: number;
  maxLoanAmount: number;
  minInterestRate: number;
  maxInterestRate: number;
  minTenure: number;
  maxTenure: number;
}

export interface ShareSettings {
  shareValue: number;
  minShares: number;
  maxShares: number;
  dividendRate: number;
}

export interface TaxSettings {
  vatRate: number;
  withholdingTax: number;
  incomeTax: number;
}

export interface BackupInfo {
  id: string;
  filename: string;
  size: number;
  createdAt: Date;
  type: 'manual' | 'automatic';
  status: 'completed' | 'in_progress' | 'failed';
}
