export interface CreateCustomerData {
  customerId?: string;
  customerName: string;
  businessName?: string;
  customerType: 'RETAIL' | 'WHOLESALE' | 'DISTRIBUTOR' | 'INSTITUTION';
  phoneNumber: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pinCode?: string;
  gstNumber?: string;
  creditLimit?: number;
  creditDays?: number;
}

export interface UpdateCustomerData {
  customerName?: string;
  businessName?: string;
  customerType?: 'RETAIL' | 'WHOLESALE' | 'DISTRIBUTOR' | 'INSTITUTION';
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  gstNumber?: string;
  creditLimit?: number;
  creditDays?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  outstandingAmount?: number;
  totalSales?: number;
}

export interface CustomerFilters {
  search?: string;
  customerType?: 'RETAIL' | 'WHOLESALE' | 'DISTRIBUTOR' | 'INSTITUTION';
  status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  city?: string;
  hasOutstanding?: boolean;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  blockedCustomers: number;
  totalOutstanding: number;
  totalSales: number;
}
