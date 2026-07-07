export interface CreateSupplierData {
  supplierCode: string;
  name: string;
  category: string;
  contactPerson: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  gstNumber?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  creditLimit?: number;
  creditDays?: number;
}

export interface UpdateSupplierData {
  name?: string;
  category?: string;
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  gstNumber?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  creditLimit?: number;
  creditDays?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  rating?: number;
  outstandingAmount?: number;
  totalPurchases?: number;
}

export interface SupplierFilters {
  search?: string;
  category?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  city?: string;
  minRating?: number;
}

export interface SupplierStats {
  totalSuppliers: number;
  activeSuppliers: number;
  inactiveSuppliers: number;
  blockedSuppliers: number;
  totalOutstanding: number;
  totalPurchases: number;
}
