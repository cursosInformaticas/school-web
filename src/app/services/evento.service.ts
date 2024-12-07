import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "../../environments/environment";
import { ApiResponse } from "src/app/helpers/api.response";
import { Evento } from "@models/evento-model";
import { handleApiResponse } from "../helpers/extract-data-and-meta";
import { ApiResponseWithMeta } from "../helpers/api-response-meta";

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  constructor(private readonly http: HttpClient) { }

  private readonly URL_API: string = environment.url_backend_curso;
  private readonly URL_ENDPOINT_BASE_API: string = this.URL_API;

  async getAllEventos(
    page: number,
    size: number,
  ): Promise<ApiResponseWithMeta<Evento[]>>{
    let url = `${this.URL_ENDPOINT_BASE_API}/evento-escolares?page=${page}&size=${size}`;
    return handleApiResponse(this.http.get<ApiResponse<Evento[]>>(url));
  }

  createEvento(curso: Evento): Promise<Evento> {
    return firstValueFrom(this.http.post<ApiResponse<Evento>>(`${this.URL_ENDPOINT_BASE_API}/evento-escolares`, curso)
      .pipe(map(response => response.data)));
  }

  updateEvento(id: number, curso: Evento): Promise<Evento> {
    return firstValueFrom(this.http.put<ApiResponse<Evento>>(`${this.URL_ENDPOINT_BASE_API}/evento-escolares/${id}`, curso)
      .pipe(map(response => response.data)));
  }

  deleteEvento(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<ApiResponse<null>>(`${this.URL_ENDPOINT_BASE_API}/evento-escolares/${id}`)
      .pipe(map(() => null)));
  }

  getEventoById(id: number): Promise<Evento> {
    return firstValueFrom(this.http.get<ApiResponse<Evento>>(`${this.URL_ENDPOINT_BASE_API}/${id}`)
      .pipe(map(response => response.data)));
  }
}
