import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import {
	HTTP_INTERCEPTORS,
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HttpStatusCode,
} from '@angular/common/http';

import { AuthenticationService } from '../services/authentication.service';
import { Credentials } from 'src/app/modules/auth/domain/entities/credentials';
import { HttpResponseEntity } from '../models/http-response-entity';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(
		private storageService: StorageService,
		private authService: AuthenticationService,
		private router: Router
	) {}

	private isRefreshing = false;
	private refreshTokenSubject: BehaviorSubject<unknown> = new BehaviorSubject<unknown>(null);

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const authPaths = ['/auth/refresh', '/auth/login', '/auth/register'];

		// It's an auth request, don't get a token
		if (authPaths.some((path) => request.url.toLowerCase().includes(path))) {
			return next.handle(request);
		}

		const token = this.storageService.getAccessToken();

		if (token) {
			request = this.addAuthHeader(request);
		}

		return next.handle(request).pipe(
			catchError((error) => {
				if (
					error instanceof HttpErrorResponse &&
					error.status === HttpStatusCode.Unauthorized
				) {
					return this.handle401Unauthorized(request, next);
				}
				const errors = error.error.message || error.statusText;
				return throwError(() => errors);
			})
		);
	}

	private addAuthHeader(request: HttpRequest<unknown>) {
		const accessToken = this.storageService.getAccessToken();
		return request.clone({
			setHeaders: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	}

	private handle401Unauthorized(request: HttpRequest<unknown>, next: HttpHandler) {
		if (!this.isRefreshing) {
			this.isRefreshing = true;
			this.refreshTokenSubject.next(null);

			const refreshToken = this.storageService.getRefreshToken();
			if (refreshToken) {
				return this.authService.generateRefreshToken(refreshToken).pipe(
					switchMap((newToken: HttpResponseEntity<Credentials>) => {
						console.log('Refreshing refresh token');
						this.isRefreshing = false;
						this.setCredentials(newToken);

						this.refreshTokenSubject.next(newToken.data.accessToken);
						request = this.addAuthHeader(request);

						return next.handle(request);
					}),
					catchError((error: HttpErrorResponse) => {
						this.isRefreshing = false;
						this.handleTokenExpired();
						return throwError(() => error.message);
					})
				);
			}
		}
		return this.refreshTokenSubject.pipe(
			filter((token) => token !== null),
			take(1),
			switchMap(() => {
				request = this.addAuthHeader(request);
				return next.handle(request);
			})
		);
	}

	private handleTokenExpired() {
		console.log('refresh token is expired, please login again.');
		alert('refresh token is expired, please login again.');

		this.storageService.clear();
		this.router.navigate(['/auth/sign-in']);
	}

	private setCredentials(newToken: HttpResponseEntity<Credentials>) {
		this.storageService.setAccessToken(newToken.data.accessToken);
		this.storageService.setRefreshToken(newToken.data.refreshToken);
	}
}

export const AuthInterceptorProvider = {
	provide: HTTP_INTERCEPTORS,
	useClass: AuthInterceptor,
	multi: true,
};
