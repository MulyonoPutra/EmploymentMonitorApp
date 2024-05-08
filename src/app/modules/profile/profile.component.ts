import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [CommonModule, RouterOutlet],
	template: `<router-outlet></router-outlet>`,
	styles: `
    :host {
      display: block;
    }
  `,
})
export class ProfileComponent {}
