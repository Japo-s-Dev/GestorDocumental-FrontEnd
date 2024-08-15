import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { RouteLabels } from '../../../../core/route-labels';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentLabel: string = '';

  constructor(private router: Router, private translate: TranslateService) {}

  ngOnInit(): void {
    // Inicializa la etiqueta tan pronto como el componente cargue
    this.updateLabel(this.router.url);

    // Escucha los cambios de ruta y actualiza la etiqueta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLabel(this.router.url);
    });

    // Escucha los cambios de idioma y actualiza la etiqueta
    this.translate.onLangChange.subscribe(() => {
      this.updateLabel(this.router.url);
    });
  }

  private updateLabel(url: string) {
    const labelKey = RouteLabels[url] || 'route:not_found';
    this.translate.get(labelKey).subscribe(translatedLabel => {
      this.currentLabel = translatedLabel;
    });
  }
}
