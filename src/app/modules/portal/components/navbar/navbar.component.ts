// NavbarComponent.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showSearch = false;
  showAdd = false;
  showAdmin = false;
  showReports = false; // Nuevo estado para mostrar/ocultar reportes
  isAdmin = false;
  username: string | null = null;
  currentLanguage: string;
  menuOpen: boolean = false;

  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
    this.currentLanguage = this.translate.getDefaultLang() || 'es';
    this.translate.setDefaultLang(this.currentLanguage);
  }

  ngOnInit(): void {
    const userStatus = localStorage.getItem('userStatus');
    if (userStatus) {
      const parsedStatus = JSON.parse(userStatus);
      this.username = parsedStatus.username;
      this.isAdmin = parsedStatus.role === 'ADMIN' || parsedStatus.role === 'ADMIN JUNIOR';
    }
  }

  toggleAdd(path: string) {
    this.showAdd = !this.showAdd;
    if (this.showAdd && this.showSearch) {
      this.showSearch = false;
    }
    this.closeMenuOnOptionClick(); // Cerrar menú al hacer clic
  }

  toggleSearch(path: string) {
    this.router.navigate([path]);
    this.showSearch = !this.showSearch;
    if (this.showAdd && this.showSearch) {
      this.showAdd = false;
    }
    this.closeMenuOnOptionClick(); // Cerrar menú al hacer clic
  }

  toggleAdmin() {
    this.showAdmin = !this.showAdmin;
    if (this.showAdmin) {
      this.showReports = false;
    }
    this.closeMenuOnOptionClick(); // Cerrar menú al hacer clic
  }

  toggleReports() {
    this.showReports = !this.showReports;
    if (this.showReports) {
      this.showAdmin = false;
    }
    this.closeMenuOnOptionClick(); // Cerrar menú al hacer clic
  }

  navigate(path: string) {
    this.router.navigate([path]);
    this.closeMenuOnOptionClick(); // Cerrar menú al hacer clic
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenuOnOptionClick() {
    // Si estamos en una pantalla pequeña y el menú está abierto, lo cerramos
    if (window.innerWidth <= 768) {
      this.menuOpen = false;
    }
  }
}
