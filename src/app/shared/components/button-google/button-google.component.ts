import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-button-google',
  standalone: true,
  imports: [
    CommonModule, AngularSvgIconModule
  ],
  templateUrl: './button-google.component.html',
  styleUrls: [ './button-google.component.scss' ],
})
export class ButtonGoogleComponent { }
