import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

import { Credentials } from 'src/app/modules/auth/domain/entities/credentials';
import { HttpResponseEntity } from '../models/http-response-entity';
import { Injectable } from '@angular/core';
import { Login } from 'src/app/modules/auth/domain/entities/login';
import { Register } from 'src/app/modules/auth/domain/entities/register';
import { StorageService } from './storage.service';
import { handlerHttpError } from '../utils/http-handle-error';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  env = 'http://localhost:3000/api/v1';

  constructor(
    private readonly http: HttpClient,
    private readonly storageService: StorageService
  ) { }

  login(body: Login): Observable<HttpResponseEntity<Credentials>> {
    return this.http.post<HttpResponseEntity<Credentials>>(`${this.env}/auth/login`, body).pipe(
      map((response) => {
        this.storageService.setAccessToken(response.data.accessToken);
        this.storageService.setRefreshToken(response.data.refreshToken);
        return {
          message: response.message,
          data: {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          },
        };
      }),
      catchError((error: HttpErrorResponse) => handlerHttpError(error))
    );
  }

  register(body: Register): Observable<HttpResponseEntity<Credentials>> {
    return this.http.post<HttpResponseEntity<Credentials>>(`${this.env}/auth/register`, body);
  }

  registerAdmin(body: Register): Observable<HttpResponseEntity<Credentials>> {
    return this.http.post<HttpResponseEntity<Credentials>>(`${this.env}/auth/register-admin`, body);
  }

  logout(accessToken: string): Observable<any> {
    return this.http.post(`${this.env}/auth/logout`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).pipe(
      catchError((error: HttpErrorResponse) => handlerHttpError(error))
    );
  }

  generateRefreshToken(refreshToken: string): Observable<HttpResponseEntity<Credentials>> {
    // const refreshToken = this.storageService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => console.error('Refresh token not found!'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${refreshToken}`);
    return this.http.post<HttpResponseEntity<Credentials>>(`${this.env}/auth/refresh`, {}, { headers: headers });
  }

}
