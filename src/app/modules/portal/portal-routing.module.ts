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
        path: '',
        component: HomePortalComponent,
        pathMatch: 'full'
      },

      {
        path: 'add',
        loadChildren: () => import('./modules/add-file/add-file.module').then(m => m.AddFileModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'document-management',
        loadChildren: () => import('./modules/document-management/document-management.module').then(m => m.DocumentManagementModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
