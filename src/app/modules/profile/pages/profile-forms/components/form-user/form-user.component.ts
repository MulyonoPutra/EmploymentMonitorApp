import { CommonModule, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, type OnInit } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormControl,
	AbstractControl,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { Subject, timer, take, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/core/services/profile.service';
import { UpdateUserDto } from 'src/app/modules/profile/domain/dto/update-user.dto';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { CalendarComponent } from 'src/app/shared/components/calendar/calendar.component';
import { FormFieldComponent } from 'src/app/shared/components/form-field/form-field.component';
import { FormTextAreaComponent } from 'src/app/shared/components/form-text-area/form-text-area.component';
import { WrapperContentComponent } from 'src/app/shared/components/wrapper-content/wrapper-content.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ValidationService } from 'src/app/shared/services/validation.service';

@Component({
	selector: 'app-form-user',
	standalone: true,
	imports: [
		FormsModule,
		CardModule,
		CommonModule,
		AccordionModule,
		ReactiveFormsModule,
		FormFieldComponent,
		WrapperContentComponent,
		ButtonComponent,
		CalendarComponent,
		FormTextAreaComponent,
	],
	templateUrl: './form-user.component.html',
	styleUrls: ['./form-user.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUserComponent implements OnInit, OnDestroy {
	form!: FormGroup;
	routeId!: string;
	private destroyed = new Subject();
	isLoading = false;
	label!: string;

	constructor(
		private readonly fb: FormBuilder,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly validations: ValidationService,
		private readonly profileService: ProfileService,
		private readonly location: Location,
		private readonly toastService: ToastService
	) {
		this.routeId = this.route.snapshot.paramMap.get('id')!;
	}

	ngOnInit(): void {
		this.formInitialized();
		this.receivedData();
	}

	formInitialized(): void {
		this.form = this.fb.group({
			name: ['', Validators.required],
			email: ['', Validators.required],
			summary: ['', Validators.required],
			birthday: ['', Validators.required],
			phone: ['', Validators.required],
		});
	}

	receivedData(): void {
		const { name, email, summary, birthday, phone } = history.state;
		const user: UpdateUserDto = {
			name,
			email,
			summary,
			birthday,
			phone,
		};

		this.prepopulateForm(user);
	}

	get formCtrlValue(): UpdateUserDto {
		return {
			name: this.form.get('name')?.value,
			email: this.form.get('email')?.value,
			summary: this.form.get('summary')?.value,
			birthday: this.form.get('birthday')?.value,
			phone: this.form.get('phone')?.value,
		};
	}

	prepopulateForm(user: UpdateUserDto): void {
		this.form.patchValue({
			name: user.name,
			email: user.email,
			summary: user.summary,
			birthday: new Date(user.birthday),
			phone: user.phone,
		});
	}

	getFormControl(form: string): FormControl | AbstractControl {
		return this.form.get(form) as FormControl;
	}

	get submitLabel(): string {
		return this.label;
	}

	get cancelLabel(): string {
		return 'Cancel';
	}

	onSubmit(): void {
		this.isLoading = true;
		if (this.routeId) {
			this.onUpdateProcess();
		}
	}

	onUpdateProcess(): void {
		this.profileService
			.updateProfile(this.routeId, this.formCtrlValue)
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: () => {
					setTimeout(() => {
						this.isLoading = false;
					}, 2000);
				},
				error: (error: HttpErrorResponse) => {
					this.errorMessage(error);
				},
				complete: () => {
					this.navigateAfterSucceed('Successfully Updated!');
				},
			});
	}

	navigateAfterSucceed(message: string): void {
		timer(3000)
			.pipe(take(1))
			.subscribe(() => {
				this.router.navigateByUrl('/profile').then(() => {
					window.location.reload();
					this.successMessage(message);
				});
			});
	}

	goBack(): void {
		this.location.back();
	}

	successMessage(message: string): void {
		this.toastService.showSuccess('Success!', message);
	}

	errorMessage(error: HttpErrorResponse): void {
		this.toastService.showError('Error!', error.message);
	}

	ngOnDestroy() {
		this.destroyed.next(true);
		this.destroyed.complete();
	}
}
