export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult {
  skip: number;
  take: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
}

export const getPaginationParams = (params: PaginationParams): PaginationResult => {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 20));
  const skip = (page - 1) * limit;

  const result: PaginationResult = {
    skip,
    take: limit,
  };

  if (params.sortBy) {
    result.orderBy = {
      [params.sortBy]: params.sortOrder || 'desc',
    };
  } else {
    result.orderBy = {
      createdAt: 'desc',
    };
  }

  return result;
};

export const calculatePagination = (total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};
