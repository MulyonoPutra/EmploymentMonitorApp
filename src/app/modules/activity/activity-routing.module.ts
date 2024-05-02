import { RouterModule, Routes } from '@angular/router';

import { ActivityComponent } from './activity.component';
import { ActivityFormsComponent } from './pages/activity-forms/activity-forms.component';
import { ActivityListComponent } from './pages/activity-list/activity-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: ActivityComponent,
    children: [
      { path: 'forms', component: ActivityFormsComponent },
      { path: 'update/:id', component: ActivityFormsComponent },
      { path: 'list', component: ActivityListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityRoutingModule { }
