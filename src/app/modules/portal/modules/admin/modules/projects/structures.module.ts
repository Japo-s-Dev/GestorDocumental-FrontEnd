import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from '../../../../../../shared/shared.module';
import { StructuresComponent } from './components/home/structure.component';
import { StructuresModalComponent } from './components/structures-modal/structures-modal.component';
import { StructuresRoutingModule } from './structures-routing.module';

// Función para cargar los archivos de traducción
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    StructuresComponent,
    StructuresModalComponent,
  ],
  imports: [
    CommonModule,
    StructuresRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class StructuresModule {}
