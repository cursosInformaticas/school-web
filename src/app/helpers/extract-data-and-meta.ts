import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from 'src/app/helpers/api.response';
import { ApiResponseWithMeta } from './api-response-meta';

export function handleApiResponse<T>(observable: Observable<ApiResponse<T>>): Promise<ApiResponseWithMeta<T>> {
  return firstValueFrom(
    observable.pipe(
      map((response) => ({
        data: response.data,
        meta: {
          totalRecords: response.meta.totalRecords || 0,
          status: response.meta.status,
          message: response.meta.message,
          timestamp: response.meta.timestamp,
        },
      }))
    )
  );
}
