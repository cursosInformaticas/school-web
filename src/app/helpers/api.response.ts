export interface ApiResponse<T> {
  meta: {
    status: string;
    message: string;
    timestamp: string;
    totalRecords?: number;
  };
  data: T;
}
