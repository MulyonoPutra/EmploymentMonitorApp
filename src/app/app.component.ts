import { CommonModule, NgClass } from '@angular/common';

import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme.service';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ToastModule } from 'primeng/toast';
import { ToastService } from './shared/services/toast.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		NgClass,
		RouterOutlet,
		ResponsiveHelperComponent,
		ToastComponent,
		ToastModule,
	],
	providers: [MessageService, ToastService],
})
export class AppComponent {
	title = 'Employment Monitor';

	constructor(public themeService: ThemeService) {}
}
