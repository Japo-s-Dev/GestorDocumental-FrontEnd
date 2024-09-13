import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentManagementRoutingModule } from './document-management-routing.module';
import { FileTreeComponent } from './components/file-tree/file-tree.component';
import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';
import { ExpedientListComponent } from './components/expedient-list/expedient-list.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { SafeUrlPipe } from './pipes/safe-url.pipe';


@NgModule({
  declarations: [
    FileTreeComponent,
    DocumentViewerComponent,
    ExpedientListComponent,
    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    DocumentManagementRoutingModule,
    MatTreeModule,
    MatIconModule
  ]
})
export class DocumentManagementModule { }
