import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'actions-report',
    loadChildren: () => import('./modules/actions-report/actions-report.module').then(m => m.ActionsReportModule)
  },
  {
    path: 'structures-report',
    loadChildren: () => import('./modules/structures-report/structures-report.module').then(m => m.StructuresReportModule)
  },
  {
    path: 'user-report',
    loadChildren: () => import('./modules/user-report/user-report.module').then(m => m.UserReportModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
