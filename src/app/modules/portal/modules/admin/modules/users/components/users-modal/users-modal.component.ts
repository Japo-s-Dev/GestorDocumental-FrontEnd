import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserCrudService } from '../../services/users-crud.service';
import { RolesCrudService } from '../../../roles/services/roles-crud.service';
import { IRole } from '../../../roles/interfaces/role.interface';
import { IUser } from '../../interfaces/user.interface';
import { TranslateService } from '@ngx-translate/core';

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
  roles: IRole[] = [];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private userCrudService: UserCrudService,
    private rolesCrudService: RolesCrudService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.userCrudService.listUsers().subscribe(response => {
      if (response && response.body.result) {
        this.existingUsers = response.body.result.items;
      }
    });

    this.rolesCrudService.listRoles().subscribe(response => {
      if (response && response.body.result) {
        this.roles = response.body.result.items.filter((role: IRole) => role.role_name.toUpperCase() !== 'ADMIN');
      }
    });

    this.userForm = this.fb.group({
      username: [this.userData?.username || '', [this.usernameExistsValidator.bind(this)]],
      password: [''],
      confirmPassword: [''],
      email: [this.userData?.email || '', [this.emailExistsValidator.bind(this)]],
      assigned_role: [this.userData?.assigned_role || '']
    });
  }

  save() {
    const formValue = this.userForm.value;

    if (!this.isEditMode && formValue.password !== formValue.confirmPassword) {
      this.translate.get('users:password_mismatch').subscribe((translatedText: string) => {
        this.showAlert(translatedText);
      });
      return;
    }

    const userData = {
      username: formValue.username,
      pwd_clear: formValue.password,
      email: formValue.email,
      assigned_role: formValue.assigned_role
    };

    if (this.isEditMode) {
      this.userCrudService.updateUser(this.userData!.id, userData).subscribe(
        () => {
          this.activeModal.close('updated');
        },
        (error) => {
          this.translate.get('users:update_error').subscribe((translatedText: string) => {
            this.showAlert(translatedText);
          });
          console.error('Error al actualizar el usuario', error);
        }
      );
    } else {
      this.userCrudService.createUser(userData).subscribe(
        () => {
          this.activeModal.close('created');
        },
        (error) => {
          this.translate.get('users:create_error').subscribe((translatedText: string) => {
            this.showAlert(translatedText);
          });
          console.error('Error al crear el usuario', error);
        }
      );
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
}
