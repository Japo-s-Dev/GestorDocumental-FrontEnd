import { Component, OnInit } from '@angular/core';
import { ProjectsCrudService } from '../../services/projects-crud.service';
import { IProject } from '../../interfaces/project.interface';
import { LoaderService } from '../../../../../../../../services/loader.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: IProject[] = [];
  searchTerm: string = '';
  selectedProject: IProject | null = null;
  isModalOpen: boolean = false;

  constructor(
    private projectsCrudService: ProjectsCrudService,
    private modalService: NgbModal,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.loaderService.showLoader();
    this.loadProjects();
    setTimeout(() => {
      this.loaderService.hideLoader();
    }, 2000);
  }

  loadProjects(): void {
    this.projectsCrudService.listProjects().subscribe(
      (response) => {
        if (response && response.body.result) {
          this.projects = response.body.result;
          console.log('Proyectos:', this.projects);
        }
      },
      (error) => {
        console.error('Error al obtener los proyectos:', error);
      }
    );
  }

  filteredProjects(): IProject[] {
    if (!this.searchTerm) {
      return this.projects;
    }
    return this.projects.filter(project =>
      project.projectData.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addProject() {
    this.selectedProject = { proyectoId: 0, projectData: '' };
    this.isModalOpen = true;
  }

  editProject(project: IProject) {
    this.selectedProject = { ...project };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProject = null;
  }

  saveProject() {
    if (this.selectedProject) {
      if (this.selectedProject.proyectoId === 0) {
        this.projectsCrudService.createProject(this.selectedProject).subscribe(() => {
          this.loadProjects();
          this.closeModal();
        });
      } else {
        this.projectsCrudService.updateProject(this.selectedProject, this.selectedProject).subscribe(() => {
          this.loadProjects();
          this.closeModal();
        });
      }
    }
  }

  deleteProject(project: IProject) {
    if (project.proyectoId !== null && confirm(`¿Estás seguro de eliminar el proyecto ${project.projectData}?`)) {
      this.projectsCrudService.deleteProject(project.proyectoId).subscribe(() => {
        this.projects = this.projects.filter(p => p.proyectoId !== project.proyectoId);
      });
    } else {
      console.error('El proyecto no tiene un ID válido.');
    }
  }
}
