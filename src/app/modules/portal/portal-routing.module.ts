import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrameComponent } from './components/frame/frame.component';
import { HomePortalComponent } from '../../components/home-portal/home-portal.component';

const routes: Routes = [
  {
    path: '',
    component: FrameComponent,
    children: [
      {
        path: '',  // Ruta predeterminada dentro de FrameComponent
        component: HomePortalComponent,  // Configura HomePortalComponent como predeterminado
        pathMatch: 'full'
      },
      {
        path: 'search', // Esta ruta ahora cargará el módulo 'search' de manera perezosa
        loadChildren: () => import('./modules/search/search.module').then(m => m.SearchModule)
      },
      {
        path: 'add', // Esta ruta ahora cargará el módulo 'search' de manera perezosa
        loadChildren: () => import('./modules/add-file/add-file.module').then(m => m.AddFileModule)
      },
      {
        path: 'admin', // Esta ruta ahora cargará el módulo 'admin' de manera perezosa
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }


