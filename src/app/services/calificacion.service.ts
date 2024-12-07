import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "../../environments/environment";
import { ApiResponse } from "src/app/helpers/api.response";
import { Calificacion } from "@models/calificacion";
import { handleApiResponse } from "../helpers/extract-data-and-meta";
import { ApiResponseWithMeta } from "../helpers/api-response-meta";



@Injectable({
  providedIn: 'root'
})
export class CalificacionService {

  constructor(private readonly http: HttpClient) { }

  private readonly URL_API: string = environment.url_backend_curso;
  private readonly URL_ENDPOINT_BASE_API: string = this.URL_API;

  async getAllCalificaciones(
    page: number,
    size: number,
  ): Promise<ApiResponseWithMeta<Calificacion[]>>{
    let url = `${this.URL_ENDPOINT_BASE_API}/calificaciones?page=${page}&size=${size}`;
    return handleApiResponse(this.http.get<ApiResponse<Calificacion[]>>(url));
  }


  createCalificacion(calificacion: Calificacion): Promise<Calificacion> {
    return firstValueFrom(this.http.post<ApiResponse<Calificacion>>(`${this.URL_ENDPOINT_BASE_API}/calificaciones`, calificacion)
      .pipe(map(response => response.data)));
  }

  updateCalificacion(id: number, calificacion: Calificacion): Promise<Calificacion> {
    return firstValueFrom(this.http.put<ApiResponse<Calificacion>>(`${this.URL_ENDPOINT_BASE_API}/calificaciones/${id}`, calificacion)
      .pipe(map(response => response.data)));
  }

  deleteCalificacion(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<ApiResponse<null>>(`${this.URL_ENDPOINT_BASE_API}/calificaciones/${id}`)
      .pipe(map(() => null)));
  }

  getCalificacionById(id: number): Promise<Calificacion> {
    return firstValueFrom(this.http.get<ApiResponse<Calificacion>>(`${this.URL_ENDPOINT_BASE_API}/${id}`)
      .pipe(map(response => response.data)));
  }


}
