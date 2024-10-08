import { Component, OnInit } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { UserCrudService } from '../../services/users-crud.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersModalComponent } from '../users-modal/users-modal.component';
import { ConfirmModalComponent } from '../../../../../../../../shared/confirm-modal/confirm-modal.component';
import { LoaderService } from '../../../../../../../../services/loader.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: IUser[] = [];
  searchTerm: string = '';
  loggedInUsername: string | null = null;

  // Alert properties
  alertVisible: boolean = false;
  alertTitle: string = '';
  alertMessage: string = '';
  alertType: string = 'alert-info';
  alertIcon: string = 'icon-info';

  constructor(
    private userCrudService: UserCrudService,
    private modalService: NgbModal,
    private loaderService: LoaderService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.loaderService.showLoader();
    this.loadUsers();
    setTimeout(() => {
      this.loaderService.hideLoader();
    }, 2000);

    const userStatus = localStorage.getItem('userStatus');
    if (userStatus) {
      const parsedStatus = JSON.parse(userStatus);
      this.loggedInUsername = parsedStatus.username;
    }
  }

  loadUsers(): void {
    this.userCrudService.listUsers().subscribe(
      (response) => {
        if (response && response.body.result) {
          this.users = response.body.result;
        }
      },
      (error) => {
        this.translate.get('users:error_loading_title').subscribe((title: string) => {
          this.translate.get('users:error_loading_message').subscribe((message: string) => {
            this.showAlert({ title, message }, 'danger');
          });
        });
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  openUserModal(user: IUser | null = null): void {
    const modalRef = this.modalService.open(UsersModalComponent);
    modalRef.componentInstance.userData = user || {};
    modalRef.componentInstance.isEditMode = !!user;

    modalRef.result.then((result) => {
      if (result) {
        this.loadUsers();
        if (result === 'created') {
          this.translate.get('users:add_success_title').subscribe((title: string) => {
            this.translate.get('users:add_success_message').subscribe((message: string) => {
              this.showAlert({ title, message }, 'success');
            });
          });
          this.loaderService.showLoader();
          setTimeout(() => {
            this.loaderService.hideLoader();
          }, 1000);
        } else if (result === 'updated') {
          this.translate.get('users:update_success_title').subscribe((title: string) => {
            this.translate.get('users:update_success_message').subscribe((message: string) => {
              this.showAlert({ title, message }, 'warning');
            });
          });
          this.loaderService.showLoader();
          setTimeout(() => {
            this.loaderService.hideLoader();
          }, 1000);
        }
      }
    }).catch((error) => {
      console.log('Modal dismissed', error);
    });
  }

  addUser(): void {
    this.openUserModal();
  }

  editUser(user: IUser): void {
    this.openUserModal(user);
  }

  deleteUser(user: IUser): void {
    if (user.username === this.loggedInUsername) {
      this.translate.get('users:delete_error_logged_in_title').subscribe((title: string) => {
        this.translate.get('users:delete_error_logged_in_message').subscribe((message: string) => {
          this.showAlert({ title, message }, 'danger');
        });
      });
      return;
    }
    this.translate.get('users:confirm_delete', { username: user.username }).subscribe((translatedText: string) => {
      const modalRef = this.modalService.open(ConfirmModalComponent);
      modalRef.componentInstance.message = translatedText;

      modalRef.result.then((result) => {
        if (result === 'confirm') {
          this.userCrudService.deleteUser(user.id).subscribe(
            () => {
              this.translate.get('users:delete_success_title').subscribe((title: string) => {
                this.translate.get('users:delete_success_message').subscribe((message: string) => {
                  this.showAlert({ title, message }, 'info');
                });
              });
              this.loaderService.showLoader();
              this.loadUsers(); // Recargar los usuarios después de eliminar
              setTimeout(() => {
                this.loaderService.hideLoader();
              }, 1000);
            },
            (error) => {
              this.translate.get('users:error_deleting_title').subscribe((title: string) => {
                this.translate.get('users:error_deleting_message').subscribe((message: string) => {
                  this.showAlert({ title, message }, 'danger');
                });
              });
              this.loaderService.showLoader();
              setTimeout(() => {
                this.loaderService.hideLoader();
              }, 1000);
            }
          );
        }
      }).catch((error) => {
        console.log('Modal dismissed', error);
      });
    });
  }

  filteredUsers(): IUser[] {
    if (!this.searchTerm) {
      return this.users;
    }
    return this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.assigned_role?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  showAlert(translatedText: any, type: 'success' | 'warning' | 'danger' | 'info'): void {
    this.alertTitle = translatedText.title;
    this.alertMessage = translatedText.message;
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
