import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProject } from '../interfaces/project.interface';
import { AppConstants } from '../../../../../../../enums/app.constants';
import { IDeleteProject } from '../interfaces/delete-project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectsCrudService {
  private apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  constructor(private http: HttpClient) {}

  // Obtener lista de proyectos
  listProjects(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload = {
      id: 1,
      method: 'list_projects'
    };
    
    return this.http.post<any>(this.apiUrl, payload, {
      headers,
      observe: 'response',
      withCredentials: true
    });
  }

  // Crear un nuevo proyecto
  createProject(projectData: IProject): Observable<any> {
    const payload = {
      id: 1,
      method: 'create_project',
      params: {
        data: {
          project_name: projectData.projectData // Asegúrate de usar 'project_name' aquí
        }
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<any>(this.apiUrl, payload, {
      headers,
      observe: 'response',
      withCredentials: true
    });
  }

  // Actualizar un proyecto existente
  updateProject(proyectoId: IProject, projectData: IProject): Observable<any> {
    console.log(proyectoId);
    
    const payload = {
      id: 1,
      method: 'update_project',
      params: {
        id: proyectoId,
        data: projectData
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, payload, {
      headers,
      observe: 'response',
      withCredentials: true
    });
  }
  
  // Eliminar un proyecto
  deleteProject(proyectoId: number): Observable<any> {
    const payload: IDeleteProject = {
      id: 1,
      method: 'delete_user',
      params: { id: proyectoId }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, payload, {
      headers,
      observe: 'response',
      withCredentials: true
    });
  }
  
}
