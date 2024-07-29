import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { SearchCriteriaComponent } from './components/search-criteria/search-criteria.component';
import { SearchRoutingModule } from './search-routing.module';
import { SearchResultComponent } from './components/search-result/search-result.component';

@NgModule({
  declarations: [SearchCriteriaComponent, SearchResultComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,
    SearchRoutingModule
  ]
})
export class SearchModule { }
