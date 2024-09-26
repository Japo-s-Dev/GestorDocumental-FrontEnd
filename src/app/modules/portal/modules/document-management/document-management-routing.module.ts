import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'expedient-list',
    pathMatch: 'full'
  },
  {
    path: 'expedient-list',
    loadChildren: () => import('./modules/expedient-management/expedient-management.module').then(m => m.ExpedientManagementModule)
  },
  {
    path: 'viewer',
    loadChildren: () => import('./modules/file-management/file-management.module').then(m => m.FileManagementModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentManagementRoutingModule { }
