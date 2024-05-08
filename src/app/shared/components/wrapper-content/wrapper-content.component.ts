import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-wrapper-content',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './wrapper-content.component.html',
	styleUrls: ['./wrapper-content.component.scss'],
})
export class WrapperContentComponent {
	@Input({ required: true }) title!: string;
}
