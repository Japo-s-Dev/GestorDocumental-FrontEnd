import { Component, OnInit } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { UserCrudService } from './services/users-crud.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: IUser[] = [];
  searchTerm: string = '';
  showPassword: boolean[] = [];

  constructor(
    private userCrudService: UserCrudService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Método para cargar los usuarios desde el servicio
  loadUsers(): void {
    this.userCrudService.listUsers().subscribe(
      (response) => {
        console.log(response)
        //this.users = response; // Asigna los usuarios obtenidos del servicio
        //this.showPassword = new Array(this.users.length).fill(false); // Ajustar el array para la visibilidad de la contraseña
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }

  addUser(): void {
    // Lógica para agregar un usuario
    console.log('Agregar Usuario');
  }

  editUser(user: IUser): void {
    // Lógica para editar un usuario
    console.log('Editar Usuario', user);
  }

  deleteUser(user: IUser): void {
    // Lógica para eliminar un usuario
    console.log('Eliminar Usuario', user);
  }

  togglePasswordVisibility(index: number): void {
    this.showPassword[index] = !this.showPassword[index];
  }

  filteredUsers(): IUser[] {
    if (!this.searchTerm) {
      return this.users;
    }
    return this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
