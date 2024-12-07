import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {
   /* if (this.isBrowser()) {
      window.addEventListener('beforeunload', this.clearLocalStorageOnClose.bind(this));
    }*/
  }

  private readonly URL_API: string = environment.url_backend_curso;
  private readonly URL_ENDPOINT_BASE_API: string = this.URL_API;
  
/*  private clearLocalStorageOnClose(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }*/
  
  login(username: string, password: string): Observable<any> {
    const url = `${this.URL_ENDPOINT_BASE_API}/auth/login`;
    return this.http.post(url, { username, password });
  }

  saveToken(accessToken: string, refreshToken: string): void {
    if (this.isBrowser()) {
      sessionStorage.setItem('access_token', accessToken);
      sessionStorage.setItem('refresh_token', refreshToken);
    }
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return sessionStorage.getItem('access_token');
    }
    return null;
  }
  getRefreshToken(): string | null {
    if (this.isBrowser()) {
      return sessionStorage.getItem('refresh_token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      // Decodificar el token y verificar su expiración
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      return decodedToken.exp > currentTime; // Comparar tiempo de expiración con el actual
    } catch (error) {
      // Si hay un error al decodificar, consideramos que no está autenticado
      console.error('Error al decodificar el token:', error);
      return false;
    }
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    this.router.navigate(['/login']);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  getTokenExpirationTime(): number | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.exp; 
    }
    return null;
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      throw new Error('No refresh token available.');
    }

    const url = `${this.URL_ENDPOINT_BASE_API}/auth/refresh?refresh_token=${refreshToken}`;
    return this.http.put(url, {});
  }
}
