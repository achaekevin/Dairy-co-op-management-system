export interface CreateShareData {
  shareNumber: string;
  farmerId: string;
  shareCount: number;
  shareValue: number;
  certificateNumber?: string;
}

export interface UpdateShareData {
  shareCount?: number;
  shareValue?: number;
  status?: 'ACTIVE' | 'TRANSFERRED' | 'REDEEMED';
  certificateNumber?: string;
  transferredTo?: string;
  transferDate?: Date;
  redemptionDate?: Date;
}

export interface ShareFilters {
  farmerId?: string;
  status?: 'ACTIVE' | 'TRANSFERRED' | 'REDEEMED';
  minShares?: number;
  maxShares?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface ShareStats {
  totalShares: number;
  activeShares: number;
  transferredShares: number;
  redeemedShares: number;
  totalShareCount: number;
  totalShareValue: number;
  totalFarmersWithShares: number;
}
