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
  filters: any = {
    action: [],  // Mantiene las acciones seleccionadas como array
  };
  actionOptions = ['INSERT', 'UPDATE', 'DELETE', 'RESTORE', 'PHYSICAL DELETE'];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(filters: any = {}): void {
    const order_by = filters.order_by || 'timestamp'; // valor por defecto
    delete filters.order_by; // Eliminamos para no enviar como filtro

    this.reportService.listEvents(filters, order_by).subscribe((response) => {
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

  toggleActionSelection(action: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!this.filters.action.includes(action)) {
        this.filters.action.push(action);
      }
    } else {
      this.filters.action = this.filters.action.filter((a: string) => a !== action);
    }
  }

  searchReports(): void {
    const filters: any = {};

    if (this.filters.action.length > 0) {
      filters.action = { "$in": this.filters.action };
    }
    if (this.filters.object) {
      filters.object = { "$eq": this.filters.object };
    }
    if (this.filters.object_id) {
      filters.object_id = { "$eq": this.filters.object_id };
    }
    if (this.filters.fechaDesde && this.filters.fechaHasta) {
      filters.timestamp = {
        "$gte": this.formatRFC3339Date(this.filters.fechaDesde, 'start'),
        "$lt": this.formatRFC3339Date(this.filters.fechaHasta, 'end'),
      };
    } else if (this.filters.fechaDesde) {
      filters.timestamp = { "$gte": this.formatRFC3339Date(this.filters.fechaDesde, 'start') };
    } else if (this.filters.fechaHasta) {
      filters.timestamp = { "$lt": this.formatRFC3339Date(this.filters.fechaHasta, 'end') };
    }
    if (this.filters.username) {
      filters.username = { "$eq": this.filters.username };
    }

    filters.order_by = this.filters.order_by || 'timestamp'; // orden seleccionado

    this.loadEvents(filters);
  }

  resetFilters(): void {
    this.filters = { action: [] };
    this.loadEvents(); // Carga todos los eventos sin filtros
  }

  private formatRFC3339Date(date: string, time: 'start' | 'end'): string {
    const dateObj = new Date(date);
    if (time === 'start') {
      dateObj.setHours(0, 0, 0, 0); // Comienza a medianoche
    } else if (time === 'end') {
      dateObj.setUTCHours(23, 59, 59, 999); // Último momento del día en UTC
    }
    return dateObj.toISOString(); // Formato RFC3339 (ej. "2024-10-29T00:00:00.000Z")
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
