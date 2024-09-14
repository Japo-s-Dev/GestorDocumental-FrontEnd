import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RolesCrudService } from '../../services/roles-crud.service';
import { IRole } from '../../interfaces/role.interface';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() roleData: IRole | null = null;

  roleForm!: FormGroup;
  showWarningAlert = false;
  alertMessage = '';
  existingRoles: IRole[] = [];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private rolesCrudService: RolesCrudService
  ) {}

  ngOnInit(): void {
    // Obtener todos los roles para las validaciones
    this.rolesCrudService.listRoles().subscribe(response => {
      if (response && response.body.result) {
        this.existingRoles = response.body.result;
      }
    });

    this.roleForm = this.fb.group({
      role_name: [
        this.roleData?.role_name || '',
        [Validators.required, this.adminNameValidator, this.duplicateNameValidator.bind(this)]
      ],
      description: [
        this.roleData?.description || '',
        [Validators.required, Validators.maxLength(60)]
      ]
    });
  }

  save() {
    // Marca todos los controles como tocados para activar las validaciones visuales al intentar guardar
    this.roleForm.markAllAsTouched();

    if (this.roleForm.valid) {
      const formValue = this.roleForm.value;

      const roleData = {
        role_name: formValue.role_name,
        description: formValue.description
      };

      if (this.isEditMode) {
        this.rolesCrudService.updateRole(this.roleData!.id, roleData).subscribe(
          () => {
            this.activeModal.close('updated');
          },
          (error) => {
            this.showAlert('Error al actualizar el rol');
            console.error('Error al actualizar el rol', error);
          }
        );
      } else {
        this.rolesCrudService.createRole(roleData).subscribe(
          () => {
            this.activeModal.close('created');
          },
          (error) => {
            this.showAlert('Error al crear el rol');
            console.error('Error al crear el rol', error);
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

  // Validación para no permitir "ADMIN" como nombre de rol
  private adminNameValidator(control: FormControl) {
    if (control.value.toUpperCase() === 'ADMIN') {
      return { adminNameNotAllowed: true };
    }
    return null;
  }

  // Validación para evitar duplicados de nombres de roles
  private duplicateNameValidator(control: FormControl) {
    if (
      this.existingRoles.some(
        role => role.role_name.toLowerCase() === control.value.toLowerCase() &&
        this.roleData?.role_name !== control.value
      )
    ) {
      return { duplicateName: true };
    }
    return null;
  }
}
