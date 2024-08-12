import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ParameterManagerService } from '../../services/parameter-manager.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../interfaces/login-request.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;
  showWarningAlert = false;  // Para controlar la visibilidad de la alerta
  alertMessage = '';         // Para mostrar el mensaje en la alerta

  toggleVisibility(): void {
    this.hide = !this.hide;
  }

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private parameterManager: ParameterManagerService,
    private router: Router
  ) { }

  ngOnInit() { }

  login() {
    const loginRequest: LoginRequest = {
      username: this.loginForm.value.username ?? '',
      pwd: this.loginForm.value.password ?? ''
    };
    console.log(loginRequest);
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
          this.showAlert('Credenciales incorrectas');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.showAlert('Credenciales incorrectas');
      }
    });
  }

  showAlert(message: string): void {
    this.alertMessage = message;
    this.showWarningAlert = true;

    setTimeout(() => {
      this.closeAlert();
    }, 10000); // La alerta se ocultará automáticamente después de 5 segundos
  }

  closeAlert(): void {
    this.showWarningAlert = false;
  }
}
