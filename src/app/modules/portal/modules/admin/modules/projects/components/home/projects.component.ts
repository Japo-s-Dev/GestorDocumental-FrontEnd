import { Component, OnInit } from '@angular/core';
import { IProject } from '../../interfaces/project.interface';
import { ProjectsCrudService } from '../../services/projects-crud.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsModalComponent } from '../projects-modal/projects-modal.component';
import { ConfirmModalComponent } from '../../../../../../../../shared/confirm-modal/confirm-modal.component';
import { LoaderService } from '../../../../../../../../services/loader.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  projects: IProject[] = [];
  searchTerm: string = '';

  currentPage: number = 1;
  pageSize: number = 5;
  totalProjects: number = 0;
  isLastPage: boolean = false;

  // Alert properties
  alertVisible: boolean = false;
  alertTitle: string = '';
  alertMessage: string = '';
  alertType: string = 'alert-info';
  alertIcon: string = 'icon-info';

  constructor(
    private projectsCrudService: ProjectsCrudService,
    private modalService: NgbModal,
    private loaderService: LoaderService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loaderService.showLoader();
    this.loadProjects(); // Cargamos proyectos al iniciar
  }

  loadProjects(): void {
    const offset = (this.currentPage - 1) * this.pageSize;
    this.projectsCrudService.listProjects(this.pageSize, offset).subscribe(
      (response) => {
        if (response && response.body.result) {
          this.projects = response.body.result.items;
          this.totalProjects = response.body.result.total_count;

          // Verificar si estamos en la última página
          if (this.projects.length < this.pageSize) {
            this.isLastPage = true;
          } else {
            this.isLastPage = false;
          }

          this.loaderService.hideLoader();
        }
      },
      (error) => {
        this.translate.get('projects:error_loading_title').subscribe((title: string) => {
          this.translate.get('projects:error_loading_message').subscribe((message: string) => {
            this.showAlert({ title, message }, 'danger');
          });
        });
        this.loaderService.hideLoader();
        console.error('Error al obtener los proyectos:', error);
      },
    );
  }

  openProjectModal(project: IProject | null = null): void {
    const modalRef = this.modalService.open(ProjectsModalComponent);
    modalRef.componentInstance.projectData = project || {};
    modalRef.componentInstance.isEditMode = !!project;

    modalRef.result
      .then((result) => {
        if (result) {
          this.loadProjects();
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
      });
  }

  addProject(): void {
    this.openProjectModal();
  }

  editProject(project: IProject): void {
    this.openProjectModal(project);
  }

  deleteProject(project: IProject): void {
    this.translate.get('projects:confirm_delete', { projectName: project.project_name }).subscribe((translatedText: string) => {
      const modalRef = this.modalService.open(ConfirmModalComponent);
      modalRef.componentInstance.message = translatedText;

      modalRef.result
        .then((result) => {
          if (result === 'confirm') {
            this.projectsCrudService.deleteProject(project.id).subscribe(
              () => {
                this.translate.get('projects:delete_success_title').subscribe((title: string) => {
                  this.translate.get('projects:delete_success_message').subscribe((message: string) => {
                    this.showAlert({ title, message }, 'info');
                  });
                });
                this.loaderService.showLoader();
                this.loadProjects();
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
        });
    });
  }

  filteredProjects(): IProject[] {
    if (!this.searchTerm) {
      return this.projects;
    }
    return this.projects.filter((project) =>
      project.project_name.toLowerCase().includes(this.searchTerm.toLowerCase()),
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

  totalPages(): number {
    return Math.ceil(this.totalProjects / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages() && !this.isLastPage) {
      this.currentPage++;
      this.loaderService.showLoader();
      this.loadProjects();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loaderService.showLoader();
      this.loadProjects();
    }
  }
}
