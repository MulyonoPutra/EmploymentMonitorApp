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

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule, TableComponent, ToastModule, ConfirmDialogModule,
  ],
  templateUrl: './category-list.component.html',
  styleUrls: [ './category-list.component.scss' ],
  providers: [CategoryService, ConfirmationService, MessageService]
})
export class CategoryListComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();
  categories!: Category[];

  constructor(
    private readonly router: Router,
    private readonly categoryService: CategoryService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  tableColumns = [
    { header: 'Id', field: 'id', width: '25%' },
    { header: 'Name', field: 'name', width: '25%' },
  ];

  findAll(): void {
    this.categoryService.findAll().pipe(takeUntil(this.destroyed)).subscribe({
      next: (response) => {
        this.categories = response
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: error.status.toString(), detail: error.message, life: 3000 });
      },
    })
  }

  onUpdate(id: string): void {
    this.router.navigateByUrl(`category/update/${id}`);
  }

  onAccept(id: string): void {
    console.log('handleAccept: ', id);
    this.categoryService
      .remove(id)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: () => { },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: error.status.toString(), detail: error.message, life: 3000 });
        },
        complete: () => {
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have successfully removed' });
          this.navigateAfterSucceed();
        },
      });

  }

  navigateAfterSucceed(): void {
    timer(1000)
      .pipe(take(1))
      .subscribe(() =>
        this.router
          .navigateByUrl('/category/list')
          .then(() => window.location.reload())
      );
  }

  onReject() {
    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have cancelled this operation', life: 3000 });
  }

  onCreate(): void {
    this.router.navigate(['category/forms']);
  }

  filter(table: Table, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value
    table.filterGlobal(value, 'contains')
  }

  ngOnDestroy() {
    this.destroyed.next(true);
    this.destroyed.complete();
  }

}
