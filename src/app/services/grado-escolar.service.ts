import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "../../environments/environment";
import { ApiResponse } from "src/app/helpers/api.response";
import { GradoEscolar } from "@models/grado-escolar-model";
import { ApiResponseWithMeta } from "../helpers/api-response-meta";
import { handleApiResponse } from "../helpers/extract-data-and-meta";



@Injectable({
  providedIn: 'root'
})
export class GaradoEscolarService {

  constructor(private readonly http: HttpClient) { }

  private readonly URL_API: string = environment.url_backend_curso;
  private readonly URL_ENDPOINT_BASE_API: string = this.URL_API;

  async getAllGradoEscolars(
    page: number,
    size: number,
  ): Promise<ApiResponseWithMeta<GradoEscolar[]>>{
    let url = `${this.URL_ENDPOINT_BASE_API}/grado-escolares?page=${page}&size=${size}`;
    return handleApiResponse(this.http.get<ApiResponse<GradoEscolar[]>>(url));
  }

  createGradoEscolar(aula: GradoEscolar): Promise<GradoEscolar> {
    return firstValueFrom(this.http.post<ApiResponse<GradoEscolar>>(`${this.URL_ENDPOINT_BASE_API}/grado-escolares`, aula)
      .pipe(map(response => response.data)));
  }

  updateGradoEscolar(id: number, aula: GradoEscolar): Promise<GradoEscolar> {
    return firstValueFrom(this.http.put<ApiResponse<GradoEscolar>>(`${this.URL_ENDPOINT_BASE_API}/grado-escolares/${id}`, aula)
      .pipe(map(response => response.data)));
  }

  deleteGradoEscolar(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<ApiResponse<null>>(`${this.URL_ENDPOINT_BASE_API}/grado-escolares/${id}`)
      .pipe(map(() => null)));
  }

  getGradoEscolarById(id: number): Promise<GradoEscolar> {
    return firstValueFrom(this.http.get<ApiResponse<GradoEscolar>>(`${this.URL_ENDPOINT_BASE_API}/${id}`)
      .pipe(map(response => response.data)));
  }
}
