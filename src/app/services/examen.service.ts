import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "../../environments/environment";
import { ApiResponse } from "src/app/helpers/api.response";
import { Examen } from "@models/examen";
import { handleApiResponse } from "../helpers/extract-data-and-meta";
import { ApiResponseWithMeta } from "../helpers/api-response-meta";

@Injectable({
  providedIn: 'root'
})
export class ExamenService {

  constructor(private readonly http: HttpClient) { }

  private readonly URL_API: string = environment.url_backend_curso;
  private readonly URL_ENDPOINT_BASE_API: string = this.URL_API;

  async getAllExamens(
    page: number,
    size: number,
  ): Promise<ApiResponseWithMeta<Examen[]>>{
    let url = `${this.URL_ENDPOINT_BASE_API}/examenes?page=${page}&size=${size}`;
    return handleApiResponse(this.http.get<ApiResponse<Examen[]>>(url));
  }

  createExamen(examen: Examen): Promise<Examen> {
    return firstValueFrom(this.http.post<ApiResponse<Examen>>(`${this.URL_ENDPOINT_BASE_API}/examenes`, examen)
      .pipe(map(response => response.data)));
  }

  updateExamen(id: number, examen: Examen): Promise<Examen> {
    return firstValueFrom(this.http.put<ApiResponse<Examen>>(`${this.URL_ENDPOINT_BASE_API}/examenes/${id}`, examen)
      .pipe(map(response => response.data)));
  }

  deleteExamen(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<ApiResponse<null>>(`${this.URL_ENDPOINT_BASE_API}/examenes/${id}`)
      .pipe(map(() => null)));
  }

  getExamenById(id: number): Promise<Examen> {
    return firstValueFrom(this.http.get<ApiResponse<Examen>>(`${this.URL_ENDPOINT_BASE_API}/${id}`)
      .pipe(map(response => response.data)));
  }


}
