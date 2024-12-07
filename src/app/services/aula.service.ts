import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "../../environments/environment";
import { ApiResponse } from "src/app/helpers/api.response";
import { Aula } from "@models/aula-model";
import { ApiResponseWithMeta } from "../helpers/api-response-meta";
import { handleApiResponse } from "../helpers/extract-data-and-meta";


@Injectable({
  providedIn: 'root'
})
export class AulaService {

  constructor(private readonly http: HttpClient) { }

  private readonly URL_API: string = environment.url_backend_curso;
  private readonly URL_ENDPOINT_BASE_API: string = this.URL_API;

  async getAllAulas(
    page: number,
    size: number,
  ): Promise<ApiResponseWithMeta<Aula[]>>{
    let url = `${this.URL_ENDPOINT_BASE_API}/aulas?page=${page}&size=${size}`;
    return handleApiResponse(this.http.get<ApiResponse<Aula[]>>(url));
  }


  createAula(aula: Aula): Promise<Aula> {
    return firstValueFrom(this.http.post<ApiResponse<Aula>>(`${this.URL_ENDPOINT_BASE_API}/aulas`, aula)
      .pipe(map(response => response.data)));
  }

  updateAula(id: number, aula: Aula): Promise<Aula> {
    return firstValueFrom(this.http.put<ApiResponse<Aula>>(`${this.URL_ENDPOINT_BASE_API}/aulas/${id}`, aula)
      .pipe(map(response => response.data)));
  }

  deleteAula(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<ApiResponse<null>>(`${this.URL_ENDPOINT_BASE_API}/aulas/${id}`)
      .pipe(map(() => null)));
  }

  getAulaById(id: number): Promise<Aula> {
    return firstValueFrom(this.http.get<ApiResponse<Aula>>(`${this.URL_ENDPOINT_BASE_API}/${id}`)
      .pipe(map(response => response.data)));
  }
}
