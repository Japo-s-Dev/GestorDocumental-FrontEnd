import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './components/users/users.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { RolesComponent } from './components/roles/roles.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsersComponent,
    ProjectsComponent,
    RolesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
