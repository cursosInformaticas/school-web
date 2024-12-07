import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "../../environments/environment";
import { ApiResponse } from "src/app/helpers/api.response";
import { Horario } from "@models/horario";
import { ApiResponseWithMeta } from "../helpers/api-response-meta";
import { handleApiResponse } from "../helpers/extract-data-and-meta";


@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  constructor(private readonly http: HttpClient) { }

  private readonly URL_API: string = environment.url_backend_curso;
  private readonly URL_ENDPOINT_BASE_API: string = this.URL_API;

  async getAllHorarios(
    page: number,
    size: number,
  ): Promise<ApiResponseWithMeta<Horario[]>>{
    let url = `${this.URL_ENDPOINT_BASE_API}/horarios?page=${page}&size=${size}`;
    return handleApiResponse(this.http.get<ApiResponse<Horario[]>>(url));
  }

  createHorario(horario: Horario): Promise<Horario> {
    return firstValueFrom(this.http.post<ApiResponse<Horario>>(`${this.URL_ENDPOINT_BASE_API}/horarios`, horario)
      .pipe(map(response => response.data)));
  }

  updateHorario(id: number, horario: Horario): Promise<Horario> {
    return firstValueFrom(this.http.put<ApiResponse<Horario>>(`${this.URL_ENDPOINT_BASE_API}/horarios/${id}`, horario)
      .pipe(map(response => response.data)));
  }

  deleteHorario(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<ApiResponse<null>>(`${this.URL_ENDPOINT_BASE_API}/horarios/${id}`)
      .pipe(map(() => null)));
  }

  getHorarioById(id: number): Promise<Horario> {
    return firstValueFrom(this.http.get<ApiResponse<Horario>>(`${this.URL_ENDPOINT_BASE_API}/${id}`)
      .pipe(map(response => response.data)));
  }


}
