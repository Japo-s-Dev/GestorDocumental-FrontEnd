import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { HomePortalComponent } from './components/home-portal/home-portal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomePortalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormlyModule.forRoot({
      types: [
        { name: 'text', extends: 'input' }, // Extiende el tipo input por defecto para text
        { name: 'date', extends: 'input' }  // Configura también el tipo date
      ]
    }),
    FormlyBootstrapModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
