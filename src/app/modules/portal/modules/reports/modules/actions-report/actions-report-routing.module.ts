import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionsReportComponent } from './components/actions-report/actions-report.component';

const routes: Routes = [
  {
    path: '',
    component: ActionsReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionsReportRoutingModule { }
