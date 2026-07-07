export interface CreateVehicleData {
  vehicleNumber: string;
  vehicleType: 'MILK_TANKER' | 'DELIVERY_VAN' | 'TRUCK' | 'CAR' | 'BIKE';
  brand: string;
  model: string;
  capacity?: number;
  fuelType: 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC';
  purchaseDate: Date;
  insuranceExpiry: Date;
  fitnessExpiry: Date;
  lastService?: Date;
  nextService: Date;
  currentMileage?: number;
  driverName?: string;
}

export interface UpdateVehicleData {
  vehicleType?: 'MILK_TANKER' | 'DELIVERY_VAN' | 'TRUCK' | 'CAR' | 'BIKE';
  brand?: string;
  model?: string;
  capacity?: number;
  fuelType?: 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC';
  insuranceExpiry?: Date;
  fitnessExpiry?: Date;
  lastService?: Date;
  nextService?: Date;
  currentMileage?: number;
  driverName?: string;
  status?: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
}

export interface VehicleFilters {
  search?: string;
  vehicleType?: 'MILK_TANKER' | 'DELIVERY_VAN' | 'TRUCK' | 'CAR' | 'BIKE';
  status?: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  fuelType?: 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC';
}

export interface VehicleStats {
  totalVehicles: number;
  activeVehicles: number;
  maintenanceVehicles: number;
  inactiveVehicles: number;
  expiringSoonInsurance: number;
  expiringSoonFitness: number;
}
