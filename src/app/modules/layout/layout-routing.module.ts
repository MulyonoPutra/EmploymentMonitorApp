import { RouterModule, Routes } from '@angular/router';

import { AuthenticationGuard } from 'src/app/core/guards/authentication.guard';
import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'dashboard',
    component: LayoutComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'category',
    component: LayoutComponent,
    loadChildren: () =>
      import('../category/category.module').then((m) => m.CategoryModule),
    
  },
  {
    path: 'activity',
    component: LayoutComponent,
    loadChildren: () =>
      import('../activity/activity.module').then((m) => m.ActivityModule),
    canActivate: [AuthenticationGuard],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
