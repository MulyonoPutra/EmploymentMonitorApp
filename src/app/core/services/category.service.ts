import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { Category } from 'src/app/modules/category/domain/entities/category';
import { CategoryDTO } from 'src/app/modules/category/domain/dto/category.dto';
import { HttpResponseEntity } from '../models/http-response-entity';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { handlerHttpError } from '../utils/http-handle-error';

@Injectable({
	providedIn: 'root',
})
export class CategoryService {
	env = 'http://localhost:3000/api/v1';
	constructor(private readonly http: HttpClient, private storageService: StorageService) {}

	findAll(): Observable<Category[]> {
		const token = this.storageService.getAccessToken();
		return this.http
			.get<HttpResponseEntity<Category[]>>(`${this.env}/category`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.pipe(map((response) => response.data));
	}

	findOne(id: string): Observable<Category> {
		return this.http.get<HttpResponseEntity<Category>>(`${this.env}/category/${id}`).pipe(
			map((response) => response.data),
			catchError((error: HttpErrorResponse) => handlerHttpError(error))
		);
	}

	create(body: CategoryDTO): Observable<Category> {
		return this.http.post<HttpResponseEntity<Category>>(`${this.env}/category`, body).pipe(
			map((response) => response.data),
			catchError((error: HttpErrorResponse) => handlerHttpError(error))
		);
	}

	update(id: string, body: CategoryDTO): Observable<string> {
		return this.http
			.patch<HttpResponseEntity<Category>>(`${this.env}/category/${id}`, body)
			.pipe(
				map((response) => response.message),
				catchError((error: HttpErrorResponse) => handlerHttpError(error))
			);
	}

	remove(id: string): Observable<string> {
		return this.http.delete<HttpResponseEntity<Category>>(`${this.env}/category/${id}`).pipe(
			map((response) => response.message),
			catchError((error: HttpErrorResponse) => handlerHttpError(error))
		);
	}
}
