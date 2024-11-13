import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { EventData } from '../../interfaces/report.interface';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  events: EventData[] = [];
  filters: any = {};  // Objeto para almacenar los filtros
  actionOptions = ['INSERT', 'UPDATE', 'DELETE', 'RESTORE', 'PHYSICAL DELETE'];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(filters: any = {}): void {
    this.reportService.listEvents(filters).subscribe((response) => {
      const items = response.body?.result;
      if (Array.isArray(items)) {
        this.events = items.map((item: any) => ({
          action: item.action,
          object: item.object,
          object_id: item.object_id,
          old_data: item.old_data,
          new_data: item.new_data,
          timestamp: this.formatDate(item.timestamp),
          username: item.username || 'Desconocido',
        }));
      } else {
        console.error('Expected an array in response.body.result, but received:', items);
      }
    }, (error) => {
      console.error('Error loading events:', error);
    });
  }

  searchReports(): void {
    // Construye los filtros usando operadores específicos
    const filters: any = {};

    if (this.filters.action && this.filters.action.length > 0) {
      filters.action = { "$in": this.filters.action };
    }
    if (this.filters.object) {
      filters.object = { "$eq": this.filters.object };
    }
    if (this.filters.object_id) {
      filters.object_id = { "$eq": this.filters.object_id };
    }
    if (this.filters.timestamp) {
      filters.timestamp = { "$gte": this.filters.timestamp };
    }
    if (this.filters.username) {
      filters.username = { "$eq": this.filters.username };
    }

    // Llama a loadEvents con los filtros definidos
    this.loadEvents(filters);
  }

  resetFilters(): void {
    this.filters = {};
    this.loadEvents(); // Carga todos los eventos sin filtros
  }

  formatChanges(oldData: any, newData: any, object: string): string {
    const changes: string[] = [];
    for (const key in newData) {
      if (newData[key] !== oldData?.[key] && this.isRelevantKey(key, object)) {
        const oldVal = oldData?.[key] !== undefined ? this.formatValue(oldData[key], key) : 'N/A';
        const newVal = newData[key] !== undefined ? this.formatValue(newData[key], key) : 'N/A';
        changes.push(`${key}: ${oldVal} → ${newVal}`);
      }
    }
    return changes.join(', ');
  }

  formatNewData(newData: any, object: string): string {
    const formattedData: string[] = [];
    for (const key in newData) {
      if (newData[key] !== null && newData[key] !== undefined && this.isRelevantKey(key, object)) {
        formattedData.push(`${key}: ${this.formatValue(newData[key], key)}`);
      }
    }
    return formattedData.join(', ');
  }

  formatOldData(oldData: any, object: string): string {
    const formattedData: string[] = [];
    for (const key in oldData) {
      if (oldData[key] !== null && oldData[key] !== undefined && this.isRelevantKey(key, object)) {
        formattedData.push(`${key}: ${this.formatValue(oldData[key], key)}`);
      }
    }
    return formattedData.join(', ');
  }

  private isRelevantKey(key: string, object: string): boolean {
    const relevantKeys: { [key: string]: string[] } = {
      index: ['index_name'],
      archive: ['tag', 'mtime'],
      value: ['value', 'mtime'],
      role: ['role_name', 'description'],
      user: ['username', 'email', 'assigned_role', 'pwd'],
      separator: ['name'],
      structure: ['project_name'],
      document: ['name', 'doc_type']
    };
    return relevantKeys[object]?.includes(key) || false;
  }

  private formatValue(value: any, key: string): string {
    if (key === 'mtime' || key === 'ctime' || key === 'timestamp') {
      return this.formatDate(value);
    }
    return value;
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    });
  }
}
