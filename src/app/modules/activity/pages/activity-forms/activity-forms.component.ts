import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-activity-forms',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './activity-forms.component.html',
  styleUrls: [ './activity-forms.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityFormsComponent implements OnInit {

  ngOnInit(): void { }

}
