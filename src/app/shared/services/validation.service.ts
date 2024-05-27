import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ValidationService {
	markAllFormControlsAsTouched(formGroup: FormGroup): void {
		Object.values(formGroup.controls).forEach((control: AbstractControl) => {
			control.markAsTouched();
			if (control instanceof FormGroup) {
				this.markAllFormControlsAsTouched(control);
			}
		});
	}

	indonesianPhoneNumber(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: unknown } | null => {
			// Indonesian phone number pattern with "0" as the starting digit
			const phoneNumberPattern = /^0\d{9,15}$/;
			const valid = phoneNumberPattern.test(control.value);
			return valid ? null : { invalidPhoneNumber: true };
		};
	}

	passwordMatchValidator(formGroup: FormGroup) {
		const password = formGroup.get('password')!;
		const confirmPassword = formGroup.get('confirmPassword')!;

		if (password.value !== confirmPassword.value) {
			confirmPassword.setErrors({ passwordMismatch: true });
		} else {
			confirmPassword.setErrors(null);
		}
	}

	isInvalid(control: FormControl): boolean {
		return control && control.touched && control.invalid;
	}

	getErrorMessage(control: FormControl): string {
		if (control.errors?.['required']) {
			return 'This field is required.';
		}
		if (control.errors?.['email']) {
			return 'Invalid email format.';
		}
		if (control.errors?.['minlength']) {
			const requiredLength = control.errors['minlength'].requiredLength;
			return `Password should be at least ${requiredLength} characters long.`;
		}
		if (control.errors?.['passwordMismatch']) {
			return 'Passwords do not match.';
		}
		if (control.errors?.['invalidPhoneNumber']) {
			return 'Invalid phone number format.';
		}

		return '';
	}
}
