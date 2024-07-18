import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFileHomeComponent } from './components/add-file-home/add-file-home.component';
import { AddRoutingModule } from './add-file-routing.module';



@NgModule({
  declarations: [
    AddFileHomeComponent
  ],
  imports: [
    CommonModule,
    AddRoutingModule
  ]
})
export class AddFileModule { }
