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
  userMenuOpen: boolean = false; // Controla si el menú está abierto o cerrado
  username: string = 'demo1'; // Aquí deberías obtener el nombre del usuario real
  currentLanguage: string;

  constructor(private router: Router,
     private translate: TranslateService,
      private authService: AuthService,
      private loaderService: LoaderService
    ) {
      this.currentLanguage = this.translate.getDefaultLang() || 'es';
      this.translate.setDefaultLang(this.currentLanguage);
    }

  ngOnInit(): void {
    this.updateLabel(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLabel(this.router.url);
    });

    this.translate.onLangChange.subscribe(() => {
      this.updateLabel(this.router.url);
    });
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
    // Lógica para ver el perfil del usuario
    this.router.navigate(['/profile']);
  }

  logout(): void {
    const logOffRequest: LogOffRequest = {
      logoff: true,
    };

    this.authService.logoff(logOffRequest).subscribe({
      next: (response) => {
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
