import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../../../../../../services/loader.service';
import { ConfirmModalComponent } from '../../../../../../../../shared/confirm-modal/confirm-modal.component';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';
import { RolesCrudService } from '../../services/roles-crud.service';
import { IRole } from '../../interfaces/role.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  roles: IRole[] = [];
  searchTerm: string = '';

  constructor(
    private rolesCrudService: RolesCrudService,
    private modalService: NgbModal,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loaderService.showLoader();
    this.loadRoles();
    setTimeout(() => {
      this.loaderService.hideLoader();
    }, 2000);
  }

  loadRoles(): void {
    this.rolesCrudService.listRoles().subscribe(
      (response) => {
        if (response && response.body.result) {
          this.roles = response.body.result;
          console.log('Roles:', this.roles);
        }
      },
      (error) => {
        console.error('Error al obtener los roles:', error);
      }
    );
  }

  openRoleModal(role: IRole | null = null): void {
    const modalRef = this.modalService.open(RolesModalComponent);
    modalRef.componentInstance.roleData = role || {};
    modalRef.componentInstance.isEditMode = !!role;

    modalRef.result.then((result) => {
      if (result) {
        this.loadRoles();
      }
    }).catch((error) => {
      console.log('Modal dismissed', error);
    });
  }

  addRole(): void {
    this.openRoleModal();
  }

  editRole(role: IRole): void {
    this.openRoleModal(role);
  }

  deleteRole(role: IRole): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = `¿Está seguro de querer eliminar el rol "${role.role_name}"?`;
    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.rolesCrudService.deleteRole(role.id).subscribe(
          () => {
            this.loadRoles(); // Recargar los roles después de eliminar
          },
          (error) => {
            console.error('Error al eliminar el rol:', error);
          }
        );
      }
    }).catch((error) => {
      console.log('Modal dismissed', error);
    });
  }

  filteredRoles(): IRole[] {
    if (!this.searchTerm) {
      return this.roles;
    }
    return this.roles.filter(role =>
      role.role_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
