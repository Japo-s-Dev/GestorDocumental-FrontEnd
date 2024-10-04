import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StructuresReportComponent } from './components/structures-report/structures-report.component';

const routes: Routes = [
  {
    path: '',
    component: StructuresReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructuresReportRoutingModule { }
