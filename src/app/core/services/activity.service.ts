import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { Activity } from 'src/app/modules/activity/domain/entities/activity';
import { CreateActivityDto } from 'src/app/modules/activity/domain/dto/create-activity.dto';
import { HttpResponseEntity } from '../models/http-response-entity';
import { Injectable } from '@angular/core';
import { JobType } from 'src/app/modules/activity/domain/entities/job-type';
import { Platform } from 'src/app/modules/activity/domain/entities/platform';
import { Status } from 'src/app/modules/activity/domain/entities/status';
import { StorageService } from './storage.service';
import { UpdateActivityDto } from 'src/app/modules/activity/domain/dto/update-activity.dto';
import { handlerHttpError } from '../utils/http-handle-error';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  env = 'http://localhost:3000/api/v1';
  constructor(
    private readonly http: HttpClient,
    private storageService: StorageService) { }

  findAll(): Observable<Activity[]> {
    return this.http
      .get<HttpResponseEntity<Activity[]>>(`${this.env}/activity`)
      .pipe(map((response) => response.data));
  }

  findJobTypes(): Observable<any> {
    return this.http.get<any>(`assets/data/job-type.json`).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => handlerHttpError(error))
    );;
  }

  findAppliedStatus(): Observable<any> {
    return this.http.get<any>(`assets/data/status.json`).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => handlerHttpError(error))
    );;
  }

  findPlatform(): Observable<any> {
    return this.http.get<any>(`assets/data/platform.json`).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => handlerHttpError(error))
    );
  }

  findOne(id: string): Observable<Activity> {
    const token = this.storageService.getAccessToken();
    return this.http.get<HttpResponseEntity<Activity>>(`${this.env}/activity/${id}`,  {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).pipe(
      map((response) => response.data),
      catchError((error: HttpErrorResponse) => handlerHttpError(error))
    );
  }

  create(body: CreateActivityDto): Observable<CreateActivityDto> {
    const token = this.storageService.getAccessToken();
    return this.http.post<HttpResponseEntity<CreateActivityDto>>(`${this.env}/activity`, body
      , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
  ).pipe(
      map((response) => response.data),
      catchError((error: HttpErrorResponse) => handlerHttpError(error))
    );
  }

  update(id: string, body: UpdateActivityDto): Observable<string> {
    return this.http
      .patch<HttpResponseEntity<UpdateActivityDto>>(`${this.env}/activity/${id}`, body)
      .pipe(
        map((response) => response.message),
        catchError((error: HttpErrorResponse) => handlerHttpError(error))
      );
  }

  remove(id: string): Observable<string> {
    return this.http.delete<HttpResponseEntity<Activity>>(`${this.env}/activity/${id}`).pipe(
      map((response) => response.message),
      catchError((error: HttpErrorResponse) => handlerHttpError(error))
    );
  }

}
