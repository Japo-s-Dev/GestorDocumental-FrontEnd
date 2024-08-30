import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IRole } from '../../interfaces/role.interface';
import { RolesCrudService } from '../../services/roles-crud.service';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() roleData: IRole | null = null;

  roleForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private rolesCrudService: RolesCrudService
  ) {}

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      role_name: [this.roleData?.role_name || '', [Validators.required]],
      description: [this.roleData?.description || '', [Validators.required]]
    });
  }

  save() {
    if (this.roleForm.valid) {
      const formValue = this.roleForm.value;

      if (this.isEditMode) {
        this.rolesCrudService.updateRole(this.roleData!.id, formValue).subscribe(
          () => {
            this.activeModal.close('updated');
          },
          (error) => {
            console.error('Error al actualizar el rol', error);
          }
        );
      } else {
        this.rolesCrudService.createRole(formValue).subscribe(
          () => {
            this.activeModal.close('created');
          },
          (error) => {
            console.error('Error al crear el rol', error);
          }
        );
      }
    }
  }

  close() {
    this.activeModal.dismiss();
  }
}
