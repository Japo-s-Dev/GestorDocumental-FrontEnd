// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AlertComponent,
    ConfirmModalComponent,
    LoaderComponent],
  imports: [CommonModule],
  exports: [
    AlertComponent,
    ConfirmModalComponent,
    LoaderComponent
  ]
})
export class SharedModule { }
