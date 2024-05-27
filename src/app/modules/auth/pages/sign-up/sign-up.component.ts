import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { take, timer } from 'rxjs';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FormFieldComponent } from 'src/app/shared/components/form-field/form-field.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Register } from '../../domain/entities/register';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ValidationService } from 'src/app/shared/services/validation.service';

/*
Name: "anoraga"
Email: "anoraga@gmail.com"
Password: 12345
*/

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss'],
	standalone: true,
	imports: [
		FormsModule,
		ReactiveFormsModule,
		FormFieldComponent,
		RouterLink,
		AngularSvgIconModule,
	],
})
export class SignUpComponent implements OnInit {
	form!: FormGroup;
	submitted = false;
	passwordTextType!: boolean;

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly router: Router,
		private readonly authService: AuthenticationService,
		private readonly toastService: ToastService,
		private readonly validationService: ValidationService
	) {}

	ngOnInit(): void {
		this.formInitialized();
	}

	formInitialized(): void {
		this.form = this.formBuilder.group(
			{
				name: ['', Validators.required],
				email: ['', [Validators.required, Validators.email]],
				password: ['', Validators.required],
				confirmPassword: ['', [Validators.required]],
			},
			{ validator: this.validationService.passwordMatchValidator }
		);
	}

	get f() {
		return this.form.controls;
	}

	get formCtrlValue(): Register {
		return {
			name: this.form.get('name')?.value,
			email: this.form.get('email')?.value,
			password: this.form.get('password')?.value,
		};
	}

	togglePasswordTextType() {
		this.passwordTextType = !this.passwordTextType;
	}

	onSubmit() {
		if (this.form.valid) {
			this.register();
		} else {
			this.validationService.markAllFormControlsAsTouched(this.form);
		}
	}

	register(): void {
		this.authService.register(this.formCtrlValue).subscribe({
			next: () => {
				this.successMessage();
			},
			error: (error: HttpErrorResponse) => {
				this.errorMessage(error);
			},
			complete: () => {
				this.navigateAfterSucceed();
			},
		});
	}

	navigateAfterSucceed(): void {
		timer(1000)
			.pipe(take(1))
			.subscribe(() => this.router.navigateByUrl('/auth/sign-in'));
	}

	successMessage(): void {
		this.toastService.showSuccess('Success!', 'logged in successfully');
	}

	errorMessage(error: HttpErrorResponse): void {
		this.toastService.showError('Error!', error.message);
	}
}
