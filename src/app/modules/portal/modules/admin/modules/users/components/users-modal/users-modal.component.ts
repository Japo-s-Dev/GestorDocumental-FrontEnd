import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserCrudService } from '../../services/users-crud.service';
import { RolesCrudService } from '../../../roles/services/roles-crud.service';
import { IRole } from '../../../roles/interfaces/role.interface';
import { IUser } from '../../interfaces/user.interface';


@Component({
  selector: 'app-user-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.css']
})
export class UsersModalComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() userData: IUser | null = null;

  userForm!: FormGroup;
  showWarningAlert = false;
  alertMessage = '';

  existingUsers: IUser[] = [];
  roles: IRole[] = [];  // <-- Arreglo para almacenar los roles

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private userCrudService: UserCrudService,
    private rolesCrudService: RolesCrudService  // <-- Inyecta el servicio de roles
  ) { }

  ngOnInit(): void {
    // Obtener todos los usuarios para realizar las validaciones
    this.userCrudService.listUsers().subscribe(response => {
      if (response && response.body.result) {
        this.existingUsers = response.body.result;
      }
    });

    // Obtener todos los roles
    this.rolesCrudService.listRoles().subscribe(response => {
      if (response && response.body.result) {
        this.roles = response.body.result;
      }
    });

    this.userForm = this.fb.group({
      username: [this.userData?.username || '', [Validators.required, this.usernameExistsValidator.bind(this)]],
      password: ['', !this.isEditMode ? [Validators.required, this.passwordValidator] : []],
      confirmPassword: ['', !this.isEditMode ? Validators.required : []],
      email: [this.userData?.email || '', [Validators.required, Validators.email, this.emailExistsValidator.bind(this)]],
      assigned_role: [this.userData?.assigned_role || '', [Validators.required]]  // <-- Nuevo campo para el rol
    });
  }

  save() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      if (!this.isEditMode && formValue.password !== formValue.confirmPassword) {
        this.showAlert('Las contraseñas no coinciden');
        return;
      }

      const userData = {
        username: formValue.username,
        pwd_clear: formValue.password,
        email: formValue.email,
        assigned_role: formValue.assigned_role  // <-- Incluye el rol asignado
      };

      if (this.isEditMode) {
        this.userCrudService.updateUser(this.userData!.id, userData).subscribe(
          () => {
            this.activeModal.close('updated');
          },
          (error) => {
            this.showAlert('Error al actualizar el usuario');
            console.error('Error al actualizar el usuario', error);
          }
        );
      } else {
        this.userCrudService.createUser(userData).subscribe(
          () => {
            this.activeModal.close('created');
          },
          (error) => {
            this.showAlert('Error al crear el usuario');
            console.error('Error al crear el usuario', error);
          }
        );
      }
    } else {
      this.showAlert('Por favor, completa el formulario correctamente');
    }
  }

  close() {
    this.activeModal.dismiss();
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

  private usernameExistsValidator(control: FormControl) {
    if (this.existingUsers.some(user => user.username === control.value && this.userData?.username !== control.value)) {
      return { usernameExists: true };
    }
    return null;
  }

  private emailExistsValidator(control: FormControl) {
    if (this.existingUsers.some(user => user.email === control.value && this.userData?.email !== control.value)) {
      return { emailExists: true };
    }
    return null;
  }

  private passwordValidator = (control: FormControl) => {
    if (!this.isEditMode && control.value) {
      const password = control.value;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@$?]/.test(password);

      if (password.length < 8 || !hasUpperCase || !hasNumber || !hasSpecialChar) {
        return { passwordWeak: true };
      }
    }
    return null;
  }
}
