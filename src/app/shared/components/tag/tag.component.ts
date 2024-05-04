import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [
    CommonModule, TagModule
  ],
  templateUrl: './tag.component.html',
  styleUrls: [ './tag.component.scss' ],
})
export class TagComponent {
  @Input() status!: string;
}
