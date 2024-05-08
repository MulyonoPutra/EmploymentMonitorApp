import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Toast } from 'src/app/core/models/toast';
import { ToastService } from '../../services/toast.service';

@Component({
	selector: 'app-toast',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './toast.component.html',
	styleUrls: ['./toast.component.scss'],
	providers: [ToastService],
})
export class ToastComponent {}
