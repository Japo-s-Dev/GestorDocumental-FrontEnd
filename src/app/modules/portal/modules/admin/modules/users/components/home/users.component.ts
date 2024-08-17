import { Component, OnInit } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { UserCrudService } from '../../services/users-crud.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: IUser[] = [];
  searchTerm: string = '';

  constructor(
    private userCrudService: UserCrudService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Método para cargar los usuarios desde el servicio
  loadUsers(): void {
    this.userCrudService.listUsers().subscribe(
      (response) => {
        console.log(response)
        if (response && response.body.result) {
          this.users = response.body.result;

        }
      },
      (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
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
