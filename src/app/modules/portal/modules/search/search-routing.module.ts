import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchCriteriaComponent } from './components/search-criteria/search-criteria.component';
import { SearchResultComponent } from './components/search-result/search-result.component';

const routes: Routes = [
  {
    path: '', // Usa una cadena vacía para la ruta por defecto del módulo 'search'
    component: SearchCriteriaComponent
  },
  {
    path: 'result', // Usa una cadena vacía para la ruta por defecto del módulo 'search'
    component: SearchResultComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
