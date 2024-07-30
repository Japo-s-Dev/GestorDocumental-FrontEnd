import { Component } from '@angular/core';
import { IProject } from '../../interfaces/project.interface';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  projects: IProject[] = [
    { proyectoId: 1, nombre: 'Proyecto 1'},
    { proyectoId: 2, nombre: 'Proyecto 2'},
    { proyectoId: 3, nombre: 'Proyecto 3'},
    // Agrega más proyectos según sea necesario
  ];

  searchTerm: string = '';

  filteredProjects(): IProject[] {
    if (!this.searchTerm) {
      return this.projects;
    }
    return this.projects.filter(project =>
      project.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addProject() {
    // Lógica para agregar un nuevo proyecto
    console.log('Agregar proyecto');
  }

  editProject(project: IProject) {
    // Lógica para editar el proyecto
    console.log('Editar proyecto', project);
  }

  deleteProject(project: IProject) {
    // Lógica para eliminar el proyecto
    console.log('Eliminar proyecto', project);
    this.projects = this.projects.filter(p => p.proyectoId !== project.proyectoId);
  }
}
