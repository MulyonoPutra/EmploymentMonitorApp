import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    CommonModule, ButtonModule
  ],
  templateUrl: './button.component.html',
  styleUrls: [ './button.component.scss' ],
})
export class ButtonComponent {

  @Input({ required: false }) label!: string;
  @Input({ required: false }) icons?: string;
  @Input({ required: false }) width?: string;
  @Input({ required: false }) isDisabled!: boolean;
  @Input({ required: false }) isCancel: boolean = false;
  @Input({ required: false }) isLoading!: boolean;
  @Input() type = 'cancel' || 'save';

  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    this.clicked.emit();
  }


}
