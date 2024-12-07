import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "../../environments/environment";
import { ApiResponse } from "src/app/helpers/api.response";
import { Maestro } from "@models/maestro-model";
import { ApiResponseWithMeta } from "../helpers/api-response-meta";
import { handleApiResponse } from "../helpers/extract-data-and-meta";


@Injectable({
  providedIn: 'root'
})
export class MaestroService {

  constructor(private readonly http: HttpClient) { }

  private readonly URL_API: string = environment.url_backend_curso;
  private readonly URL_ENDPOINT_BASE_API: string = this.URL_API;

  async getAllMaestros(
    page: number,
    size: number,
  ): Promise<ApiResponseWithMeta<Maestro[]>>{
    let url = `${this.URL_ENDPOINT_BASE_API}/maestros?page=${page}&size=${size}`;
    return handleApiResponse(this.http.get<ApiResponse<Maestro[]>>(url));
  }

  createMaestro(maestro: Maestro): Promise<Maestro> {
    return firstValueFrom(this.http.post<ApiResponse<Maestro>>(`${this.URL_ENDPOINT_BASE_API}/maestros`, maestro)
      .pipe(map(response => response.data)));
  }

  updateMaestro(id: number, maestro: Maestro): Promise<Maestro> {
    return firstValueFrom(this.http.put<ApiResponse<Maestro>>(`${this.URL_ENDPOINT_BASE_API}/maestros/${id}`, maestro)
      .pipe(map(response => response.data)));
  }

  deleteMaestro(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<ApiResponse<null>>(`${this.URL_ENDPOINT_BASE_API}/maestros/${id}`)
      .pipe(map(() => null)));
  }

  getMaestroById(id: number): Promise<Maestro> {
    return firstValueFrom(this.http.get<ApiResponse<Maestro>>(`${this.URL_ENDPOINT_BASE_API}/${id}`)
      .pipe(map(response => response.data)));
  }
}
