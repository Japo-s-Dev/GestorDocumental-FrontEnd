import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { SearchCriteriaComponent } from './components/search-criteria/search-criteria.component';
import { SearchRoutingModule } from './search-routing.module';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Función necesaria para cargar los archivos de traducción
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [SearchCriteriaComponent, SearchResultComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,
    SearchRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class SearchModule { }
