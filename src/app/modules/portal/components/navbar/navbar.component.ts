import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showSearch = false;
  showAdd = false;
  showAdmin = false; // Añadido para controlar el despliegue del menú de admin
  isAdmin = true; // Simulación de que el usuario es administrador

  constructor(private router: Router) {}

  toggleAdd(path: string) {
    this.showAdd = !this.showAdd;
    if (this.showAdd && this.showSearch) {
      this.showSearch = false;
    }
  }

  toggleSearch(path: string) {
    this.router.navigate([path]);
    this.showSearch = !this.showSearch;
    if (this.showAdd && this.showSearch) {
      this.showAdd = false;
    }
  }

  toggleAdmin(path: string) {
    this.showAdmin = !this.showAdmin;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
