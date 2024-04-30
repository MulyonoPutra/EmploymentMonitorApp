import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { take, timer } from 'rxjs';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FormFieldComponent } from 'src/app/shared/components/form-field/form-field.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Login } from '../../domain/entities/login';
import { MessageService } from 'primeng/api';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        AngularSvgIconModule,
        NgClass,
        NgIf,
        FormFieldComponent
    ],
  providers: [AuthenticationService, MessageService, ToastService],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly toastService: ToastService) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  get formCtrlValue(): Login {
    return {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
    };
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    if (this.form.valid) {
      this.login();
    } else {
      this.markAllFormControlsAsTouched(this.form);
    }
  }

  login(): void {
    this.authService.login(this.formCtrlValue).subscribe({
      next: () => {
        timer(2000)
          .pipe(take(1))
          .subscribe(() => {
            this.successMessage();
          });
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage(error);
      },
      complete: () => {
        this.toastService.showSuccess('Success!', 'logged in successfully');
        this.navigateAfterSucceed();
      }
    });
  }

  navigateAfterSucceed(): void {
    timer(1000)
      .pipe(take(1))
      .subscribe(() => this.router.navigateByUrl('/'));
  }

  markAllFormControlsAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllFormControlsAsTouched(control);
      }
    });
  }

  successMessage(): void {
    this.toastService.showSuccess('Success!', 'logged in successfully');
  }

  errorMessage(error: HttpErrorResponse): void {
    this.toastService.showError('Error!', error.message);
  }
}
