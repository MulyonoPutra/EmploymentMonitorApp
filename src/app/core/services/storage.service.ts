import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';

export enum AuthKey {
	AccessToken = 'ACCESS_TOKEN',
	RefreshToken = 'REFRESH_TOKEN',
	Role = 'ROLE',
	UserId = 'AuthKey.UserId',
	Username = 'USERNAME',
}

@Injectable({
	providedIn: 'root',
})
export class StorageService {
	private token!: string | null;
	private role!: string | null;
	private accessToken: string | null = null;
	private refreshToken: string | null = null;
	constructor(private cookieService: CookieService) {}

	public setAccessToken(token: string): void {
		sessionStorage.removeItem(AuthKey.AccessToken);
		if (token) {
			sessionStorage.setItem(AuthKey.AccessToken, token);
		}
	}

	public getAccessToken(): string {
		return sessionStorage.getItem(AuthKey.AccessToken)!;
	}

	public setRefreshToken(token: string): void {
		this.refreshToken = token;
		sessionStorage.removeItem(AuthKey.RefreshToken);
		sessionStorage.setItem(AuthKey.RefreshToken, token);
	}

	public getRefreshToken(): string {
		return sessionStorage.getItem(AuthKey.RefreshToken)!;
	}

	public removeRefreshToken(): void {
		sessionStorage.removeItem(AuthKey.RefreshToken);
	}

	public isAuthenticate(): boolean {
		if (this.getAccessToken() == null) {
			return false;
		}

		return true;
	}

	isLoggedIn(): boolean {
		const authToken = sessionStorage.getItem(AuthKey.AccessToken);
		return !!authToken;
	}

	public setRole(role: string): void {
		this.role = role;
		sessionStorage.removeItem(AuthKey.Role);
		sessionStorage.setItem(AuthKey.Role, role);
	}

	public getRole(): string {
		return sessionStorage.getItem(AuthKey.Role)!;
	}

	public getUserIdentity(): string {
		return sessionStorage.getItem(AuthKey.UserId)!;
	}

	public clear() {
		this.token = null;
		sessionStorage.clear();
	}
}
