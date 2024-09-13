import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpedientListComponent } from './components/expedient-list/expedient-list.component';
import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'expedient-list',
    pathMatch: 'full'
  },
  {
    path: 'expedient-list',
    component: ExpedientListComponent
  },
  {
    path: 'viewer/:id',
    component: DocumentViewerComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentManagementRoutingModule { }
