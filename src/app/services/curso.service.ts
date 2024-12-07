import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "../../environments/environment";
import { ApiResponse } from "src/app/helpers/api.response";
import { Curso } from "@models/curso-model";
import { handleApiResponse } from "../helpers/extract-data-and-meta";
import { ApiResponseWithMeta } from "../helpers/api-response-meta";

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  constructor(private readonly http: HttpClient) { }

  private readonly URL_API: string = environment.url_backend_curso;
  private readonly URL_ENDPOINT_BASE_API: string = this.URL_API;

  async getAllCursos(
    page: number,
    size: number,
  ): Promise<ApiResponseWithMeta<Curso[]>>{
    let url = `${this.URL_ENDPOINT_BASE_API}/cursos?page=${page}&size=${size}`;
    return handleApiResponse(this.http.get<ApiResponse<Curso[]>>(url));
  }

  createCurso(curso: Curso): Promise<Curso> {
    return firstValueFrom(this.http.post<ApiResponse<Curso>>(`${this.URL_ENDPOINT_BASE_API}/cursos`, curso)
      .pipe(map(response => response.data)));
  }

  updateCurso(id: number, curso: Curso): Promise<Curso> {
    return firstValueFrom(this.http.put<ApiResponse<Curso>>(`${this.URL_ENDPOINT_BASE_API}/cursos/${id}`, curso)
      .pipe(map(response => response.data)));
  }

  deleteCurso(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<ApiResponse<null>>(`${this.URL_ENDPOINT_BASE_API}/cursos/${id}`)
      .pipe(map(() => null)));
  }

  getCursoById(id: number): Promise<Curso> {
    return firstValueFrom(this.http.get<ApiResponse<Curso>>(`${this.URL_ENDPOINT_BASE_API}/${id}`)
      .pipe(map(response => response.data)));
  }
}
