export interface CreateMilkCollectionData {
  farmerId: string;
  date: Date;
  shift: 'MORNING' | 'EVENING';
  quantity: number;
  fat: number;
  snf: number;
  temperature?: number;
  collectedBy: string;
  centerId?: string;
}

export interface UpdateMilkCollectionData {
  quantity?: number;
  fat?: number;
  snf?: number;
  temperature?: number;
  quality?: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
  status?: 'ACCEPTED' | 'REJECTED';
  reason?: string;
}

export interface MilkCollectionFilters {
  search?: string;
  farmerId?: string;
  status?: 'ACCEPTED' | 'REJECTED';
  quality?: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
  shift?: 'MORNING' | 'EVENING';
  startDate?: Date;
  endDate?: Date;
  centerId?: string;
  collectedBy?: string;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface MilkCollectionStats {
  totalCollections: number;
  acceptedCollections: number;
  rejectedCollections: number;
  totalQuantity: number;
  totalAmount: number;
  avgQuantityPerCollection: number;
  avgFat: number;
  avgSnf: number;
  excellentQuality: number;
  goodQuality: number;
  averageQuality: number;
  poorQuality: number;
}

export interface DailyCollectionSummary {
  date: string;
  morningQuantity: number;
  eveningQuantity: number;
  totalQuantity: number;
  morningAmount: number;
  eveningAmount: number;
  totalAmount: number;
  totalCollections: number;
}

export interface FarmerCollectionSummary {
  farmerId: string;
  farmerName: string;
  totalQuantity: number;
  totalAmount: number;
  avgFat: number;
  avgSnf: number;
  collectionsCount: number;
}

export interface MilkCollectionResponse {
  id: string;
  farmerId: string;
  farmerName: string;
  date: Date;
  shift: string;
  quantity: number;
  fat: number;
  snf: number;
  temperature?: number;
  quality: string;
  status: string;
  reason?: string;
  amount: number;
  collectedBy: string;
  centerId?: string;
  createdAt: Date;
}
