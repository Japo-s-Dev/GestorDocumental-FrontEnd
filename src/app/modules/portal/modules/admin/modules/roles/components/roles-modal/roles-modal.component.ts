import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RolesCrudService } from '../../services/roles-crud.service';
import { IRole } from '../../interfaces/role.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() roleData: IRole | null = null;

  roleForm!: FormGroup;
  privileges: any[] = []; // Lista de privilegios
  showWarningAlert = false;
  alertMessage = '';
  existingRoles: IRole[] = [];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private rolesCrudService: RolesCrudService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario
    this.roleForm = this.fb.group({
      role_name: [
        this.roleData?.role_name || '',
        [Validators.required, this.adminNameValidator, this.duplicateNameValidator.bind(this)]
      ],
      description: [
        this.roleData?.description || '',
        [Validators.required, Validators.maxLength(60)]
      ],
      privileges: this.fb.array([]) // FormArray para los privilegios
    });

    // Cargar todos los privilegios
    this.rolesCrudService.listPrivileges().subscribe(response => {
      if (response && response.body.result.items) {
        this.privileges = response.body.result.items;

        // Inicializa los controles en el FormArray para cada privilegio
        this.privileges.forEach(() => {
          this.privilegesArray.push(new FormControl(false));
        });

        // Si estamos en modo de edición, cargar los privilegios asociados al rol
        if (this.isEditMode && this.roleData?.role_name) {
          this.rolesCrudService.listRolePrivileges(this.roleData.role_name).subscribe(rolePrivilegesResponse => {
            if (rolePrivilegesResponse && rolePrivilegesResponse.body.result) {
              const rolePrivileges = rolePrivilegesResponse.body.result;

              // Actualizar los valores del FormArray según el estado de `is_enabled`
              this.privileges.forEach((privilege, index) => {
                const associatedPrivilege = rolePrivileges.find((p: any) => p.privilege_id === privilege.id);
                if (associatedPrivilege) {
                  this.privilegesArray.at(index).setValue(associatedPrivilege.is_enabled);
                }
              });
            }
          });
        }
      }
    });
  }

  get privilegesArray(): FormArray<FormControl> {
    return this.roleForm.get('privileges') as FormArray<FormControl>;
  }

  save() {
    this.roleForm.markAllAsTouched();

    if (this.roleForm.valid) {
      const formValue = this.roleForm.value;

      const roleData = {
        role_name: formValue.role_name,
        description: formValue.description
      };

      // Guarda los cambios (creación o edición) usando la estructura del servicio
      if (this.isEditMode) {
        this.rolesCrudService.updateRole(this.roleData!.id, roleData).subscribe(() => {
          this.activeModal.close('updated');
        }, error => {
          this.translate.get('roles:error_update_role').subscribe(translatedText => {
            this.showAlert(translatedText);
          });
          console.error('Error al actualizar el rol', error);
        });
      } else {
        this.rolesCrudService.createRole(roleData).subscribe(() => {
          this.activeModal.close('created');
        }, error => {
          this.translate.get('roles:error_create_role').subscribe(translatedText => {
            this.showAlert(translatedText);
          });
          console.error('Error al crear el rol', error);
        });
      }
    } else {
      this.translate.get('roles:form_error').subscribe(translatedText => {
        this.showAlert(translatedText);
      });
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

  private adminNameValidator(control: FormControl) {
    if (control.value?.toUpperCase() === 'ADMIN') {
      return { adminNameNotAllowed: true };
    }
    return null;
  }

  private duplicateNameValidator(control: FormControl) {
    if (this.isEditMode && this.roleData?.role_name.toLowerCase() === control.value.toLowerCase()) {
      return null;
    }

    if (this.existingRoles.some(
      role => role.role_name.toLowerCase() === control.value.toLowerCase()
    )) {
      return { duplicateName: true };
    }
    return null;
  }
}
