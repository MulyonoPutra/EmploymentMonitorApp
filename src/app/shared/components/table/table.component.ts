import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { Category } from 'src/app/modules/category/domain/entities/category';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagComponent } from '../tag/tag.component';
import { TextOverflowPipe } from '../../pipes/text-overflow.pipe';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    AngularSvgIconModule,
    ConfirmDialogModule,
    ToastModule,
    TextOverflowPipe,
    TagComponent
  ],
  templateUrl: './table.component.html',
  styleUrls: [ './table.component.scss' ],
  providers: [ConfirmationService, MessageService]
})
export class TableComponent {
  @Input() title!: string;
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() rows: number = 5;
  @Input() dt: any;
  @Output() create = new EventEmitter<void>();
  @Output() update = new EventEmitter<string>();
  @Output() onAccept: EventEmitter<string> = new EventEmitter<string>();
  @Output() onReject: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(private confirmationService: ConfirmationService) { }

  confirm(data: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to remove this?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.onAccept.emit(data.id);
      },
      reject: () => {
        this.onReject.emit();
      }
    });
  }
  onUpdate(data: any){
    this.update.emit(data.id);
  }

  onCreate() {
    this.create.emit();
  }

  filter(table: Table, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value
    table.filterGlobal(value, 'contains')
  }

}
