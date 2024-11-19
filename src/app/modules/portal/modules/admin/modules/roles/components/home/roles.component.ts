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
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit {
  roles: IRole[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10; // Configuración de elementos por página
  totalRoles: number = 0;
  isLastPage: boolean = false;
  orderBy: string = '!id';
  userRole: string | null = null;
  hasPrivilege6: boolean = false;

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
    this.loaderService.showLoader(); // Mostrar el loader al inicio
    const userStatus = localStorage.getItem('userStatus');
    const privileges = JSON.parse(localStorage.getItem('privileges') || '[]');
    this.hasPrivilege6 = privileges.includes(6);

    if (userStatus) {
      const parsedStatus = JSON.parse(userStatus);
      this.userRole = parsedStatus.role;
    }

    this.loadRoles(); // Cargar los roles
  }

  isRestrictedRole(role: IRole): boolean {
    return role.role_name === 'ADMIN' || role.role_name === this.userRole;
  }

  loadRoles(): void {
    const offset = (this.currentPage - 1) * this.pageSize;
    this.rolesCrudService.listRoles(this.pageSize, offset, this.orderBy).subscribe(
      (response) => {
        console.log('Roles:', response);
        if (response && response.body.result) {
          this.roles = response.body.result.items;
          this.totalRoles = response.body.result.total_count;
          this.isLastPage = this.roles.length < this.pageSize;
        }
        this.loaderService.hideLoader(); // Ocultar el loader al finalizar
      },
      (error) => {
        this.loaderService.hideLoader(); // Ocultar el loader incluso si hay error
        this.translate.get('roles:error_loading').subscribe((translatedText: string) => {
          this.translate.get('roles:error').subscribe((title: string) => {
            this.showAlert(title, translatedText, 'danger');
          });
        });
      }
    );
  }

  addRole(): void {
    const modalRef = this.modalService.open(RolesModalComponent);
    modalRef.componentInstance.isEditMode = false; // No es modo de edición
    modalRef.result
      .then((result) => {
        if (result) {
          this.loadRoles();
          if (result === 'created') {
            this.translate.get('roles:created_success').subscribe((translatedText: string) => {
              this.translate.get('roles:aggregation').subscribe((title: string) => {
                this.showAlert(title, translatedText, 'success');
              });
            });
          }
        }
      })
      .catch(() => {});
  }

  editRole(role: IRole): void {
    const modalRef = this.modalService.open(RolesModalComponent);
    modalRef.componentInstance.roleData = role;
    modalRef.componentInstance.isEditMode = true; // Establecer el modo de edición
    modalRef.result
      .then((result) => {
        if (result) {
          this.loadRoles();
          if (result === 'updated') {
            this.translate.get('roles:updated_success').subscribe((translatedText: string) => {
              this.translate.get('roles:update').subscribe((title: string) => {
                this.showAlert(title, translatedText, 'warning');
              });
            });
          }
        }
      })
      .catch(() => {});
  }

  deleteRole(role: IRole): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    this.translate.get('roles:confirm_delete', { roleName: role.role_name }).subscribe((translatedText: string) => {
      modalRef.componentInstance.message = translatedText;
    });

    modalRef.result
      .then((result) => {
        if (result === 'confirm') {
          this.rolesCrudService.deleteRole(role.id).subscribe(
            () => {
              this.loadRoles();
              this.translate.get('roles:deleted_success').subscribe((translatedText: string) => {
                this.translate.get('roles:deletion').subscribe((title: string) => {
                  this.showAlert(title, translatedText, 'info');
                });
              });
            },
            (error) => {
              this.translate.get('roles:delete_error').subscribe((translatedText: string) => {
                this.translate.get('roles:error').subscribe((title: string) => {
                  this.showAlert(title, translatedText, 'danger');
                });
              });
            }
          );
        }
      })
      .catch(() => {});
  }

  filteredRoles(): IRole[] {
    if (!this.searchTerm) return this.roles;
    return this.roles.filter((role) =>
      role.role_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sortBy(field: string): void {
    this.orderBy = this.orderBy === field ? `!${field}` : field;
    this.loadRoles();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages() && this.roles.length > 0) {
      this.currentPage++;
      this.loadRoles();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRoles();
    }
  }

  totalPages(): number {
    const totalPages = Math.ceil(this.totalRoles / this.pageSize);
    return totalPages > 0 ? totalPages : 1; // Asegurar que siempre haya al menos una página
  }


  getSortIcon(field: string): string {
    if (this.orderBy === field) return 'fa-sort-asc';
    if (this.orderBy === `!${field}`) return 'fa-sort-desc';
    return 'fa-sort';
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
}
