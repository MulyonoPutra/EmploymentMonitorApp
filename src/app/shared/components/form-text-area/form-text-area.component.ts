import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-form-text-area',
  standalone: true,
  imports: [
    CommonModule,
    InputTextareaModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule
  ],
  templateUrl: './form-text-area.component.html',
  styleUrls: [ './form-text-area.component.scss' ],
  providers: [ValidationService],
})
export class FormTextAreaComponent {

  @Input() label!: string;
  @Input() fieldName!: string;
  @Input() formGroup!: FormGroup;

  constructor(private validation: ValidationService) { }

  get isInvalid() {
    const control = this.formGroup.get(this.fieldName) as FormControl;
    return this.validation.isInvalid(control);
  }

  get errorMessage(): string {
    const control = this.formGroup.get(this.fieldName) as FormControl;
    return this.validation.getErrorMessage(control);
  }

  get classLabel() {
    return {
      'label-valid': !this.isInvalid,
      'label-invalid': this.isInvalid,
    };
  }

  get classFilled(): { [key: string]: boolean } {
    const isFilled = this.formGroup.get(this.fieldName)?.value !== '';
    return { 'p-filled': isFilled };
  }

}
