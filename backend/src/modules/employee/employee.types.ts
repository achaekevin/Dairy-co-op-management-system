export interface CreateEmployeeData {
  employeeId: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  phoneNumber: string;
  email?: string;
  dateOfBirth?: Date;
  dateOfJoining: Date;
  salary: number;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  aadharNumber?: string;
  panNumber?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  photo?: string;
}

export interface UpdateEmployeeData {
  firstName?: string;
  lastName?: string;
  designation?: string;
  department?: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: Date;
  salary?: number;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  aadharNumber?: string;
  panNumber?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  photo?: string;
  status?: 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED' | 'TERMINATED';
}

export interface EmployeeFilters {
  search?: string;
  department?: string;
  designation?: string;
  status?: 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED' | 'TERMINATED';
  city?: string;
}

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  resignedEmployees: number;
  terminatedEmployees: number;
  totalSalary: number;
}
