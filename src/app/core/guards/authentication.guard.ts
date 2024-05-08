import { Observable, take, timer } from 'rxjs';
import { Router, UrlTree } from '@angular/router';

import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { ToastService } from 'src/app/shared/services/toast.service';

type BooleanTypes = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

@Injectable({
	providedIn: 'root',
})
export class AuthenticationGuard {
	constructor(
		private storage: StorageService,
		private router: Router,
		private toast: ToastService
	) {}

	canActivate(): BooleanTypes {
		const token = this.storage.getAccessToken();
		if (!token) {
			timer(2000)
				.pipe(take(1))
				.subscribe(() => {
					this.toast.showWarning(
						'Warning',
						'You must login first to access this resource.'
					);
					this.router.navigate(['/auth/sign-in'], {
						replaceUrl: true,
					});
				});

			return false;
		}

		return true;
	}
}
