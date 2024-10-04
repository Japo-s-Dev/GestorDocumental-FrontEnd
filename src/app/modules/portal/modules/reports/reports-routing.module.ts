import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'actions',
    loadChildren: () => import('./modules/actions-report/actions-report.module').then(m => m.ActionsReportModule)
  },
  {
    path: 'structures',
    loadChildren: () => import('./modules/structures-report/structures-report.module').then(m => m.StructuresReportModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user-report/user-report.module').then(m => m.UserReportModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
