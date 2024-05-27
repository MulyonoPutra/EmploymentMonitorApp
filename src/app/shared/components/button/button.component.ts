import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-button',
	standalone: true,
	imports: [CommonModule, ButtonModule],
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
	@Input({ required: false }) label!: string;
	@Input({ required: false }) icons?: string;
	@Input({ required: false }) width?: string;
	@Input({ required: false }) isDisabled!: boolean;
	@Input({ required: false }) isCancel: boolean = false;
	@Input({ required: false }) isLoading!: boolean;
	@Input({ required: false }) isLarge!: boolean;
	@Input() type = 'cancel' || 'save';

	@Output() clicked = new EventEmitter<void>();

	onClick(): void {
		this.clicked.emit();
	}

  getButtonClass() {
    return {
      'btn-lg': this.isLarge,
      'save': this.type === 'save',
      'cancel': this.type !== 'save' // Assuming cancel is default when type is not 'save'
    };
  }
}
