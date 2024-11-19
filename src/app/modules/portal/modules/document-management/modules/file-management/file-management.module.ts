import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagementRoutingModule } from './file-management-routing.module';
import { FileTreeComponent } from './components/file-tree/file-tree.component';
import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';
import { CommentsEventsComponent } from './components/comments-events/comments-events.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../../../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FolderModalComponent } from './components/folder-modal/folder-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UploadDocumentComponent } from './components/upload-document/upload-document.component';
import { RenameDocumentModalComponent } from './components/rename-document-modal/rename-document-modal.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    FileTreeComponent,
    DocumentViewerComponent,
    CommentsEventsComponent,
    SafeUrlPipe,
    FolderModalComponent,
    UploadDocumentComponent,
    RenameDocumentModalComponent
  ],
  imports: [
    CommonModule,
    FileManagementRoutingModule,
    FormsModule,
    MatTreeModule,
    MatIconModule,
    NgxDocViewerModule,
    RouterModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })

  ]
})
export class FileManagementModule { }
