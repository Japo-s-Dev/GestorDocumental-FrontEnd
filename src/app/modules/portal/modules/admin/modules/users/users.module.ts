import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './components/home/users.component';
import { UsersModalComponent } from './components/users-modal/users-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AppModule } from '../../../../../../app.module';
import { SharedModule } from '../../../../../../shared/shared.module';

@NgModule({
  declarations: [
    UsersComponent,
    UsersModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    NgbModule,
    TranslateModule.forChild(),
    SharedModule
  ]
})
export class UsersModule { }
