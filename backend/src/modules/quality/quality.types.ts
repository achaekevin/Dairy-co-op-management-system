export interface CreateQualityTestData {
  testNumber: string;
  date: Date;
  time: string;
  sampleType: 'INCOMING_MILK' | 'PROCESSED_MILK' | 'BUTTER' | 'GHEE' | 'PANEER' | 'CURD';
  batchNumber?: string;
  farmerId?: string;
  testedBy: string;
  fat: number;
  snf: number;
  protein: number;
  lactose: number;
  temperature: number;
  pH: number;
  acidity: number;
  density: number;
  alcoholTest: 'PASS' | 'FAIL';
  cob: 'PASS' | 'FAIL';
  mbrt: number;
  coliformCount: number;
  remarks?: string;
}

export interface UpdateQualityTestData {
  fat?: number;
  snf?: number;
  protein?: number;
  lactose?: number;
  temperature?: number;
  pH?: number;
  acidity?: number;
  density?: number;
  alcoholTest?: 'PASS' | 'FAIL';
  cob?: 'PASS' | 'FAIL';
  mbrt?: number;
  coliformCount?: number;
  overallResult?: 'PASS' | 'FAIL' | 'RETEST';
  remarks?: string;
  status?: 'PENDING' | 'COMPLETED' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
}

export interface QualityTestFilters {
  search?: string;
  farmerId?: string;
  sampleType?: 'INCOMING_MILK' | 'PROCESSED_MILK' | 'BUTTER' | 'GHEE' | 'PANEER' | 'CURD';
  status?: 'PENDING' | 'COMPLETED' | 'APPROVED' | 'REJECTED';
  overallResult?: 'PASS' | 'FAIL' | 'RETEST';
  startDate?: Date;
  endDate?: Date;
  testedBy?: string;
}

export interface QualityTestStats {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  retestRequired: number;
  pendingTests: number;
  completedTests: number;
  approvedTests: number;
  rejectedTests: number;
  avgFat: number;
  avgSnf: number;
  avgProtein: number;
  avgPH: number;
  passRate: number;
}

export interface QualityTestResponse {
  id: string;
  testNumber: string;
  date: Date;
  time: string;
  sampleType: string;
  batchNumber?: string;
  farmerId?: string;
  farmerName?: string;
  testedBy: string;
  fat: number;
  snf: number;
  protein: number;
  lactose: number;
  temperature: number;
  pH: number;
  acidity: number;
  density: number;
  alcoholTest: string;
  cob: string;
  mbrt: number;
  coliformCount: number;
  overallResult: string;
  status: string;
  remarks?: string;
  approvedBy?: string;
  approvedDate?: Date;
  createdAt: Date;
}
