import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Alumno } from '@models/alumno';
import { ApiResponse } from 'src/app/helpers/api.response';
import { ApiResponseWithMeta } from '../helpers/api-response-meta';
import { handleApiResponse } from '../helpers/extract-data-and-meta';

@Injectable({
  providedIn: 'root',
})
export class AlumnoService {
  constructor(private readonly http: HttpClient) {}

  private readonly URL_API: string = environment.url_backend_curso;
  private readonly URL_ENDPOINT_BASE_API: string = this.URL_API;

  async getAllAlumnos(
    page: number,
    size: number,
    anioEscolar?: number
  ): Promise<ApiResponseWithMeta<Alumno[]>>{
    let url = `${this.URL_ENDPOINT_BASE_API}/alumnos?page=${page}&size=${size}`;
    if (anioEscolar !== undefined && anioEscolar !== null) {
      url += `&anioEscolar=${anioEscolar}`;
    }
    return handleApiResponse(this.http.get<ApiResponse<Alumno[]>>(url));
  }

  async createAlumno(alumno: Alumno): Promise<ApiResponseWithMeta<Alumno>> {
    const url = `${this.URL_ENDPOINT_BASE_API}/alumnos`;
    return handleApiResponse(this.http.post<ApiResponse<Alumno>>(url, alumno));
  }

    async updateAlumno(id: number, alumno: Alumno): Promise<ApiResponseWithMeta<Alumno>> {
      const url = `${this.URL_ENDPOINT_BASE_API}/alumnos/${id}`;
      return handleApiResponse(this.http.put<ApiResponse<Alumno>>(url, alumno));
    }


  deleteAlumno(id: number): Promise<void> {
    return firstValueFrom(
      this.http
        .delete<ApiResponse<null>>(
          `${this.URL_ENDPOINT_BASE_API}/alumnos/${id}`
        )
        .pipe(map(() => null))
    );
  }

  getAlumnoById(id: number): Promise<Alumno> {
    return firstValueFrom(
      this.http
        .get<ApiResponse<Alumno>>(`${this.URL_ENDPOINT_BASE_API}/${id}`)
        .pipe(map((response) => response.data))
    );
  }

  hasDependencies(id: number): Promise<boolean> {
    return firstValueFrom(
      this.http
        .get<ApiResponse<boolean>>(
          `${this.URL_ENDPOINT_BASE_API}/alumnos/${id}/has-dependencies`
        )
        .pipe(map((response) => response.data))
    );
  }
}
