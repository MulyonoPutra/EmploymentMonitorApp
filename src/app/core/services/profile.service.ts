import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { CreateEducationDto } from 'src/app/modules/profile/pages/dto/create-education.dto';
import { CreateExperienceDto } from 'src/app/modules/profile/pages/dto/create-experience.dto';
import { Education } from 'src/app/modules/profile/domain/entities/education';
import { Experience } from 'src/app/modules/profile/domain/entities/experience';
import { HttpResponseEntity } from '../models/http-response-entity';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { UpdateEducationDto } from 'src/app/modules/profile/pages/dto/update-education.dto';
import { UpdateExperienceDto } from 'src/app/modules/profile/pages/dto/update-experience.dto';
import { UpdateUserDto } from 'src/app/modules/profile/domain/dto/update-user.dto';
import { User } from 'src/app/modules/profile/domain/entities/user';
import { handlerHttpError } from '../utils/http-handle-error';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  env = 'http://localhost:3000/api/v1';
  constructor(
    private readonly http: HttpClient,
    private storageService: StorageService) { }

  findUserDetail(): Observable<User> {
    const token = this.storageService.getAccessToken();
    return this.http.get<HttpResponseEntity<User>>(`${this.env}/profile/detail`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).pipe(
      map((response) => response.data),
      catchError((error: HttpErrorResponse) => handlerHttpError(error))
    );
  }

  updateProfile(userId: string, body: UpdateUserDto): Observable<UpdateUserDto> {
    return this.http
      .patch<HttpResponseEntity<UpdateUserDto>>(`${this.env}/user/${userId}`, body)
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => handlerHttpError(error))
      );
  }

  newEducation(body: CreateEducationDto[]): Observable<CreateEducationDto> {
    return this.http
      .post<HttpResponseEntity<CreateEducationDto>>(`${this.env}/profile/education`, body)
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => handlerHttpError(error))
      );
  }

  updateEducation(educationId: string, body: UpdateEducationDto): Observable<UpdateEducationDto> {
    return this.http
      .patch<HttpResponseEntity<UpdateEducationDto>>(
        `${this.env}/profile/education/${educationId}`,
        body
      )
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => handlerHttpError(error))
      );
  }

  findEducation(id: string): Observable<Education> {
    return this.http
      .get<HttpResponseEntity<Education>>(`${this.env}/profile/education/${id}`)
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => handlerHttpError(error))
      );
  }

  removeEducation(id: string): Observable<string> {
    return this.http
      .delete<HttpResponseEntity<Education>>(`${this.env}/profile/education/${id}`)
      .pipe(
        map((response) => response.message),
        catchError((error: HttpErrorResponse) => handlerHttpError(error))
      );
  }

  newExperience(body: CreateExperienceDto[]): Observable<string> {
    const token = this.storageService.getAccessToken();
    return this.http
      .post<any>(`${this.env}/profile/experience`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(catchError((error: HttpErrorResponse) => handlerHttpError(error)));
  }

  updateExperience(experienceId: string, body: UpdateExperienceDto): Observable<string> {
    return this.http
      .patch<HttpResponseEntity<UpdateExperienceDto>>(
        `${this.env}/profile/experience/${experienceId}`,
        body
      )
      .pipe(
        map((response) => response.message),
        catchError((error: HttpErrorResponse) => handlerHttpError(error))
      );
  }

  findExperience(id: string): Observable<Experience> {
    return this.http
      .get<HttpResponseEntity<Experience>>(`${this.env}/profile/experience/${id}`)
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => handlerHttpError(error))
      );
  }

  removeExperience(id: string): Observable<string> {
    return this.http
      .delete<HttpResponseEntity<Experience>>(`${this.env}/profile/experience/${id}`)
      .pipe(
        map((response) => response.message),
        catchError((error: HttpErrorResponse) => handlerHttpError(error))
      );
  }

}
