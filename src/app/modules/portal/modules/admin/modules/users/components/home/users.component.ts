import { Component, OnInit } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { UserCrudService } from '../../services/users-crud.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersModalComponent } from '../users-modal/users-modal.component';
import { ConfirmModalComponent } from '../../../../../../../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: IUser[] = [];
  searchTerm: string = '';

  // Alert properties
  alertVisible: boolean = false;
  alertTitle: string = '';
  alertMessage: string = '';
  alertType: string = 'alert-info';
  alertIcon: string = 'icon-info';

  constructor(
    private userCrudService: UserCrudService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userCrudService.listUsers().subscribe(
      (response) => {
        if (response && response.body.result) {
          this.users = response.body.result;
        }
      },
      (error) => {
        this.showAlert('Error', 'Error al obtener los usuarios.', 'danger');
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
          this.showAlert('Agregación', 'Usuario creado con éxito.', 'success');
        } else if (result === 'updated') {
          this.showAlert('Actualización', 'Usuario actualizado con éxito.', 'warning');
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
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = `¿Está seguro de querer eliminar al usuario "${user.username}"?`;
    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.userCrudService.deleteUser(user.id).subscribe(
          () => {
            this.showAlert('Eliminación', 'Usuario eliminado con éxito.', 'info');
            this.loadUsers(); // Recargar los usuarios después de eliminar
          },
          (error) => {
            this.showAlert('Error', 'Error al eliminar el usuario.', 'danger');
            console.error('Error al eliminar el usuario:', error);
          }
        );
      }
    }).catch((error) => {
      console.log('Modal dismissed', error);
    });
  }

  filteredUsers(): IUser[] {
    if (!this.searchTerm) {
      return this.users;
    }
    return this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(this.searchTerm.toLowerCase())
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
