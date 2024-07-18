import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFileHomeComponent } from './components/add-file-home/add-file-home.component';

const routes: Routes = [
  {
    path: 'file-entry',
    component: AddFileHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddRoutingModule { }
