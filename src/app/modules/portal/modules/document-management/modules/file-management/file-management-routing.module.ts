import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileTreeComponent } from './components/file-tree/file-tree.component';
import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';
import { CommentsEventsComponent } from './components/comments-events/comments-events.component';
import { UploadDocumentComponent } from './components/upload-document/upload-document.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentViewerComponent
  },
  {
    path: 'file-tree',
    component: FileTreeComponent
  },
  {
    path: 'comments-events',
    component: CommentsEventsComponent
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
export class FileManagementRoutingModule { }
