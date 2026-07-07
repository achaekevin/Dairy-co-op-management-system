export interface CreateFarmerData {
  farmerId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  village?: string;
  district?: string;
  pinCode?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  aadharNumber?: string;
  panNumber?: string;
  photo?: string;
  cattle?: number;
}

export interface UpdateFarmerData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  village?: string;
  district?: string;
  pinCode?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  aadharNumber?: string;
  panNumber?: string;
  photo?: string;
  cattle?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface FarmerFilters {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  village?: string;
  district?: string;
  minCattle?: number;
  maxCattle?: number;
  hasOutstandingLoan?: boolean;
}

export interface FarmerStats {
  totalFarmers: number;
  activeFarmers: number;
  inactiveFarmers: number;
  suspendedFarmers: number;
  totalCattle: number;
  avgCattlePerFarmer: number;
  totalOutstandingLoans: number;
  totalShares: number;
}

export interface FarmerResponse {
  id: string;
  farmerId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  status: string;
  cattle: number;
  totalShares: number;
  outstandingLoan: number;
  village?: string;
  joinDate: Date;
}
