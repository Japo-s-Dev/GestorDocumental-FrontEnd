import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentManagementRoutingModule } from './document-management-routing.module';
import { FileTreeComponent } from './components/file-tree/file-tree.component';
import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';
import { ExpedientListComponent } from './components/expedient-list/expedient-list.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { RouterModule } from '@angular/router';
import { ExpedientModalComponent } from './components/expedient-modal/expedient-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../shared/shared.module';
import { CommentsEventsComponent } from './components/comments-events/comments-events.component';


@NgModule({
  declarations: [
    FileTreeComponent,
    DocumentViewerComponent,
    CommentsEventsComponent,
    ExpedientListComponent,
    SafeUrlPipe,
    ExpedientModalComponent
  ],
  imports: [
    CommonModule,
    DocumentManagementRoutingModule,
    FormsModule,
    MatTreeModule,
    MatIconModule,
    NgxDocViewerModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
  ]
})
export class DocumentManagementModule { }
