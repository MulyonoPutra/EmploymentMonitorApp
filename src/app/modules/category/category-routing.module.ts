import { RouterModule, Routes } from '@angular/router';

import { CategoryComponent } from './category.component';
import { CategoryFormsComponent } from './pages/category-forms/category-forms.component';
import { CategoryListComponent } from './pages/category-list/category-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: CategoryComponent,
    children: [
      { path: 'forms', component: CategoryFormsComponent },
      { path: 'update/:id', component: CategoryFormsComponent },
      { path: 'list', component: CategoryListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
