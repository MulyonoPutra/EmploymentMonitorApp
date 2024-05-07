import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './form-select.component.html',
  styleUrls: [ './form-select.component.scss' ],
})
export class FormSelectComponent {
  @Input() options!: any[];
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() controlName!: string;
  @Input() optionLabel!: string;
  @Input() parentForm!: FormGroup;
  @Input() submitted!: boolean;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.parentForm.addControl(this.controlName, this.formBuilder.control('', Validators.required));
  }

  get formControl() {
    return this.parentForm.controls[this.controlName];
  }
}
