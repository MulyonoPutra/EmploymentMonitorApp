import { CommonModule } from '@angular/common';
import { Component, OnDestroy, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, take, takeUntil, timer } from 'rxjs';
import { ActivityService } from 'src/app/core/services/activity.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Activity } from '../../domain/entities/activity';
import { HttpErrorResponse } from '@angular/common/http';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
	selector: 'app-activity-list',
	standalone: true,
	imports: [CommonModule, TableComponent, ConfirmDialogModule],
	templateUrl: './activity-list.component.html',
	styleUrls: ['./activity-list.component.scss'],
	providers: [ActivityService],
})
export class ActivityListComponent implements OnInit, OnDestroy {
	private destroyed = new Subject();
	activity!: Activity[];

	tableColumns = [
		{ header: 'Id', field: 'id', width: '10%' },
		{ header: 'Name', field: 'companyName', width: '15%' },
		{ header: 'Position', field: 'position', width: '20%' },
		{ header: 'Status', field: 'status', width: '15%' },
		{ header: 'Applied', field: 'appliedOn', width: '15%' },
		{ header: 'Platform', field: 'platform', width: '15%' },
	];

	constructor(
		private readonly router: Router,
		private readonly activityService: ActivityService,
		private toastService: ToastService
	) {}

	ngOnInit(): void {
		this.findAll();
	}

	findAll(): void {
		this.activityService
			.findAll()
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: (response) => {
					this.activity = response;
				},
				error: (error: HttpErrorResponse) => {
					this.toastService.showError('Error!', error.message);
				},
			});
	}

	onUpdate(id: string): void {
		if (id) {
			this.router.navigateByUrl(`activity/update/${id}`);
		}
	}

	onAccept(id: string): void {
		this.activityService
			.remove(id)
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: () => {
					this.successMessage('You have successfully removed');
				},
				error: (error: HttpErrorResponse) => {
					this.errorMessage(error);
				},
				complete: () => {
					this.navigateAfterSucceed();
				},
			});
	}

	navigateAfterSucceed(): void {
		timer(1000)
			.pipe(take(1))
			.subscribe(() =>
				this.router.navigateByUrl('/activity/list').then(() => window.location.reload())
			);
	}

	onReject() {
		this.toastService.showError('Rejected!', 'You have cancelled this operation');
	}

	onCreate(): void {
		this.router.navigate(['activity/forms']);
	}

	successMessage(message: string): void {
		this.toastService.showSuccess('Success!', message);
	}

	errorMessage(error: HttpErrorResponse): void {
		this.toastService.showError('Error!', error.message);
	}

	ngOnDestroy() {
		this.destroyed.next(true);
		this.destroyed.complete();
	}
}
