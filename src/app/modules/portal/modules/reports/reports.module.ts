import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';

import { UserReportComponent } from './modules/user-report/components/user-report/user-report.component';
import { ActionsReportComponent } from './modules/actions-report/components/actions-report/actions-report.component';
import { StructuresReportComponent } from './modules/structures-report/components/structures-report/structures-report.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Función necesaria para cargar los archivos de traducción
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    UserReportComponent,
    ActionsReportComponent,
    StructuresReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class ReportsModule { }
