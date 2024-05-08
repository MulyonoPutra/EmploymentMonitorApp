import { Component, OnInit } from '@angular/core';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MenuService } from '../../services/menu.service';
import { NavbarMenuComponent } from './navbar-menu/navbar-menu.component';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobilecomponent';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { ProfileService } from 'src/app/core/services/profile.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { User } from 'src/app/modules/profile/domain/entities/user';
import { UserProfile } from '../../domain/entities/user-profile';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
	standalone: true,
	imports: [
		AngularSvgIconModule,
		NavbarMenuComponent,
		ProfileMenuComponent,
		NavbarMobileComponent,
	],
})
export class NavbarComponent implements OnInit {
	avatar!: string;
	user!: UserProfile;

	constructor(
		private readonly menuService: MenuService,
		private readonly profileService: ProfileService,
		private readonly authenticationService: AuthenticationService,
		private readonly toastService: ToastService,
		private readonly storageService: StorageService
	) {}

	ngOnInit(): void {
		this.profileDetail();
	}

	public toggleMobileMenu(): void {
		this.menuService.showMobileMenu = true;
	}

	profileDetail(): void {
		this.profileService.findUserDetail().subscribe({
			next: (user: User) => {
				this.user = {
					avatar: user.avatar,
					name: user.name,
					email: user.email,
				};
			},
			error: (error: HttpErrorResponse) => {
				this.errorMessage(error);
			},
		});
	}

	logout(): void {
		// const token = this.storageService.getAccessToken();
		// this.authenticationService.logout(token).subscribe({
		//   next: () => {
		//     this.successMessage(`Logout Successfully!`);
		//   },
		//   error: (error: HttpErrorResponse) => {
		//     console.log(error.message);
		//     this.errorMessage(error);
		//   },
		// })
		this.storageService.clear();
		window.location.reload();
	}

	successMessage(message: string): void {
		this.toastService.showSuccess('Success!', message);
	}

	errorMessage(error: HttpErrorResponse): void {
		this.toastService.showError('Error!', error.message);
	}
}
