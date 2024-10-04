import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';

import { UserReportComponent } from './modules/user-report/components/user-report/user-report.component';
import { ActionsReportComponent } from './modules/actions-report/components/actions-report/actions-report.component';
import { StructuresReportComponent } from './modules/structures-report/components/structures-report/structures-report.component';

@NgModule({
  declarations: [
    UserReportComponent,
    ActionsReportComponent,
    StructuresReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
