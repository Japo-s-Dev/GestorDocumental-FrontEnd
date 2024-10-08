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
  }

  toggleSearch(path: string) {
    this.router.navigate([path]);
    this.showSearch = !this.showSearch;
    if (this.showAdd && this.showSearch) {
      this.showAdd = false;
    }
  }

  toggleAdmin() {
    this.showAdmin = !this.showAdmin;
    if (this.showAdmin) {
      this.showReports = false; // Oculta los reportes si se muestran las opciones de Admin
    }
  }

  toggleReports() {
    this.showReports = !this.showReports;
    if (this.showReports) {
      this.showAdmin = false; // Oculta las opciones de Admin si se muestran los reportes
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

}
