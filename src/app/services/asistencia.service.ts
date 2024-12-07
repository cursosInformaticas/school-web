import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "../../environments/environment";
import { ApiResponse } from "src/app/helpers/api.response";
import { Asistencia } from "@models/asistencia";
import { ApiResponseWithMeta } from "../helpers/api-response-meta";
import { handleApiResponse } from "../helpers/extract-data-and-meta";


@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  constructor(private readonly http: HttpClient) { }

  private readonly URL_API: string = environment.url_backend_curso;
  private readonly URL_ENDPOINT_BASE_API: string = this.URL_API;

  async getAllAsistencias(
    page: number,
    size: number,
  ): Promise<ApiResponseWithMeta<Asistencia[]>>{
    let url = `${this.URL_ENDPOINT_BASE_API}/asistencias?page=${page}&size=${size}`;
    return handleApiResponse(this.http.get<ApiResponse<Asistencia[]>>(url));
  }

  createAsistencia(asistencia: Asistencia): Promise<Asistencia> {
    return firstValueFrom(this.http.post<ApiResponse<Asistencia>>(`${this.URL_ENDPOINT_BASE_API}/asistencias`, asistencia)
      .pipe(map(response => response.data)));
  }

  updateAsistencia(id: number, asistencia: Asistencia): Promise<Asistencia> {
    return firstValueFrom(this.http.put<ApiResponse<Asistencia>>(`${this.URL_ENDPOINT_BASE_API}/asistencias/${id}`, asistencia)
      .pipe(map(response => response.data)));
  }

  deleteAsistencia(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<ApiResponse<null>>(`${this.URL_ENDPOINT_BASE_API}/asistencias/${id}`)
      .pipe(map(() => null)));
  }

  getAsistenciaById(id: number): Promise<Asistencia> {
    return firstValueFrom(this.http.get<ApiResponse<Asistencia>>(`${this.URL_ENDPOINT_BASE_API}/${id}`)
      .pipe(map(response => response.data)));
  }


}
