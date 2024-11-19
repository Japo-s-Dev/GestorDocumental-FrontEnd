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
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: IUser[] = [];
  searchTerm: string = '';
  loggedInUsername: string | null = null;

  // Paginación
  currentPage: number = 1;
  pageSize: number = 10;
  totalUsers: number = 0;
  isLastPage: boolean = false;
  orderBy: string = '!username';

  // Privilegios
  hasPrivilege2: boolean = false;

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
  ) {}

  ngOnInit(): void {
    this.loaderService.showLoader();
    const userStatus = localStorage.getItem('userStatus');
    const privileges = JSON.parse(localStorage.getItem('privileges') || '[]');
    this.hasPrivilege2 = privileges.includes(2);

    if (userStatus) {
      const parsedStatus = JSON.parse(userStatus);
      this.loggedInUsername = parsedStatus.username;
    }

    this.loadUsers();
  }

  loadUsers(): void {
    const offset = (this.currentPage - 1) * this.pageSize;
    this.userCrudService.listUsers(this.pageSize, offset, this.orderBy).subscribe(
      (response) => {
        if (response && response.body.result) {
          this.users = response.body.result.items;
          this.totalUsers = response.body.result.total_count;
          this.isLastPage = this.users.length < this.pageSize;
        }
        this.loaderService.hideLoader();
      },
      (error) => {
        this.translate.get('users:error_loading_title').subscribe((title: string) => {
          this.translate.get('users:error_loading_message').subscribe((message: string) => {
            this.showAlert({ title, message }, 'danger');
          });
        });
        this.loaderService.hideLoader();
      }
    );
  }

  totalPages(): number {
    return Math.ceil(this.totalUsers / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages() && !this.isLastPage) {
      this.currentPage++;
      this.loaderService.showLoader();
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loaderService.showLoader();
      this.loadUsers();
    }
  }

  sortBy(field: string): void {
    this.orderBy = this.orderBy === field ? `!${field}` : field;
    this.loadUsers();
  }

  getSortIcon(field: string): string {
    if (this.orderBy === field) return 'fa-sort-asc';
    if (this.orderBy === `!${field}`) return 'fa-sort-desc';
    return 'fa-sort';
  }

  openUserModal(user: IUser | null = null): void {
    if (!this.hasPrivilege2) return;
    const modalRef = this.modalService.open(UsersModalComponent);
    modalRef.componentInstance.userData = user || {};
    modalRef.componentInstance.isEditMode = !!user;

    modalRef.result.then((result) => {
      if (result) {
        this.loadUsers();
      }
    }).catch(() => {});
  }

  addUser(): void {
    this.openUserModal();
  }

  editUser(user: IUser): void {
    this.openUserModal(user);
  }

  deleteUser(user: IUser): void {
    if (!this.hasPrivilege2 || user.username === this.loggedInUsername) return;
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = `Are you sure you want to delete ${user.username}?`;

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.userCrudService.deleteUser(user.id).subscribe(() => {
          this.loadUsers();
        });
      }
    }).catch(() => {});
  }

  filteredUsers(): IUser[] {
    if (!this.searchTerm) return this.users;
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
