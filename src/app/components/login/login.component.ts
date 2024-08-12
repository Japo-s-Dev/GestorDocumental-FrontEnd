import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ParameterManagerService } from '../../services/parameter-manager.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../interfaces/login-request.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;
  showWarningAlert = false;
  alertMessage = '';
  currentLanguage: string;

  constructor(
    private authService: AuthService,
    private parameterManager: ParameterManagerService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.currentLanguage = this.translate.getDefaultLang() || 'es';
    this.translate.setDefaultLang(this.currentLanguage);
  }

  toggleVisibility(): void {
    this.hide = !this.hide;
  }

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnInit() {}

  login() {
    const loginRequest: LoginRequest = {
      username: this.loginForm.value.username ?? '',
      pwd: this.loginForm.value.password ?? ''
    };
    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        if (response.result && response.result.success) {
          this.parameterManager.sendParameters({
            userStatus: {
              username: response.result.username
            }
          });
          this.router.navigate(['/portal']);
        } else {
          this.showAlert(this.translate.instant('alert:login_error'));
        }
      },
      error: (error: HttpErrorResponse) => {
        this.showAlert(this.translate.instant('alert:login_error'));
      }
    });
  }

  showAlert(message: string): void {
    this.alertMessage = message;
    this.showWarningAlert = true;

    setTimeout(() => {
      this.closeAlert();
    }, 10000);
  }

  closeAlert(): void {
    this.showWarningAlert = false;
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.currentLanguage = language;
  }
}
