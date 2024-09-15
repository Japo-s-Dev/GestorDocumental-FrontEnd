import { Component, OnInit } from '@angular/core';
import { ExpedientService } from '../../services/expedient.service';
import { ValueService } from '../../services/value.service';
import { IndexService } from '../../services/index.service';
import { Expedient, Index, Value } from '../../interfaces/services.interface';


@Component({
  selector: 'app-expedient-list',
  templateUrl: './expedient-list.component.html',
  styleUrls: ['./expedient-list.component.css']
})
export class ExpedientListComponent implements OnInit {
  projects: any[] = [];
  selectedProject: number = 13;
  expedients: Expedient[] = [];
  indices: Index[] = [];
  values: Value[] = [];
  tableHeaders: string[] = [];
  tableData: { [key: string]: any }[] = [];

  constructor(
    private expedientService: ExpedientService,
    private indexService: IndexService,
    private valueService: ValueService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projects = [
      { id: 13, name: 'Prueba' },
      { id: 2, name: 'Proyecto 2' },
    ];
  }

  onProjectChange(projectId: number): void {
    this.selectedProject = projectId;
    this.fetchIndices(projectId);
    this.fetchExpedients(projectId);
  }

  fetchIndices(projectId: number): void {
    this.indexService.listIndices(projectId).subscribe((response) => {
      if (response && response.body.result) {
        this.indices = response.body.result as Index[];
        this.tableHeaders = this.indices.map((index) => index.index_name);
      }
    });
  }

  fetchExpedients(projectId: number): void {
    this.expedientService.listArchives(projectId).subscribe((response) => {
      if (response && response.body.result) {
        this.expedients = response.body.result as Expedient[];
        this.fetchValues();
      }
    });
  }

  fetchValues(): void {
    if (!this.expedients.length || !this.indices.length) return;

    this.valueService.listValues().subscribe((response) => {
      if (response && response.body.result) {
        this.values = response.body.result as Value[];
        this.buildTableData();
      }
    });
  }

  buildTableData(): void {
    this.tableData = this.expedients.map((expedient) => {
      const row: { [key: string]: any } = { expedienteId: expedient.id };

      this.indices.forEach((index) => {
        const value = this.values.find(
          (val) => val.index_id === index.id && val.archive_id === expedient.id
        );
        row[index.index_name] = value ? value.value : '';
      });

      return row;
    });
  }
}
