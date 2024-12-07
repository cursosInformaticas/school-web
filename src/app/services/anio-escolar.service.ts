import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { AnioEscolar } from '@models/anio-escolar';
import { ApiResponse } from 'src/app/helpers/api.response';
import { handleApiResponse } from '../helpers/extract-data-and-meta';
import { ApiResponseWithMeta } from '../helpers/api-response-meta';

@Injectable({
  providedIn: 'root'
})
export class AnioEscolarService {

  constructor(private readonly http: HttpClient) { }

  private readonly URL_API: string = environment.url_backend_curso;
  private readonly URL_ENDPOINT_BASE_API: string = this.URL_API;

  async getAllAniosEscolares(): Promise<ApiResponseWithMeta<AnioEscolar[]>>{
    let url = `${this.URL_ENDPOINT_BASE_API}/anios-escolares`;
    return handleApiResponse(this.http.get<ApiResponse<AnioEscolar[]>>(url));
  }

}
