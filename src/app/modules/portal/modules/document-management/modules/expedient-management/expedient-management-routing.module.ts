import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpedientListComponent } from './components/expedient-list/expedient-list.component';
import { ExpedientModalComponent } from './components/expedient-modal/expedient-modal.component';

const routes: Routes = [
  {
    path: '',
    component: ExpedientListComponent
  },
  {
    path: 'modal',
    component: ExpedientModalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpedientManagementRoutingModule { }
