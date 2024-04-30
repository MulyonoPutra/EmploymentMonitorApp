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
  constructor(private cookieService: CookieService) { }

  public setAccessToken(token: string | null): void {
    this.token = token;
    this.cookieService.delete(AuthKey.AccessToken);
    this.cookieService.set(AuthKey.AccessToken, token!);
  }

  public getAccessToken(): string {
    return this.cookieService.get(AuthKey.AccessToken);
  }

  public setRefreshToken(token: string): void {
    this.refreshToken = token;
    this.cookieService.delete(AuthKey.RefreshToken);
    this.cookieService.set(AuthKey.RefreshToken, token);
  }

  public getRefreshToken(): string {
    return this.cookieService.get(AuthKey.RefreshToken);
  }

  public removeRefreshToken(): void {
    this.cookieService.delete(AuthKey.RefreshToken);
  }

  public isAuthenticate(): boolean {
    if (this.getAccessToken() == null) {
      return false;
    }

    return true;
  }

  public setRole(role: string): void {
    this.role = role;
    this.cookieService.delete(AuthKey.Role);
    this.cookieService.set(AuthKey.Role, role);
  }

  public getRole(): string {
    return this.cookieService.get(AuthKey.Role);
  }

  public getUserIdentity(): string {
    return this.cookieService.get(AuthKey.UserId);
  }

  public clear(): void {
    this.token = null;
    this.cookieService.deleteAll('/');
  }
}
