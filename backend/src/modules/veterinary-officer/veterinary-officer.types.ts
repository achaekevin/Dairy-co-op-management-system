export interface VeterinaryOfficerDashboardStats {
  animalsRegistered: number;
  vaccinationsDue: number;
  sickAnimals: number;
  pregnantCows: number;
  upcomingFarmVisits: number;
}

export interface AnimalRegistration {
  farmerId: string;
  tagNumber: string;
  name?: string;
  breed: string;
  category: 'COW' | 'BULL' | 'HEIFER' | 'CALF';
  dateOfBirth?: Date;
  gender: 'MALE' | 'FEMALE';
  weight?: number;
  color?: string;
  acquiredDate: Date;
  purchasePrice?: number;
  status: 'ACTIVE' | 'SICK' | 'PREGNANT' | 'SOLD' | 'DEAD';
}

export interface AnimalProfile {
  id: string;
  tagNumber: string;
  name?: string;
  farmerId: string;
  farmerName: string;
  breed: string;
  category: string;
  age: number;
  gender: string;
  weight?: number;
  status: string;
  healthStatus: 'HEALTHY' | 'SICK' | 'UNDER_TREATMENT';
  lastVaccination?: Date;
  lastCheckup?: Date;
  productionRecords: {
    date: Date;
    milkYield: number;
  }[];
}

export interface VaccinationRecord {
  animalId: string;
  tagNumber: string;
  vaccineName: string;
  vaccineType: string;
  administeredDate: Date;
  nextDueDate: Date;
  batchNumber?: string;
  administeredBy: string;
  reactions?: string;
  cost?: number;
}

export interface TreatmentRecord {
  animalId: string;
  tagNumber: string;
  disease: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  medication: string;
  dosage: string;
  startDate: Date;
  endDate?: Date;
  treatedBy: string;
  cost?: number;
  outcome?: 'RECOVERED' | 'UNDER_TREATMENT' | 'DIED';
}

export interface DiseaseReport {
  farmerId: string;
  farmerName: string;
  animalId: string;
  tagNumber: string;
  disease: string;
  reportedDate: Date;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  status: 'REPORTED' | 'UNDER_TREATMENT' | 'RESOLVED';
  isolationRequired: boolean;
}

export interface BreedingRecord {
  animalId: string;
  tagNumber: string;
  breedingMethod: 'NATURAL' | 'AI';
  breedingDate: Date;
  bullId?: string;
  semenSource?: string;
  technician?: string;
  expectedCalvingDate: Date;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
}

export interface PregnancyRecord {
  animalId: string;
  tagNumber: string;
  breedingDate: Date;
  confirmationDate: Date;
  expectedCalvingDate: Date;
  actualCalvingDate?: Date;
  pregnancyNumber: number;
  status: 'PREGNANT' | 'CALVED' | 'ABORTED';
  complications?: string;
}

export interface CalvingRecord {
  animalId: string;
  motherTag: string;
  calvingDate: Date;
  calfTagNumber: string;
  calfGender: 'MALE' | 'FEMALE';
  calfWeight?: number;
  calvingType: 'NORMAL' | 'ASSISTED' | 'CAESAREAN';
  complications?: string;
  motherCondition: 'GOOD' | 'FAIR' | 'POOR';
  attendedBy: string;
}

export interface FarmVisit {
  id: string;
  visitNumber: string;
  farmerId: string;
  farmerName: string;
  visitDate: Date;
  visitType: 'ROUTINE' | 'EMERGENCY' | 'VACCINATION' | 'TREATMENT' | 'BREEDING';
  purpose: string;
  animalsInspected: number;
  findings: string;
  recommendations: string;
  nextVisitDate?: Date;
  conductedBy: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface HealthReport {
  period: string;
  totalAnimals: number;
  healthyAnimals: number;
  sickAnimals: number;
  deadAnimals: number;
  vaccinationCoverage: number;
  commonDiseases: {
    disease: string;
    count: number;
  }[];
  treatmentSuccess: number;
}

export interface VaccinationReport {
  period: string;
  totalVaccinations: number;
  vaccineTypes: {
    vaccineName: string;
    count: number;
    cost: number;
  }[];
  coverage: number;
  upcomingDue: number;
  overdue: number;
}

export interface DiseaseStatistics {
  period: string;
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  diseaseBreakdown: {
    disease: string;
    cases: number;
    severity: {
      mild: number;
      moderate: number;
      severe: number;
      critical: number;
    };
    recoveryRate: number;
  }[];
  outbreaks: {
    disease: string;
    startDate: Date;
    affectedAnimals: number;
    status: string;
  }[];
}
