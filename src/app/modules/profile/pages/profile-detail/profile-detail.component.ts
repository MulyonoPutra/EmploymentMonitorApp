import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { ProfileService } from 'src/app/core/services/profile.service';
import { Router } from '@angular/router';
import { Subject, take, takeUntil, timer } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../domain/entities/user';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { FileValidationService } from 'src/app/shared/services/file-validation.service';

@Component({
	selector: 'app-profile-detail',
	standalone: true,
	imports: [CommonModule, ButtonComponent, ConfirmDialogModule, TooltipModule],
	templateUrl: './profile-detail.component.html',
	styleUrls: ['./profile-detail.component.scss'],
	providers: [ProfileService, ConfirmationService, ToastService],
})
export class ProfileDetailComponent implements OnInit {
	private destroyed = new Subject();
	user!: User;

	labelButton = 'Update Profile';
	imgBase64!: string;

	isLoading = false;

	constructor(
		private readonly router: Router,
		private readonly profileService: ProfileService,
		private readonly toastService: ToastService,
		private readonly confirmationService: ConfirmationService,
		private readonly fileValidationService: FileValidationService
	) {}

	ngOnInit(): void {
		this.findUser();
	}

	findUser(): void {
		this.profileService
			.findUserDetail()
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: (response) => {
					this.user = response;
				},
				error: (error: HttpErrorResponse) => {
					this.errorMessage(error.message);
				},
			});
	}

	generateAvatar(): string {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const endpoint = 'https://robohash.org';
		let text = '';

		for (let i = 0; i < 10; i++) {
			text += characters.charAt(Math.floor(Math.random() * characters.length));
		}

		return `${endpoint}/${text}`;
	}

	updateEducation(id: string): void {
		this.router.navigateByUrl(`/profile/education/${id}`);
	}

	createEducation(): void {
		this.router.navigateByUrl(`/profile/education`);
	}

	updateExperience(id: string): void {
		this.router.navigateByUrl(`/profile/experience/${id}`);
	}

	createExperience(): void {
		this.router.navigateByUrl(`/profile/experience`);
	}

	removeConfirmation(event: Event, id: string, flag: string): void {
		this.confirmationService.confirm({
			target: event.target as EventTarget,
			message: 'Do you want to delete this record?',
			header: 'Delete Confirmation',
			icon: 'pi pi-info-circle',
			accept: () => {
				if (flag === 'education') {
					this.removeEducationFromServer(id);
				} else if (flag === 'experience') {
					this.removeExperienceFromServer(id);
				}
			},
			reject: () => {
				this.errorMessage('Delete record cancelled! ');
			},
		});
	}

	removeEducationFromServer(id: string): void {
		this.profileService
			.removeEducation(id)
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: () => {},
				error: (error: HttpErrorResponse) => {
					this.errorMessage(error.message);
				},
				complete: () => {
					this.successMessage(`successfully removed with id ${id}`);
					this.reloadAfterSucceed();
				},
			});
	}

	removeExperienceFromServer(id: string): void {
		this.profileService
			.removeExperience(id)
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: () => {},
				error: (error: HttpErrorResponse) => {
					this.errorMessage(error.message);
				},
				complete: () => {
					this.successMessage(`successfully removed with id ${id}`);
					this.reloadAfterSucceed();
				},
			});
	}

	reloadAfterSucceed(): void {
		timer(1000)
			.pipe(take(1))
			.subscribe(() => window.location.reload());
	}

	update(id: string): void {
		this.router.navigateByUrl(`/profile/update/${id}`, { state: this.user });
	}

	onChangeFile(event: Event): void {
		const inputElement = event.target as HTMLInputElement;

		if (inputElement.files && inputElement.files[0]) {
			const file = inputElement.files[0];

			if (!this.fileValidationService.isValidImageType(file)) {
				this.errorMessage('Only JPG, PNG, and WebP image formats are allowed.');
				return;
			}

			if (!this.fileValidationService.isValidFileSize(file)) {
				this.errorMessage('Image size exceeds the limit of 5 MB.');
				return;
			}

			this.imgBase64 = URL.createObjectURL(file);
			this.uploadImageToServer(file);
		}
	}

	uploadImageToServer(file: File): void {
		const formData = new FormData();
		formData.append('avatar', file);

		this.profileService.uploadAvatar(formData).subscribe({
			next: () => {},
			error: (error: HttpErrorResponse) => {
				this.errorMessage(error.message);
			},
			complete: () => {
				this.successMessage(`successfully change avatar!`);
				this.reloadAfterSucceed();
			},
		});
	}

	successMessage(message: string): void {
		this.toastService.showSuccess('Success!', message);
	}

	errorMessage(message: string): void {
		this.toastService.showError('Error!', message);
	}
}
