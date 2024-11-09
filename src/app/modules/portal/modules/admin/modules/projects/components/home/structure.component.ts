import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../../../../../../../shared/confirm-modal/confirm-modal.component';
import { LoaderService } from '../../../../../../../../services/loader.service';
import { TranslateService } from '@ngx-translate/core';
import { IStructure } from '../../interfaces/structure.interface';
import { StructuresCrudService } from '../../services/structures-crud.service';
import { StructuresModalComponent } from '../structures-modal/structures-modal.component';

@Component({
  selector: 'app-structures',
  templateUrl: './structures.component.html',
  styleUrls: ['./structures.component.css'],
})
export class StructuresComponent implements OnInit {
  structures: IStructure[] = [];
  searchTerm: string = '';

  // Alert properties
  alertVisible: boolean = false;
  alertTitle: string = '';
  alertMessage: string = '';
  alertType: string = 'alert-info';
  alertIcon: string = 'icon-info';

  constructor(
    private structuresCrudService: StructuresCrudService,
    private modalService: NgbModal,
    private loaderService: LoaderService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loaderService.showLoader();
    this.loadStructures();
    setTimeout(() => {
      this.loaderService.hideLoader();
    }, 2000);
  }

  loadStructures(): void {
    this.structuresCrudService.listStructures().subscribe(
      (response) => {
        if (response && response.body.result) {
          this.structures = response.body.result;
        }
      },
      (error) => {
        this.translate.get('projects:error_loading_title').subscribe((title: string) => {
          this.translate.get('projects:error_loading_message').subscribe((message: string) => {
            this.showAlert({ title, message }, 'danger');
          });
        });
        console.error('Error al obtener los proyectos:', error);
      },
    );
  }

  openStructureModal(structure: IStructure | null = null): void {
    const modalRef = this.modalService.open(StructuresModalComponent);
    modalRef.componentInstance.structureData = structure || {};
    modalRef.componentInstance.isEditMode = !!structure;

    modalRef.result
      .then((result) => {
        if (result) {
          this.loadStructures();
          if (result === 'created') {
            this.translate.get('projects:add_success_title').subscribe((title: string) => {
              this.translate.get('projects:add_success_message').subscribe((message: string) => {
                this.showAlert({ title, message }, 'success');
              });
            });
            this.loaderService.showLoader();
            setTimeout(() => {
              this.loaderService.hideLoader();
            }, 1000);
          } else if (result === 'updated') {
            this.translate.get('projects:update_success_title').subscribe((title: string) => {
              this.translate.get('projects:update_success_message').subscribe((message: string) => {
                this.showAlert({ title, message }, 'warning');
              });
            });
            this.loaderService.showLoader();
            setTimeout(() => {
              this.loaderService.hideLoader();
            }, 1000);
          }
        }
      })
      .catch((error) => {
        console.log('Modal dismissed', error);
      });
  }

  addStructure(): void {
    this.openStructureModal();
  }

  editStructure(structure: IStructure): void {
    this.openStructureModal(structure);
  }

  deleteStructure(structure: IStructure): void {
    this.translate.get('projects:confirm_delete', { structreName: structure.structure_name }).subscribe((translatedText: string) => {
      const modalRef = this.modalService.open(ConfirmModalComponent);
      modalRef.componentInstance.message = translatedText;

      modalRef.result
        .then((result) => {
          if (result === 'confirm') {
            this.structuresCrudService.deleteStructure(structure.id).subscribe(
              () => {
                this.translate.get('projects:delete_success_title').subscribe((title: string) => {
                  this.translate.get('projects:delete_success_message').subscribe((message: string) => {
                    this.showAlert({ title, message }, 'info');
                  });
                });
                this.loaderService.showLoader();
                this.loadStructures();
                setTimeout(() => {
                  this.loaderService.hideLoader();
                }, 1000);
              },
              (error) => {
                this.translate.get('projects:error_deleting_title').subscribe((title: string) => {
                  this.translate.get('projects:error_deleting_message').subscribe((message: string) => {
                    this.showAlert({ title, message }, 'danger');
                  });
                });
                this.loaderService.showLoader();
                setTimeout(() => {
                  this.loaderService.hideLoader();
                }, 1000);
              },
            );
          }
        })
        .catch((error) => {
          console.log('Modal dismissed', error);
        });
    });
  }

  filteredStructures(): IStructure[] {
    if (!this.searchTerm) {
      return this.structures;
    }
    return this.structures.filter((structure) =>
      structure.structure_name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  showAlert(translatedText: any, type: 'success' | 'warning' | 'danger' | 'info'): void {
    this.alertTitle = translatedText.title;
    this.alertMessage = translatedText.message;
    this.alertType = `alert-${type}`;
    this.alertIcon = `fa-${
      type === 'success' ? 'check-circle' : type === 'danger' ? 'times-circle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'
    }`;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 7000);
  }

  handleAlertClosed(): void {
    this.alertVisible = false;
  }
}
