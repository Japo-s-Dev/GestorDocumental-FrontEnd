import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StructuresComponent } from './components/home/structure.component';

const routes: Routes = [
  { path: '', component: StructuresComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructuresRoutingModule { }
