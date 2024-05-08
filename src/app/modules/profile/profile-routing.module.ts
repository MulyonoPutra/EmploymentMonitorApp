import { RouterModule, Routes } from '@angular/router';

import { FormEducationComponent } from './pages/profile-forms/components/form-education/form-education.component';
import { FormExperienceComponent } from './pages/profile-forms/components/form-experience/form-experience.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { ProfileDetailComponent } from './pages/profile-detail/profile-detail.component';
import { ProfileFormsComponent } from './pages/profile-forms/profile-forms.component';

const routes: Routes = [
	{
		path: '',
		component: ProfileComponent,
		children: [
			{ path: '', component: ProfileDetailComponent },
			{ path: 'update/:id', component: ProfileFormsComponent },
			{ path: 'education/:id', component: FormEducationComponent },
			{ path: 'education', component: FormEducationComponent },
			{ path: 'experience/:id', component: FormExperienceComponent },
			{ path: 'experience', component: FormExperienceComponent },
			{ path: '**', redirectTo: 'error/404' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ProfileRoutingModule {}
