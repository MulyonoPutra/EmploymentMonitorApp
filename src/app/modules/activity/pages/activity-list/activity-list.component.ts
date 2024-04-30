import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './activity-list.component.html',
  styleUrls: [ './activity-list.component.scss' ],
})
export class ActivityListComponent implements OnInit {

  ngOnInit(): void { }

}
