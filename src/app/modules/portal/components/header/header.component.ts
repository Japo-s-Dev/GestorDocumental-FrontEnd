import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouteLabels } from '../../../../core/route-labels';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentLabel: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Inicializa la etiqueta tan pronto como el componente cargue
    this.updateLabel(this.router.url);

    // Escucha los cambios de ruta y actualiza la etiqueta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLabel(this.router.url);
    });
  }

  private updateLabel(url: string) {
    // Asegúrate de usar una función para limpiar o ajustar la URL si es necesario
    this.currentLabel = RouteLabels[url] || 'Page Not Found';
  }
}
