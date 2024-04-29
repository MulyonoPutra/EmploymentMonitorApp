import { CommonModule, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { timer, take } from 'rxjs';
import { CategoryService } from 'src/app/core/services/category.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { FormFieldComponent } from 'src/app/shared/components/form-field/form-field.component';
import { CategoryDTO } from '../../domain/dto/category.dto';
import { Category } from '../../domain/entities/category';
import { WrapperContentComponent } from 'src/app/shared/components/wrapper-content/wrapper-content.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-category-forms',
  standalone: true,
  imports: [
    CommonModule,
    FormFieldComponent,
    FormsModule,
    ReactiveFormsModule,
    WrapperContentComponent,
    ButtonComponent,
    ButtonComponent,
  ],
  templateUrl: './category-forms.component.html',
  styleUrls: ['./category-forms.component.scss'],
  providers: [CategoryService, MessageService],
})
export class CategoryFormsComponent implements OnInit {
  form!: FormGroup;
  routeId!: string;
  label!: string;

  isLoading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly validations: ValidationService,
    private readonly categoryService: CategoryService,
    private readonly location: Location,
    private readonly messageService: MessageService
  ) {
    this.routeId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.formInitialized();
    this.initPageFromRouteId();
  }

  initPageFromRouteId(): void {
    this.label = this.routeId ? 'Update' : 'Create';
    if (this.routeId) {
      this.findOne();
    }
  }

  get submitButtonLabel(): string {
    return this.label;
  }

  get cancelButtonLabel(): string {
    return 'Cancel';
  }

  formInitialized(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

  get formCtrlValue(): CategoryDTO {
    return {
      name: this.form.get('name')?.value,
    };
  }

  prepopulateForm(category: CategoryDTO): void {
    this.form.patchValue({
      name: category.name,
    });
  }

  findOne(): void {
    this.categoryService.findOne(this.routeId).subscribe({
      next: (category: Category) => {
        this.prepopulateForm(category);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage(error);
      },
      complete: () => { },
    });
  }

  getFormControl(form: string): FormControl | AbstractControl {
    return this.form.get(form) as FormControl;
  }

  onCreate(): void {
    this.categoryService.create(this.formCtrlValue).subscribe({
      next: () => {
        setTimeout(() => {
          this.isLoading = false
        }, 2000);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage(error);
      },
      complete: () => {
        this.navigateAfterSucceed();
      }
    });
  }

  onUpdate(): void {
    this.categoryService.update(this.routeId, this.formCtrlValue).subscribe({
      next: () => {
        setTimeout(() => {
          this.isLoading = false
        }, 2000);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage(error);
      },
      complete: () => {
        this.successMessage();
        this.navigateAfterSucceed();
      },
    });
  }

  navigateAfterSucceed(): void {
    timer(3000)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigateByUrl('/category/list').then(() => {
          this.successMessage();
        })
      });
  }

  onSubmit(): void {
    this.isLoading = true;
    if (this.form.valid) {
      this.routeId ? this.onUpdate() : this.onCreate();
    } else {
      this.validations.markAllFormControlsAsTouched(this.form);
    }
  }

  goBack(): void {
    this.location.back();
  }

  successMessage(): void {
    this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have successfully updated!', life: 3000 });
  }

  errorMessage(error: HttpErrorResponse): void {
    this.messageService.add({ severity: 'error', summary: error.status.toString(), detail: error.message, life: 3000 });
  }
}
