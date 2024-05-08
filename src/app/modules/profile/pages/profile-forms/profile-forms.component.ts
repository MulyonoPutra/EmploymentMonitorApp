import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { FormUserComponent } from './components/form-user/form-user.component';

@Component({
	selector: 'app-profile-forms',
	standalone: true,
	imports: [CardModule, CommonModule, AccordionModule, FormUserComponent],
	templateUrl: './profile-forms.component.html',
	styleUrls: ['./profile-forms.component.scss'],
})
export class ProfileFormsComponent implements OnInit {
	ngOnInit(): void {}
}
