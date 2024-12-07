import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "../../environments/environment";
import { ApiResponse } from "src/app/helpers/api.response";
import { Tutor } from "@models/tutor";
import { ApiResponseWithMeta } from "../helpers/api-response-meta";
import { handleApiResponse } from "../helpers/extract-data-and-meta";

@Injectable({
  providedIn: 'root'
})
export class TutorService {

  constructor(private readonly http: HttpClient) { }

  private readonly URL_API: string = environment.url_backend_curso;
  private readonly URL_ENDPOINT_BASE_API: string = this.URL_API;

  async getAllTutoresSelected(): Promise<Tutor[]> {
    return firstValueFrom(this.http.get<ApiResponse<Tutor[]>>(`${this.URL_ENDPOINT_BASE_API}/tutores`)
      .pipe(map(response => response.data)));
  }

  async getAllTutores(
    page: number,
    size: number,
  ): Promise<ApiResponseWithMeta<Tutor[]>>{
    let url = `${this.URL_ENDPOINT_BASE_API}/tutores?page=${page}&size=${size}`;
    return handleApiResponse(this.http.get<ApiResponse<Tutor[]>>(url));
  }

  createTutor(tutor: Tutor): Promise<Tutor> {
    return firstValueFrom(this.http.post<ApiResponse<Tutor>>(`${this.URL_ENDPOINT_BASE_API}/tutores`, tutor)
      .pipe(map(response => response.data)));
  }

  updateTutor(id: number, tutor: Tutor): Promise<Tutor> {
    return firstValueFrom(this.http.put<ApiResponse<Tutor>>(`${this.URL_ENDPOINT_BASE_API}/tutores/${id}`, tutor)
      .pipe(map(response => response.data)));
  }

  deleteTutor(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<ApiResponse<null>>(`${this.URL_ENDPOINT_BASE_API}/tutores/${id}`)
      .pipe(map(() => null)));
  }

  getTutorById(id: number): Promise<Tutor> {
    return firstValueFrom(this.http.get<ApiResponse<Tutor>>(`${this.URL_ENDPOINT_BASE_API}/${id}`)
      .pipe(map(response => response.data)));
  }
}
