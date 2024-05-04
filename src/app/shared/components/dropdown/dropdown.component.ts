import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule, FloatLabelModule, DropdownModule
  ],
  template: `

      <div class="form__group relative py-4" [formGroup]="formGroup">
  <span class="p-float-label relative">
        <p-dropdown
        [style]="{'width':'100%', 'border': '1px solid #D0D0D0' }"
          [formControlName]="fieldName"
          [options]="data"
          optionLabel={{optionLabel}}>
        </p-dropdown>
        <label for="float-label" style="font-size: 12px">{{placeholder}}</label>
  </span>
  @if (isInvalid) {
  <div class="errors-message">{{ errorMessage }}</div>
  }
</div>

  `,
  styleUrls: [ './dropdown.component.scss' ],
})
export class DropdownComponent {
  @Input() data!: any[];
  @Input() label!: string;
  @Input() fieldName!: string;
  @Input() formGroup!: FormGroup;
  @Input() optionLabel!: string;
  @Input({required: false}) isDisabled?: boolean;
  @Input() placeholder!: string;

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
