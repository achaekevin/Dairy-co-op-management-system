import { z } from 'zod';

export const createQualityTestSchema = z.object({
  body: z.object({
    testNumber: z.string().min(1, 'Test number is required'),
    date: z.string().datetime('Invalid date format'),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),
    sampleType: z.enum(['INCOMING_MILK', 'PROCESSED_MILK', 'BUTTER', 'GHEE', 'PANEER', 'CURD']),
    batchNumber: z.string().optional(),
    farmerId: z.string().uuid('Invalid farmer ID').optional(),
    testedBy: z.string().min(1, 'Tester name is required'),
    fat: z.number().min(0).max(15, 'Fat must be between 0-15%'),
    snf: z.number().min(0).max(15, 'SNF must be between 0-15%'),
    protein: z.number().min(0).max(10, 'Protein must be between 0-10%'),
    lactose: z.number().min(0).max(10, 'Lactose must be between 0-10%'),
    temperature: z.number().min(0).max(100, 'Temperature must be between 0-100°C'),
    pH: z.number().min(0).max(14, 'pH must be between 0-14'),
    acidity: z.number().min(0).max(1, 'Acidity must be between 0-1%'),
    density: z.number().min(1).max(2, 'Density must be between 1-2 g/ml'),
    alcoholTest: z.enum(['PASS', 'FAIL']),
    cob: z.enum(['PASS', 'FAIL']),
    mbrt: z.number().int().min(0, 'MBRT must be positive'),
    coliformCount: z.number().int().min(0, 'Coliform count must be positive'),
    remarks: z.string().optional(),
  }),
});

export const updateQualityTestSchema = z.object({
  body: z.object({
    fat: z.number().min(0).max(15).optional(),
    snf: z.number().min(0).max(15).optional(),
    protein: z.number().min(0).max(10).optional(),
    lactose: z.number().min(0).max(10).optional(),
    temperature: z.number().min(0).max(100).optional(),
    pH: z.number().min(0).max(14).optional(),
    acidity: z.number().min(0).max(1).optional(),
    density: z.number().min(1).max(2).optional(),
    alcoholTest: z.enum(['PASS', 'FAIL']).optional(),
    cob: z.enum(['PASS', 'FAIL']).optional(),
    mbrt: z.number().int().min(0).optional(),
    coliformCount: z.number().int().min(0).optional(),
    overallResult: z.enum(['PASS', 'FAIL', 'RETEST']).optional(),
    remarks: z.string().optional(),
    status: z.enum(['PENDING', 'COMPLETED', 'APPROVED', 'REJECTED']).optional(),
    approvedBy: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid test ID'),
  }),
});

export const getQualityTestSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid test ID'),
  }),
});

export const deleteQualityTestSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid test ID'),
  }),
});

export const listQualityTestsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    search: z.string().optional(),
    farmerId: z.string().uuid().optional(),
    sampleType: z.enum(['INCOMING_MILK', 'PROCESSED_MILK', 'BUTTER', 'GHEE', 'PANEER', 'CURD']).optional(),
    status: z.enum(['PENDING', 'COMPLETED', 'APPROVED', 'REJECTED']).optional(),
    overallResult: z.enum(['PASS', 'FAIL', 'RETEST']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    testedBy: z.string().optional(),
  }),
});

export const approveTestSchema = z.object({
  body: z.object({
    approvedBy: z.string().min(1, 'Approver name is required'),
  }),
  params: z.object({
    id: z.string().uuid('Invalid test ID'),
  }),
});

export const getStatsSchema = z.object({
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});
