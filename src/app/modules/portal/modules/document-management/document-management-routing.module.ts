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
  },
  {
    path: 'search',
    loadChildren: () => import('./modules/search/search.module').then(m => m.SearchModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentManagementRoutingModule { }
