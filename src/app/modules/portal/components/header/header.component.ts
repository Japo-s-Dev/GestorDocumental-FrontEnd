import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { RouteLabels } from '../../../../core/route-labels';
import { LogOffRequest } from '../../../../interfaces/login-request.interface';
import { AuthService } from '../../../../services/auth.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentLabel: string = '';
  userMenuOpen: boolean = false;
  currentLanguage: string;
  username: string | null = null;
  userRole: string | null = null;
  usernameStyle: string = '';
  roleIcon: string = '';

  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private loaderService: LoaderService
  ) {
    // Intenta obtener el idioma guardado en localStorage, si no existe, usa 'es' por defecto
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'es';
    this.currentLanguage = savedLanguage;
    this.translate.setDefaultLang(savedLanguage);
    this.translate.use(savedLanguage);
  }

  ngOnInit(): void {
    this.updateLabel(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateLabel(this.router.url);
      });

    this.translate.onLangChange.subscribe(() => {
      this.updateLabel(this.router.url);
    });

    const userStatus = localStorage.getItem('userStatus');
    if (userStatus) {
      const parsedStatus = JSON.parse(userStatus);
      this.username = parsedStatus.username;
      this.userRole = parsedStatus.role;

      if (this.userRole === 'ADMIN') {
        this.usernameStyle = 'admin-style';
        this.roleIcon = 'fa-crown';
      } else if (this.userRole === 'ADMIN JUNIOR') {
        this.usernameStyle = 'admin-junior-style';
        this.roleIcon = 'fa-star';
      } else {
        this.usernameStyle = 'regular-user-style';
        this.roleIcon = '';
      }
    }
  }

  updateLabel(url: string) {
    const labelKey = RouteLabels[url] || 'route:not_found';
    this.translate.get(labelKey).subscribe(translatedLabel => {
      this.currentLabel = translatedLabel;
    });
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.currentLanguage = language;
    localStorage.setItem('selectedLanguage', language); // Guarda el idioma seleccionado en localStorage
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.user-menu-container');
    if (!clickedInside) {
      this.userMenuOpen = false;
    }
  }

  viewProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    const logOffRequest: LogOffRequest = { logoff: true };
    this.authService.logoff(logOffRequest).subscribe({
      next: () => {
        this.loaderService.showLoader();
        this.router.navigate(['/login']).then(() => {
          setTimeout(() => {
            this.loaderService.hideLoader();
          }, 2000);
        });
      },
      error: (error) => {
        console.error('Error during logoff:', error);
      }
    });
  }
}
