import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']  // Cambiado a "styleUrls" y como un array
})
export class NavbarComponent {

  showSearch = false;
  showAdd = false;

  constructor(
    private router: Router
  ) {}

  toggleAdd(path: string) {
    this.showAdd = !this.showAdd;
    if (this.showAdd && this.showSearch) { // Opcional: esconde otras opciones cuando una se expande
      this.showSearch = false;
    }
  }

  toggleSearch(path: string) {
    this.router.navigate([path]);
    this.showSearch = !this.showSearch;
    if (this.showAdd && this.showSearch) { // Opcional: esconde otras opciones cuando una se expande
      this.showAdd = false;
    }
  }

  navigate(path: string) {

  }
}
