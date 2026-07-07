import { z } from 'zod';

export const createMilkCollectionSchema = z.object({
  body: z.object({
    farmerId: z.string().uuid('Invalid farmer ID'),
    date: z.string().datetime('Invalid date format'),
    shift: z.enum(['MORNING', 'EVENING'], {
      errorMap: () => ({ message: 'Shift must be MORNING or EVENING' }),
    }),
    quantity: z.number().positive('Quantity must be positive').max(100, 'Quantity cannot exceed 100 liters'),
    fat: z.number().min(0, 'Fat cannot be negative').max(15, 'Fat percentage cannot exceed 15'),
    snf: z.number().min(0, 'SNF cannot be negative').max(15, 'SNF percentage cannot exceed 15'),
    temperature: z.number().min(0, 'Temperature cannot be negative').max(50, 'Temperature cannot exceed 50°C').optional(),
    collectedBy: z.string().min(1, 'Collector name is required'),
    centerId: z.string().optional(),
  }),
});

export const updateMilkCollectionSchema = z.object({
  body: z.object({
    quantity: z.number().positive('Quantity must be positive').max(100, 'Quantity cannot exceed 100 liters').optional(),
    fat: z.number().min(0, 'Fat cannot be negative').max(15, 'Fat percentage cannot exceed 15').optional(),
    snf: z.number().min(0, 'SNF cannot be negative').max(15, 'SNF percentage cannot exceed 15').optional(),
    temperature: z.number().min(0, 'Temperature cannot be negative').max(50, 'Temperature cannot exceed 50°C').optional(),
    quality: z.enum(['EXCELLENT', 'GOOD', 'AVERAGE', 'POOR']).optional(),
    status: z.enum(['ACCEPTED', 'REJECTED']).optional(),
    reason: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid collection ID'),
  }),
});

export const getMilkCollectionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid collection ID'),
  }),
});

export const deleteMilkCollectionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid collection ID'),
  }),
});

export const listMilkCollectionsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    farmerId: z.string().uuid().optional(),
    status: z.enum(['ACCEPTED', 'REJECTED']).optional(),
    quality: z.enum(['EXCELLENT', 'GOOD', 'AVERAGE', 'POOR']).optional(),
    shift: z.enum(['MORNING', 'EVENING']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    centerId: z.string().optional(),
    collectedBy: z.string().optional(),
    minQuantity: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
    maxQuantity: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  }),
});

export const getStatsSchema = z.object({
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

export const getDailySummarySchema = z.object({
  query: z.object({
    startDate: z.string().datetime('Start date is required'),
    endDate: z.string().datetime('End date is required'),
  }),
});

export const getFarmerSummarySchema = z.object({
  query: z.object({
    startDate: z.string().datetime('Start date is required'),
    endDate: z.string().datetime('End date is required'),
  }),
});
