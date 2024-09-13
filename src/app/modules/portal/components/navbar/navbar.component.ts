import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showSearch = false;
  showAdd = false;
  showAdmin = false;
  isAdmin = true;
  currentLanguage: string;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    this.currentLanguage = this.translate.getDefaultLang() || 'es';
    this.translate.setDefaultLang(this.currentLanguage);
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

  toggleAdmin(path: string) {
    this.showAdmin = !this.showAdmin;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.currentLanguage = language;
  }
}
