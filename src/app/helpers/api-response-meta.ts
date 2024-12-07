export interface ApiResponseWithMeta<T> {
    data: T;
    meta: {
      totalRecords: number;
      status: string;
      message: string;
      timestamp: string;
    };
  }
  