import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserProfile } from '../../../domain/entities/user-profile';

@Component({
	selector: 'app-profile-menu',
	templateUrl: './profile-menu.component.html',
	styleUrls: ['./profile-menu.component.scss'],
	standalone: true,
	imports: [ClickOutsideDirective, NgClass, RouterLink],
})
export class ProfileMenuComponent implements OnInit {
	public isMenuOpen = false;

	@Input() user!: UserProfile;
	@Output() clicked = new EventEmitter<void>();

	logout(): void {
		this.clicked.emit();
	}

	constructor() {}

	ngOnInit(): void {}

	public toggleMenu(): void {
		this.isMenuOpen = !this.isMenuOpen;
	}
}
