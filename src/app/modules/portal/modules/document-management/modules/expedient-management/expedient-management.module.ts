import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpedientManagementRoutingModule } from './expedient-management-routing.module';
import { ExpedientListComponent } from './components/expedient-list/expedient-list.component';
import { ExpedientModalComponent } from './components/expedient-modal/expedient-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../../../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    ExpedientListComponent,
    ExpedientModalComponent
  ],
  imports: [
    CommonModule,
    ExpedientManagementRoutingModule,
    CommonModule,
    FormsModule,
    RouterModule,
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
export class ExpedientManagementModule { }
