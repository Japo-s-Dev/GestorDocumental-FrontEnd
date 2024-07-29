// users.component.ts
import { Component, OnInit } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: IUser[] = [
    { username: 'admin', password: 'admin', role: 'admin' },
    { username: 'gabriel', password: 'password1', role: 'usuario' },
    { username: 'sergio', password: 'password2', role: 'usuario' },
    { username: 'andre', password: 'password3', role: 'usuario' },
    { username: 'nelson', password: 'password4', role: 'usuario' },
    { username: 'joaquin', password: 'password5', role: 'usuario' }
  ];

  searchTerm: string = '';
  showPassword: boolean[] = new Array(this.users.length).fill(false);

  constructor(

  ) { }

  ngOnInit(): void {
    // cargar los datos de los usuarios desde el backend cuando esté disponible
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
