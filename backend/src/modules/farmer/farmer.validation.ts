import { z } from 'zod';

export const createFarmerSchema = z.object({
  body: z.object({
    farmerId: z.string().min(1, 'Farmer ID is required'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number'),
    email: z.string().email('Invalid email').optional(),
    dateOfBirth: z.string().datetime().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    address: z.string().optional(),
    village: z.string().optional(),
    district: z.string().optional(),
    pinCode: z.string().regex(/^[0-9]{6}$/, 'Invalid PIN code').optional(),
    gpsLatitude: z.number().min(-90).max(90).optional(),
    gpsLongitude: z.number().min(-180).max(180).optional(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code').optional(),
    aadharNumber: z.string().regex(/^[0-9]{12}$/, 'Invalid Aadhar number').optional(),
    panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number').optional(),
    photo: z.string().url('Invalid photo URL').optional(),
    cattle: z.number().int().min(0).optional(),
  }),
});

export const updateFarmerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
    phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number').optional(),
    email: z.string().email('Invalid email').optional(),
    dateOfBirth: z.string().datetime().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    address: z.string().optional(),
    village: z.string().optional(),
    district: z.string().optional(),
    pinCode: z.string().regex(/^[0-9]{6}$/, 'Invalid PIN code').optional(),
    gpsLatitude: z.number().min(-90).max(90).optional(),
    gpsLongitude: z.number().min(-180).max(180).optional(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code').optional(),
    aadharNumber: z.string().regex(/^[0-9]{12}$/, 'Invalid Aadhar number').optional(),
    panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number').optional(),
    photo: z.string().url('Invalid photo URL').optional(),
    cattle: z.number().int().min(0).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid farmer ID'),
  }),
});

export const getFarmerSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid farmer ID'),
  }),
});

export const deleteFarmerSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid farmer ID'),
  }),
});

export const listFarmersSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    search: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
    village: z.string().optional(),
    district: z.string().optional(),
    minCattle: z.string().regex(/^\d+$/).transform(Number).optional(),
    maxCattle: z.string().regex(/^\d+$/).transform(Number).optional(),
    hasOutstandingLoan: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  }),
});
