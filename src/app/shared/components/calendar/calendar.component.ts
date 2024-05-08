import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ValidationService } from '../../services/validation.service';

@Component({
	selector: 'app-calendar',
	standalone: true,
	imports: [CommonModule, CalendarModule, FloatLabelModule, FormsModule, ReactiveFormsModule],
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
	date: Date | undefined;
	@Input() label!: string;
	@Input() fieldName!: string;
	@Input() formGroup!: FormGroup;
	@Input() isDisabled!: FormGroup;

	constructor(private validation: ValidationService) {}

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
