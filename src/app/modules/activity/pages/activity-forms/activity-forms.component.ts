import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, type OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from 'src/app/core/services/activity.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { FormFieldComponent } from 'src/app/shared/components/form-field/form-field.component';
import { WrapperContentComponent } from 'src/app/shared/components/wrapper-content/wrapper-content.component';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { CreateActivityDto } from '../../domain/dto/create-activity.dto';
import { Activity } from '../../domain/entities/activity';
import { HttpErrorResponse } from '@angular/common/http';
import { timer, take, takeUntil, Subject } from 'rxjs';
import { FormFields } from '../../domain/entities/form-fields';
import { DropdownComponent } from 'src/app/shared/components/dropdown/dropdown.component';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/modules/category/domain/entities/category';
import { CalendarComponent } from 'src/app/shared/components/calendar/calendar.component';
import { Status } from '../../domain/entities/status';
import { JobType } from '../../domain/entities/job-type';
import { Platform } from '../../domain/entities/platform';
import { FormSelectComponent } from 'src/app/shared/components/form-select/form-select.component';
@Component({
  selector: 'app-activity-forms',
  standalone: true,
  imports: [
    CommonModule,
    FormFieldComponent,
    FormsModule,
    ReactiveFormsModule,
    WrapperContentComponent,
    ButtonComponent,
    DropdownComponent,
    CalendarComponent,
    FormSelectComponent
  ],
  templateUrl: './activity-forms.component.html',
  styleUrls: [ './activity-forms.component.scss' ],
  providers: [ToastService, ActivityService, CategoryService, ValidationService],
})
export class ActivityFormsComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  routeId!: string;
  label!: string;
  formFields!: FormFields[];
  private destroyed = new Subject();
  isLoading = false;
  categories!: Category[];
  status!: Status[];
  jobType!: JobType[];
  platform!: Platform[];

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly validations: ValidationService,
    private readonly activityService: ActivityService,
    private readonly location: Location,
    private readonly toastService: ToastService,
    private readonly categoryService: CategoryService
  ) {
    this.routeId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.formInitialized();
    this.initPageFromRouteId();
    this.findCategory();
    this.findStatus();
    this.findJobType();
    this.findPlatform();
  }

  formInitialized(): void {
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      position: ['', Validators.required],
      location: ['', Validators.required],
      jobType: ['', Validators.required],
      status: ['', Validators.required],
      platform: ['', Validators.required],
      appliedOn: ['', Validators.required],
      categoryId: ['', Validators.required],
    });
  }

  initPageFromRouteId(): void {
    this.label = this.routeId ? 'Update' : 'Create';
    if (this.routeId) {
      this.findOne();
    }
  }

  findOne(): void {
    this.activityService.findOne(this.routeId).pipe(takeUntil(this.destroyed)).subscribe({
      next: (activity: Activity) => {
        this.prepopulateForm(activity);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage(error);
      },
    });
  }

  prepopulateForm(activity: Activity): void {
    console.log(activity);
    if(activity){
      this.form.patchValue({
        companyName: activity.companyName,
        position: activity.position,
        location: activity.location,
        jobType: activity.jobType,
        status: activity.status,
        platform: activity.platform,
        appliedOn: new Date(activity.appliedOn),
        categoryId: activity.category,
      });
    }
  }

  get formCtrlValue() {
    return {
      companyName: this.form.get('companyName')?.value,
      position: this.form.get('position')?.value,
      location: this.form.get('location')?.value,
      jobType: this.form.get('jobType')?.value.name,
      status: this.form.get('status')?.value.name,
      platform: this.form.get('platform')?.value.name,
      appliedOn: this.form.get('appliedOn')?.value,
      categoryId: this.form.get('categoryId')?.value.id,
    };
  }

  findCategory(): void {
    this.categoryService.findAll().pipe(takeUntil(this.destroyed)).subscribe({
      next: (response) => {
        this.categories = response
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage(error);
      },
    })
  }

  findStatus(): void {
    this.activityService.findAppliedStatus().pipe(takeUntil(this.destroyed)).subscribe({
      next: (response) => {
        this.status = response;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage(error);
      },
    });
  }

  findPlatform(): void {
    this.activityService.findPlatform().pipe(takeUntil(this.destroyed)).subscribe({
      next: (response) => {
        this.platform = response;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage(error);
      },
    });
  }

  findJobType(): void {
    this.activityService.findJobTypes().pipe(takeUntil(this.destroyed)).subscribe({
      next: (response) => {
        this.jobType = response;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage(error);
      },
    });
  }

  successMessage(message: string): void {
    this.toastService.showSuccess('Success!', message);
  }

  errorMessage(error: HttpErrorResponse): void {
    this.toastService.showError('Error!', error.message);
  }

  get submitLabel(): string {
    return this.label;
  }

  get cancelLabel(): string {
    return 'Cancel';
  }

  getFormControl(form: string): FormControl | AbstractControl {
    return this.form.get(form) as FormControl;
  }

  onCreate(): void {
    this.activityService.create(this.formCtrlValue).subscribe({
      next: () => {
        setTimeout(() => {
          this.isLoading = false
        }, 2000);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage(error);
      },
      complete: () => {
        this.navigateAfterSucceed('Successfully Created!');
      }
    });
  }

  onUpdate(): void {
    this.activityService.update(this.routeId, this.formCtrlValue).subscribe({
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

  onSubmit(): void {
    console.log(this.formCtrlValue);
    this.isLoading = true;
    if (this.form.valid) {
      this.routeId ? this.onUpdate() : this.onCreate();
    } else {
      this.validations.markAllFormControlsAsTouched(this.form);
    }
  }

  navigateAfterSucceed(message: string): void {
    timer(3000)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigateByUrl('/activity/list').then(() => {
          this.successMessage(message);
        })
      });
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy() {
    this.destroyed.next(true);
    this.destroyed.complete();
  }

}
