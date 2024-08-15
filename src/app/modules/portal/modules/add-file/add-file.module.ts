import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFileHomeComponent } from './components/add-file-home/add-file-home.component';
import { AddRoutingModule } from './add-file-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UploadDocumentComponent } from './components/upload-document/upload-document.component';

// Función necesaria para cargar los archivos de traducción
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AddFileHomeComponent,
    UploadDocumentComponent
  ],
  imports: [
    CommonModule,
    AddRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class AddFileModule { }
