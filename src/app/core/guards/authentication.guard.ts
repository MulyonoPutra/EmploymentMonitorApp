import { Router, UrlTree } from '@angular/router';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

type BooleanTypes = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard {
  constructor(
    private storage: StorageService,
    private router: Router,
  ) { }

  canActivate(): BooleanTypes {
    const token = this.storage.getAccessToken()!;
    console.log(token);

    if (!token) {
      this.router.navigate(['/auth/sign-in'], {
        replaceUrl: true,
      });
      return false;
    }

    return true;
  }
}
