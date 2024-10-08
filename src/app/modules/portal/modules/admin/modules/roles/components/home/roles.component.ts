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
        }
      },
      (error) => {
        this.translate.get('roles:error_loading').subscribe((translatedText: string) => {
          this.translate.get('roles:error').subscribe((title: string) => {
            this.showAlert(title, translatedText, 'danger');
          });
        });
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
            this.loadRoles();
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
}
