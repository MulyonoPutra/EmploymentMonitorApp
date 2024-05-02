import { CommonModule } from '@angular/common';
import { Component, OnDestroy, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ActivityService } from 'src/app/core/services/activity.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Activity } from '../../domain/entities/activity';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './activity-list.component.html',
  styleUrls: [ './activity-list.component.scss' ],
  providers: [ActivityService]
})
export class ActivityListComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();
  activity!: Activity[];

  constructor(
    private readonly router: Router,
    private readonly activityService: ActivityService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.findAll();
  }
  findAll(): void {
    this.activityService.findAll().pipe(takeUntil(this.destroyed)).subscribe({
      next: (response) => {
        this.activity = response;
        console.log(response);
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showError('Error!', error.message);
      },
    })
  }

  onUpdate(id: string): void {
    this.router.navigateByUrl(`category/update/${id}`);
  }

  ngOnDestroy() {
    this.destroyed.next(true);
    this.destroyed.complete();
  }
}
