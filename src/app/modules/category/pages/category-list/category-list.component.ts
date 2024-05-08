import { CommonModule } from '@angular/common';
import { Component, OnDestroy, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/core/services/category.service';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { Category } from '../../domain/entities/category';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, take, takeUntil, timer } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
	selector: 'app-category-list',
	standalone: true,
	imports: [CommonModule, TableComponent, ToastModule, ConfirmDialogModule],
	templateUrl: './category-list.component.html',
	styleUrls: ['./category-list.component.scss'],
	providers: [CategoryService, ConfirmationService, MessageService],
})
export class CategoryListComponent implements OnInit, OnDestroy {
	private destroyed = new Subject();
	categories!: Category[];

	constructor(
		private readonly router: Router,
		private readonly categoryService: CategoryService,
		private readonly toastService: ToastService
	) {}

	ngOnInit(): void {
		this.findAll();
	}

	tableColumns = [
		{ header: 'Id', field: 'id', width: '25%' },
		{ header: 'Name', field: 'name', width: '25%' },
	];

	findAll(): void {
		this.categoryService
			.findAll()
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: (response) => {
					this.categories = response;
				},
				error: (error: HttpErrorResponse) => {
					this.errorMessage(error);
				},
			});
	}

	onUpdate(id: string): void {
		this.router.navigateByUrl(`category/update/${id}`);
	}

	onAccept(id: string): void {
		this.categoryService
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
				this.router.navigateByUrl('/category/list').then(() => window.location.reload())
			);
	}

	onReject() {
		this.toastService.showError('Rejected!', 'You have cancelled this operation');
	}

	onCreate(): void {
		this.router.navigate(['category/forms']);
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
