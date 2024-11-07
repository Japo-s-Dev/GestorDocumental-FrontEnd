import { Component, OnInit } from '@angular/core';
import { IRole } from '../../interfaces/role.interface';
import { RolesCrudService } from '../../services/roles-crud.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';
import { ConfirmModalComponent } from '../../../../../../../../shared/confirm-modal/confirm-modal.component';
import { LoaderService } from '../../../../../../../../services/loader.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  roles: IRole[] = [];
  searchTerm: string = '';

  currentPage: number = 1;
  pageSize: number = 5;
  totalRoles: number = 0;
  isLastPage: boolean = false; // Indica si hemos llegado a la última página
  orderBy: string = '!id'; // Puedes cambiar esto para ordenar por otros campos

  // Alert properties
  alertVisible: boolean = false;
  alertTitle: string = '';
  alertMessage: string = '';
  alertType: string = 'alert-info';
  alertIcon: string = 'icon-info';

  constructor(
    private rolesCrudService: RolesCrudService,
    private modalService: NgbModal,
    private loaderService: LoaderService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loaderService.showLoader();
    this.loadRoles(); // Cargar los roles y total de registros directamente al inicio
  }

  loadRoles(): void {
    const offset = (this.currentPage - 1) * this.pageSize;
    this.rolesCrudService.listRoles(this.pageSize, offset, this.orderBy).subscribe(
      (response) => {
        if (response && response.body.result) {
          this.roles = response.body.result.items;
          this.totalRoles = response.body.result.total_count;

          // Verificamos si estamos en la última página
          if (this.roles.length < this.pageSize) {
            this.isLastPage = true;
          } else {
            this.isLastPage = false;
          }

          this.loaderService.hideLoader(); // Ocultamos el loader una vez cargados los datos
        }
      },
      (error) => {
        this.translate.get('roles:error_loading').subscribe((translatedText: string) => {
          this.translate.get('roles:error').subscribe((title: string) => {
            this.showAlert(title, translatedText, 'danger');
          });
        });
        this.loaderService.hideLoader(); // Ocultamos el loader incluso si hay error
      }
    );
  }

  openRoleModal(role: IRole | null = null): void {
    const modalRef = this.modalService.open(RolesModalComponent);
    modalRef.componentInstance.roleData = role || {};
    modalRef.componentInstance.isEditMode = !!role;

    modalRef.result.then((result) => {
      if (result) {
        this.loadRoles(); // Recalculamos el total de roles al crear o actualizar
        if (result === 'created') {
          this.loaderService.showLoader();
          this.translate.get('roles:created_success').subscribe((translatedText: string) => {
            this.translate.get('roles:aggregation').subscribe((title: string) => {
              this.showAlert(title, translatedText, 'success');
            });
          });
          setTimeout(() => {
            this.loaderService.hideLoader();
          }, 1000);
        } else if (result === 'updated') {
          this.loaderService.showLoader();
          this.translate.get('roles:updated_success').subscribe((translatedText: string) => {
            this.translate.get('roles:update').subscribe((title: string) => {
              this.showAlert(title, translatedText, 'warning');
            });
          });
          setTimeout(() => {
            this.loaderService.hideLoader();
          }, 1000);
        }
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
    this.translate.get('roles:confirm_delete', { roleName: role.role_name }).subscribe((translatedText: string) => {
      modalRef.componentInstance.message = translatedText;
    });

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.rolesCrudService.deleteRole(role.id).subscribe(
          () => {
            this.loaderService.showLoader();
            this.translate.get('roles:deleted_success').subscribe((translatedText: string) => {
              this.translate.get('roles:deletion').subscribe((title: string) => {
                this.showAlert(title, translatedText, 'info');
              });
            });
            this.loadRoles(); // Recalculamos el total de roles después de la eliminación
            setTimeout(() => {
              this.loaderService.hideLoader();
            }, 1000);
          },
          (error) => {
            this.loaderService.showLoader();
            this.translate.get('roles:delete_error').subscribe((translatedText: string) => {
              this.translate.get('roles:error').subscribe((title: string) => {
                this.showAlert(title, translatedText, 'danger');
              });
            });
            console.error('Error al eliminar el rol:', error);
            setTimeout(() => {
              this.loaderService.hideLoader();
            }, 1000);
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

  showAlert(title: string, message: string, type: 'success' | 'warning' | 'danger' | 'info'): void {
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertType = `alert-${type}`;
    this.alertIcon = `fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'times-circle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}`;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 7000);
  }

  handleAlertClosed(): void {
    this.alertVisible = false;
  }

  totalPages(): number {
    return Math.ceil(this.totalRoles / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages() && !this.isLastPage) {
      this.currentPage++;
      this.loaderService.showLoader();
      this.loadRoles();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loaderService.showLoader();
      this.loadRoles();
    }
  }

  sortBy(field: string): void {
    if (this.orderBy === field) {
      this.orderBy = `!${field}`; // Cambiar entre ascendente y descendente
    } else {
      this.orderBy = field;
    }
    this.loaderService.showLoader();
    this.loadRoles();
  }

  getSortIcon(field: string): string {
    if (this.orderBy === field) {
      return 'fa-sort-asc';
    } else if (this.orderBy === `!${field}`) {
      return 'fa-sort-desc';
    }
    return 'fa-sort';
  }
}
