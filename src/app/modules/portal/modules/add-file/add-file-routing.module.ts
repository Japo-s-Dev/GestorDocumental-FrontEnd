import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFileHomeComponent } from './components/add-file-home/add-file-home.component';
import { UploadDocumentComponent } from './components/upload-document/upload-document.component';

const routes: Routes = [
  {
    path: 'file-entry',
    component: AddFileHomeComponent
  },
  {
    path: 'upload-document',
    component: UploadDocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddRoutingModule { }
