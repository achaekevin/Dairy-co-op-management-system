export interface CollectionOfficerDashboardStats {
  todaysCollections: number;
  farmersServed: number;
  totalLitresCollected: number;
  rejectedMilk: number;
  collectionTarget: number;
  targetProgress: number;
}

export interface FarmerVerification {
  farmerId: string;
  farmerCode: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  membershipStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  cattle: number;
  lastCollection?: {
    date: Date;
    quantity: number;
    quality: string;
  };
  outstandingBalance: number;
  canDeliver: boolean;
  message?: string;
}

export interface MilkCollectionInput {
  farmerId: string;
  date: Date;
  shift: 'MORNING' | 'EVENING';
  quantity: number;
  temperature: number;
  density?: number;
  fat: number;
  snf: number;
  waterTest?: 'PASS' | 'FAIL';
  centerId?: string;
  collectedBy: string;
}

export interface QualityAssessment {
  temperature: number;
  temperatureStatus: 'PASS' | 'FAIL';
  density?: number;
  fat: number;
  snf: number;
  waterTest?: 'PASS' | 'FAIL';
  overallQuality: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
  status: 'ACCEPTED' | 'REJECTED';
  reason?: string;
}

export interface CollectionReceipt {
  receiptNumber: string;
  date: Date;
  shift: 'MORNING' | 'EVENING';
  farmer: {
    farmerId: string;
    name: string;
    phoneNumber: string;
  };
  quantity: number;
  fat: number;
  snf: number;
  quality: string;
  rate: number;
  amount: number;
  centerId?: string;
  collectedBy: string;
  time: string;
}

export interface CollectionHistory {
  id: string;
  date: Date;
  shift: 'MORNING' | 'EVENING';
  farmerName: string;
  quantity: number;
  quality: string;
  amount: number;
  status: 'ACCEPTED' | 'REJECTED';
  reason?: string;
}

export interface DailyCollectionReport {
  date: Date;
  shift?: 'MORNING' | 'EVENING';
  totalCollections: number;
  totalFarmers: number;
  totalQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  qualityBreakdown: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
  totalAmount: number;
  collectionsByCenter: Array<{
    centerId: string;
    quantity: number;
    farmers: number;
  }>;
}

export interface FarmerCollectionHistory {
  farmerId: string;
  farmerName: string;
  totalCollections: number;
  totalQuantity: number;
  averageQuantity: number;
  averageQuality: string;
  totalAmount: number;
  lastCollection: Date;
  collections: Array<{
    date: Date;
    shift: string;
    quantity: number;
    quality: string;
    amount: number;
  }>;
}
