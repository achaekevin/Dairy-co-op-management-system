export interface AccountantDashboardStats {
  revenueToday: number;
  pendingPayments: number;
  monthlyRevenue: number;
  loanBalance: number;
  cashFlow: number;
  outstandingExpenses: number;
}

export interface PaymentGeneration {
  farmerId: string;
  period: string;
  totalQuantity: number;
  totalAmount: number;
  bonusAmount: number;
  deductionAmount: number;
  netAmount: number;
  status: 'PENDING' | 'APPROVED' | 'PAID';
}

export interface FarmerStatement {
  farmerId: string;
  farmerName: string;
  period: string;
  collections: {
    date: Date;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  totalQuantity: number;
  totalAmount: number;
  bonuses: number;
  deductions: number;
  netAmount: number;
  payments: {
    date: Date;
    amount: number;
    status: string;
  }[];
}

export interface LoanLedger {
  loanId: string;
  loanNumber: string;
  farmerId: string;
  farmerName: string;
  principalAmount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: string;
}

export interface RepaymentSchedule {
  loanId: string;
  loanNumber: string;
  installments: {
    installmentNumber: number;
    dueDate: Date;
    principal: number;
    interest: number;
    totalEmi: number;
    paid: boolean;
    paidDate?: Date;
    balance: number;
  }[];
}

export interface InterestCalculation {
  principalAmount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  totalInterest: number;
  totalAmount: number;
  monthlyBreakdown: {
    month: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export interface ShareContribution {
  farmerId: string;
  farmerName: string;
  shareCount: number;
  shareValue: number;
  totalContribution: number;
  contributionDate: Date;
  certificateNumber?: string;
}

export interface DividendPayment {
  farmerId: string;
  farmerName: string;
  shareCount: number;
  dividendRate: number;
  dividendAmount: number;
  taxDeduction: number;
  netDividend: number;
  paymentDate?: Date;
  status: 'PENDING' | 'PAID';
}

export interface ShareStatement {
  farmerId: string;
  farmerName: string;
  shares: {
    shareNumber: string;
    shareCount: number;
    purchaseDate: Date;
    shareValue: number;
    totalValue: number;
  }[];
  totalShares: number;
  totalValue: number;
  dividends: {
    year: number;
    amount: number;
    status: string;
  }[];
}

export interface EmployeeSalary {
  employeeId: string;
  employeeName: string;
  designation: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentDate?: Date;
  status: 'PENDING' | 'PAID';
}

export interface ChartOfAccounts {
  accounts: {
    code: string;
    name: string;
    type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
    balance: number;
    parent?: string;
  }[];
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: Date;
  description: string;
  reference?: string;
  entries: {
    accountCode: string;
    accountName: string;
    debit: number;
    credit: number;
  }[];
  totalDebit: number;
  totalCredit: number;
  createdBy: string;
}

export interface CashBook {
  date: Date;
  openingBalance: number;
  receipts: {
    description: string;
    amount: number;
  }[];
  payments: {
    description: string;
    amount: number;
  }[];
  totalReceipts: number;
  totalPayments: number;
  closingBalance: number;
}

export interface BankReconciliation {
  bankName: string;
  accountNumber: string;
  date: Date;
  bookBalance: number;
  bankBalance: number;
  outstandingDeposits: {
    date: Date;
    amount: number;
    description: string;
  }[];
  outstandingChecks: {
    checkNumber: string;
    date: Date;
    amount: number;
    payee: string;
  }[];
  reconciledBalance: number;
}

export interface TrialBalance {
  date: Date;
  accounts: {
    code: string;
    name: string;
    debit: number;
    credit: number;
  }[];
  totalDebit: number;
  totalCredit: number;
  difference: number;
}

export interface BalanceSheet {
  date: Date;
  assets: {
    current: { name: string; amount: number }[];
    fixed: { name: string; amount: number }[];
    totalCurrent: number;
    totalFixed: number;
    totalAssets: number;
  };
  liabilities: {
    current: { name: string; amount: number }[];
    longTerm: { name: string; amount: number }[];
    totalCurrent: number;
    totalLongTerm: number;
    totalLiabilities: number;
  };
  equity: {
    items: { name: string; amount: number }[];
    totalEquity: number;
  };
}

export interface ProfitAndLoss {
  startDate: Date;
  endDate: Date;
  revenue: {
    items: { name: string; amount: number }[];
    totalRevenue: number;
  };
  expenses: {
    items: { name: string; amount: number }[];
    totalExpenses: number;
  };
  grossProfit: number;
  netProfit: number;
}

export interface FinancialReport {
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cashFlow: number;
  assets: number;
  liabilities: number;
  equity: number;
}

export interface CashFlowReport {
  period: string;
  openingBalance: number;
  operating: {
    receipts: number;
    payments: number;
    net: number;
  };
  investing: {
    inflows: number;
    outflows: number;
    net: number;
  };
  financing: {
    inflows: number;
    outflows: number;
    net: number;
  };
  netCashFlow: number;
  closingBalance: number;
}

export interface RevenueReport {
  period: string;
  milkSales: number;
  productSales: number;
  otherIncome: number;
  totalRevenue: number;
  breakdown: {
    date: Date;
    source: string;
    amount: number;
  }[];
}
