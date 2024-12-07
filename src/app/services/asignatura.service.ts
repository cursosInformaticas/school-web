import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "../../environments/environment";
import { ApiResponse } from "src/app/helpers/api.response";
import { Asignatura } from "@models/asignatura";
import { handleApiResponse } from "../helpers/extract-data-and-meta";
import { ApiResponseWithMeta } from "../helpers/api-response-meta";

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  constructor(private readonly http: HttpClient) { }

  private readonly URL_API: string = environment.url_backend_curso;
  private readonly URL_ENDPOINT_BASE_API: string = this.URL_API;

  async getAllAsignaturas(
    page: number,
    size: number,
  ): Promise<ApiResponseWithMeta<Asignatura[]>>{
    let url = `${this.URL_ENDPOINT_BASE_API}/asignaturas?page=${page}&size=${size}`;
    return handleApiResponse(this.http.get<ApiResponse<Asignatura[]>>(url));
  }


  createAsignatura(alumno: Asignatura): Promise<Asignatura> {
    return firstValueFrom(this.http.post<ApiResponse<Asignatura>>(`${this.URL_ENDPOINT_BASE_API}/asignaturas`, alumno)
      .pipe(map(response => response.data)));
  }

  updateAsignatura(id: number, alumno: Asignatura): Promise<Asignatura> {
    return firstValueFrom(this.http.put<ApiResponse<Asignatura>>(`${this.URL_ENDPOINT_BASE_API}/asignaturas/${id}`, alumno)
      .pipe(map(response => response.data)));
  }

  deleteAsignatura(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<ApiResponse<null>>(`${this.URL_ENDPOINT_BASE_API}/asignaturas/${id}`)
      .pipe(map(() => null)));
  }

  getAsignaturaById(id: number): Promise<Asignatura> {
    return firstValueFrom(this.http.get<ApiResponse<Asignatura>>(`${this.URL_ENDPOINT_BASE_API}/${id}`)
      .pipe(map(response => response.data)));
  }


}
