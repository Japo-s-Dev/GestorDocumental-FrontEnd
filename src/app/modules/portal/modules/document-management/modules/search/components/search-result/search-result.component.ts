import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IExpedient, IIndex, IValue } from '../../../../interfaces/services.interface';
import { LoaderService } from '../../../../../../../../services/loader.service';
import { ServicesService } from '../../../../services/services.service';
import { ConfirmModalComponent } from '../../../../../../../../shared/confirm-modal/confirm-modal.component';
import { SearchResultModalComponent } from '../search-result-modal/search-result-modal.component';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  expedients: IExpedient[] = [];
  indices: IIndex[] = [];
  values: IValue[] = [];
  tableHeaders: string[] = [];
  tableData: { [key: string]: any }[] = [];
  filteredData: { [key: string]: any }[] = [];

  selectedProject: number = 0;

  // Alert properties
  alertVisible: boolean = false;
  alertTitle: string = '';
  alertMessage: string = '';
  alertType: string = 'alert-info';
  alertIcon: string = 'icon-info';

  constructor(
    private router: Router,
    private service: ServicesService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    const storedResults = localStorage.getItem('searchResults');
    const storedProjectId = localStorage.getItem('selectedProject');


    if (storedResults && storedProjectId) {
      this.expedients = JSON.parse(storedResults);
      this.selectedProject = Number(storedProjectId);
      this.buildTable();
    } else {
      console.log('No se encontraron resultados.');
    }
  }

  openExpedientModal(expedientId?: number): void {
    const modalRef = this.modalService.open(SearchResultModalComponent);
    modalRef.componentInstance.isEditMode = !!expedientId;
    modalRef.componentInstance.expedientId = expedientId || 0;
    modalRef.componentInstance.projectId = this.selectedProject;
    modalRef.componentInstance.indices = this.indices;

    modalRef.result.then((result) => {
      if (result === 'created' || result === 'updated') {
        this.loadResults();
      }
    }).catch((error) => {
    });
  }


  buildTable(): void {
    this.loaderService.showLoader();
    this.fetchIndices(Number(this.selectedProject));
  }

  reloadTableBasedOnIndices(): void {
    const reloadCount = Math.floor(this.indices.length / 4) || 1;
    for (let i = 0; i < reloadCount; i++) {
      this.buildTable();
    }
  }

  fetchIndices(projectId: number): void {
    this.service.listIndices(Number(projectId)).subscribe((response) => {
      if (response && response.body.result) {
        this.indices = response.body.result as IIndex[];
        this.tableHeaders = ['id', ...this.indices.map((index) => index.index_name)];
        this.fetchValues();
        this.loaderService.hideLoader();
      }
    });
  }

  fetchValues(): void {

    if (!this.expedients.length || !this.indices.length) {
      this.loaderService.hideLoader();
      return;
    }

    this.service.listValues().subscribe((response) => {
      if (response && response.body.result) {
        this.values = response.body.result as IValue[];
        this.buildTableData();
        setTimeout(() => {
          this.loaderService.hideLoader();
        }, 1500);
      }
    });
  }

  buildTableData(): void {
    this.tableData = this.expedients.map((expedient) => {
      const row: { [key: string]: any } = { id: expedient.id };

      this.indices.forEach((index) => {
        const value = this.values.find(
          (val) => val.index_id === index.id && val.archive_id === expedient.id
        );
        row[index.index_name] = value ? value.value : '';
      });

      return row;
    });

    this.filteredData = [...this.tableData];
  }

  nextStep(expedientId: number): void {
    localStorage.setItem('selectedExpedientId', expedientId.toString());
    this.router.navigate(['/portal/document-management/viewer']);
  }

  editExpedient(expedientId: number): void {
    const modalRef = this.modalService.open(SearchResultModalComponent);
    modalRef.componentInstance.isEditMode = true;
    modalRef.componentInstance.expedientId = expedientId;
    modalRef.componentInstance.projectId = this.selectedProject;
    modalRef.componentInstance.indices = this.indices;

    modalRef.result.then((result) => {
      if (result === 'updated') {
        this.reloadTableBasedOnIndices();
        this.showAlert('Actualización', 'Expediente actualizado con éxito.', 'success');
      }
    }).catch((error) => {
    });
  }


  deleteExpedient(expedientId: number): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.message = `¿Está seguro de querer eliminar el expediente con ID "${expedientId}"?`;

    modalRef.result
      .then((result) => {
        if (result === 'confirm') {
          this.loaderService.showLoader();
          const valuesToDelete = this.values.filter((value) => value.archive_id === expedientId);
          const deleteValuePromises = valuesToDelete.map((value) =>
            this.service.deleteValue(value.id).toPromise()
          );

          Promise.all(deleteValuePromises)
            .then(() => {
              this.service.deleteArchive(expedientId).subscribe(
                () => {
                  this.reloadTableBasedOnIndices();
                  this.showAlert('Eliminación', 'Expediente eliminado con éxito.', 'info');
                  this.loaderService.hideLoader();
                },
                (error) => {
                  console.error('Error al eliminar el expediente:', error);
                  this.showAlert('Error', 'Error al eliminar el expediente.', 'danger');
                  this.loaderService.hideLoader();
                }
              );
            })
            .catch((error) => {
              console.error('Error al eliminar los valores asociados:', error);
              this.showAlert('Error', 'Error al eliminar los valores asociados al expediente.', 'danger');
              this.loaderService.hideLoader();
            });
        }
      })
      .catch((error) => {
        console.log('Modal dismissed', error);
      });
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredData = this.tableData.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm)
      )
    );
  }

  showAlert(title: string, message: string, type: 'success' | 'warning' | 'danger' | 'info'): void {
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertType = `alert-${type}`;
    this.alertIcon = `fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'times-circle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}`;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 7000);
  }

  handleAlertClosed(): void {
    this.alertVisible = false;
  }

  goBack(): void {
    this.location.back();
  }
}
