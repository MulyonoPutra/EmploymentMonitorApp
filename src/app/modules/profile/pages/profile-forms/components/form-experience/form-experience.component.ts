import { CommonModule, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, Output, type OnInit } from '@angular/core';
import {
	ReactiveFormsModule,
	FormsModule,
	FormGroup,
	FormBuilder,
	Validators,
	FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, timer, take } from 'rxjs';
import { ProfileService } from 'src/app/core/services/profile.service';
import { Experience } from 'src/app/modules/profile/domain/entities/experience';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { CalendarComponent } from 'src/app/shared/components/calendar/calendar.component';
import { FormFieldComponent } from 'src/app/shared/components/form-field/form-field.component';
import { FormTextAreaComponent } from 'src/app/shared/components/form-text-area/form-text-area.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { CreateExperienceDto } from '../../../../domain/dto/create-experience.dto';
import { UpdateExperienceDto } from '../../../../domain/dto/update-experience.dto';
import { EditorComponent } from 'src/app/shared/components/editor/editor.component';

@Component({
	selector: 'app-form-experience',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		FormFieldComponent,
		ButtonComponent,
		FormTextAreaComponent,
		CalendarComponent,
		EditorComponent,
	],
	templateUrl: './form-experience.component.html',
	styleUrls: ['./form-experience.component.scss'],
})
export class FormExperienceComponent implements OnInit, OnDestroy {
	private destroyed = new Subject();
	@Input() visible: boolean = false;
	@Output() close = new EventEmitter<any>();

	form!: FormGroup;
	updateForm!: FormGroup;
	isLoading = false;
	isEmpty!: boolean;
	experienceId!: string;

	constructor(
		private readonly location: Location,
		private readonly fb: FormBuilder,
		private readonly profileService: ProfileService,
		private readonly toastService: ToastService,
		private readonly route: ActivatedRoute,
		private readonly router: Router
	) {
		this.experienceId = this.route.snapshot.paramMap.get('id')!;
	}

	ngOnInit(): void {
		if (!this.experienceId) {
			this.formArrayInitialized();
		} else {
			this.updateFormInitializated();
			this.findExperienceById();
		}
	}

	findExperienceById(): void {
		if (this.experienceId) {
			this.profileService
				.findExperience(this.experienceId)
				.pipe(takeUntil(this.destroyed))
				.subscribe({
					next: (data: Experience) => {
						this.form = this.fb.group({
							experience: this.prepopulateForms(data),
						});
					},
				});
		}
	}

	formArrayInitialized(): void {
		this.form = this.fb.group({
			experience: this.fb.array([this.experienceFormGroup()]),
		});
	}

	updateFormInitializated(): void {
		this.updateForm = this.fb.group({
			startDate: ['', Validators.required],
			endDate: ['', Validators.required],
			location: ['', Validators.required],
			position: ['', Validators.required],
			company: ['', Validators.required],
			responsibilities: ['', Validators.required],
		});
	}

	protected prepopulateForms(data: any): void {
		this.updateForm.patchValue({
			startDate: new Date(data.startDate),
			endDate: new Date(data.endDate),
			location: data.location,
			position: data.position,
			company: data.company,
			responsibilities: data.responsibilities,
		});
	}

	experienceFormGroup(): FormGroup {
		return this.fb.group({
			startDate: ['', Validators.required],
			endDate: ['', Validators.required],
			location: ['', Validators.required],
			position: ['', Validators.required],
			company: ['', Validators.required],
			responsibilities: ['', Validators.required],
		});
	}

	get experienceFormArray(): FormArray {
		return this.form.get('experience')! as FormArray;
	}

	get newFormValue(): CreateExperienceDto[] {
		return this.form.value.experience;
	}

	get updatedFormValue(): UpdateExperienceDto {
		return this.updateForm.value;
	}

	get experienceFormGroupValue(): UpdateExperienceDto {
		return this.form.value.experience.find((exp: UpdateExperienceDto) => exp);
	}

	experienceFormGroupIndex(index: number): FormGroup {
		const experiences = this.form.get('experience') as FormArray;
		return experiences.at(index) as FormGroup;
	}

	addNewForms(): void {
		const formArray = this.form.get('experience') as FormArray;
		formArray.push(this.experienceFormGroup());
	}

	onSubmit(): void {
		this.isLoading = true;
		if (this.experienceId) {
			this.onUpdateProcess();
		} else {
			this.onSaveProcess();
		}
	}

	onSaveProcess(): void {
		this.profileService
			.newExperience(this.newFormValue)
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
					this.toastService.showSuccess('Success!', 'Successfully Created!');
					this.navigateAfterSucceed();
				},
			});
	}

	onUpdateProcess(): void {
		this.profileService
			.updateExperience(this.experienceId, this.updatedFormValue)
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
					this.toastService.showSuccess('Success!', 'Successfully Updated!');
					this.navigateAfterSucceed();
				},
			});
	}

	removeForms(i: number): void {
		const formArray = this.form.get('experience') as FormArray;
		formArray.removeAt(i);
	}

	private errorMessage(error: HttpErrorResponse): void {
		this.toastService.showError('Error!', error.message);
	}

	navigateAfterSucceed(): void {
		timer(1000)
			.pipe(take(1))
			.subscribe(() => {
				this.router.navigateByUrl('/profile');
			});
	}

	goBack(): void {
		this.location.back();
	}

	ngOnDestroy(): void {
		this.destroyed.next(true);
		this.destroyed.complete();
	}
}
