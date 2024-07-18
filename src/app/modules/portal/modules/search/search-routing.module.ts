import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchCriteriaComponent } from './components/search-criteria/search-criteria.component';

const routes: Routes = [
  {
    path: '', // Usa una cadena vacía para la ruta por defecto del módulo 'search'
    component: SearchCriteriaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
