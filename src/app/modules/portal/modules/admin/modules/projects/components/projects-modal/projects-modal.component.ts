import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IProject } from '../../interfaces/project.interface';
import { ProjectsCrudService } from '../../services/projects-crud.service';

@Component({
  selector: 'app-projects-modal',
  templateUrl: './projects-modal.component.html',
  styleUrls: ['./projects-modal.component.css']
})
export class ProjectsModalComponent implements OnInit {
  @Input() project: IProject | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private projectsCrudService: ProjectsCrudService
  ) {}

  ngOnInit(): void {}

  saveProject() {
    if (this.project) {
      if (this.project.proyectoId === 0) {
        this.projectsCrudService.createProject(this.project).subscribe(
          () => {
            this.activeModal.close('created');
          },
          (error) => {
            console.error('Error al crear el proyecto', error);
          }
        );
      } else {
        this.projectsCrudService.updateProject(this.project, this.project).subscribe(
          () => {
            this.activeModal.close('updated');
          },
          (error) => {
            console.error('Error al actualizar el proyecto', error);
          }
        );
      }
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
