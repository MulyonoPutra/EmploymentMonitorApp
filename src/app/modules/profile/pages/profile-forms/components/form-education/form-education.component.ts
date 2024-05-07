import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output, type OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateEducationDto } from '../../../dto/create-education.dto';
import { UpdateEducationDto } from '../../../dto/update-education.dto';
import { Subject, take, takeUntil, timer } from 'rxjs';
import { FormFieldComponent } from 'src/app/shared/components/form-field/form-field.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Education } from 'src/app/modules/profile/domain/entities/education';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormTextAreaComponent } from 'src/app/shared/components/form-text-area/form-text-area.component';
import { CalendarComponent } from 'src/app/shared/components/calendar/calendar.component';

@Component({
  selector: 'app-form-education',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormFieldComponent,
    ButtonComponent,
    FormTextAreaComponent,
    CalendarComponent
  ],
  templateUrl: './form-education.component.html',
  styleUrls: [ './form-education.component.scss' ],
  providers: [ProfileService, ToastService],
})
export class FormEducationComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<any>();

  form!: FormGroup;
  updateForm!: FormGroup;
  isLoading = false;
  isEmpty!: boolean;
  educationId!: string;

  constructor(
    private readonly location: Location,
    private readonly fb: FormBuilder,
    private readonly profileService: ProfileService,
    private readonly toastService: ToastService,
    private readonly route: ActivatedRoute,
    private readonly router: Router

  ) {
    this.educationId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    if (!this.educationId) {
      this.formArrayInitialized();
    } else {
      this.updateFormInitializated();
      this.findEducationById();
    }
  }

  findEducationById(): void {
    if (this.educationId) {
      this.profileService
        .findEducation(this.educationId)
        .pipe(takeUntil(this.destroyed))
        .subscribe({
          next: (data: Education) => {
            this.form = this.fb.group({
              education: this.prepopulateForms(data),
            });
          },
        });
    }
  }

  formArrayInitialized(): void {
    this.form = this.fb.group({
      education: this.fb.array([this.educationFormGroup()]),
    });
  }

  updateFormInitializated(): void {
    this.updateForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      title: ['', Validators.required],
      institution: ['', Validators.required],
      GPA: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  protected prepopulateForms(data: any): void {
    this.updateForm.patchValue({
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      title: data.title,
      institution: data.institution,
      GPA: data.GPA,
      description: data.description,
    });
  }

  educationFormGroup(): FormGroup {
    return this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      title: ['', Validators.required],
      institution: ['', Validators.required],
      GPA: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  get educationFormArray(): FormArray {
    return this.form.get('education')! as FormArray;
  }

  get newFormValue(): CreateEducationDto[] {
    return this.form.value.education;
  }

  get updatedFormValue(): UpdateEducationDto {
    return this.updateForm.value;
  }

  get educationFormGroupValue(): UpdateEducationDto {
    return this.form.value.education.find((exp: UpdateEducationDto) => exp);
  }

  educationFormGroupIndex(index: number): FormGroup {
    const educations = this.form.get('education') as FormArray;
    return educations.at(index) as FormGroup;
  }

  addNewForms(): void {
    const formArray = this.form.get('education') as FormArray;
    formArray.push(this.educationFormGroup());
  }

  onSubmit(): void {
    this.isLoading = true;
    if (this.educationId) {
      this.onUpdateProcess();
    } else {
      this.onSaveProcess();
    }
  }

  onSaveProcess(): void {
    this.profileService
      .newEducation(this.newFormValue)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.isLoading = false
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
      .updateEducation(this.educationId, this.updatedFormValue)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.isLoading = false
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
    const formArray = this.form.get('education') as FormArray;
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
