import { Component, OnInit } from '@angular/core';
import { InactivityService } from './services/inactivity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GestorDocumental';

  constructor(private inactivityService: InactivityService) {}

  ngOnInit(): void {
    // El InactivityService se inicializa para monitorear la actividad del usuario
  }
}
