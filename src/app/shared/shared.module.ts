// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [
    AlertComponent,
    ConfirmModalComponent],
  imports: [CommonModule],
  exports: [
    AlertComponent,
    ConfirmModalComponent
  ]
})
export class SharedModule { }
