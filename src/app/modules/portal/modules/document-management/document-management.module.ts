import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentManagementRoutingModule } from './document-management-routing.module';
import { ExpedientManagementModule } from './modules/expedient-management/expedient-management.module';
import { FileManagementModule } from './modules/file-management/file-management.module';
import { SearchModule } from './modules/search/search.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DocumentManagementRoutingModule,
    ExpedientManagementModule,
    FileManagementModule,
    SearchModule,
  ]
})
export class DocumentManagementModule { }
