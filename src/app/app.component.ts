import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NgClass, RouterOutlet, ResponsiveHelperComponent],
})
export class AppComponent {
  title = 'Employment Monitor';

  constructor(public themeService: ThemeService) { }
}
