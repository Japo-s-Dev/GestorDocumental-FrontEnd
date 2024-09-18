import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProjectsComponent } from './projects.component';
import { ProjectsCrudService } from '../../services/projects-crud.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../../../../../../services/loader.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule si usas HttpClient
import { ProjectsModalComponent } from '../projects-modal/projects-modal.component';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let projectsCrudService: jasmine.SpyObj<ProjectsCrudService>;
  let loaderService: jasmine.SpyObj<LoaderService>;

  beforeEach(async () => {
    const projectsCrudSpy = jasmine.createSpyObj('ProjectsCrudService', ['listProjects', 'deleteProject']);
    const loaderSpy = jasmine.createSpyObj('LoaderService', ['showLoader', 'hideLoader']);

    await TestBed.configureTestingModule({
      declarations: [ ProjectsComponent ],
      imports: [ FormsModule, HttpClientTestingModule ], // Asegúrate de incluir HttpClientTestingModule
      providers: [
        { provide: ProjectsCrudService, useValue: projectsCrudSpy },
        { provide: LoaderService, useValue: loaderSpy },
        NgbModal
      ]
    })
    .compileComponents();

    projectsCrudService = TestBed.inject(ProjectsCrudService) as jasmine.SpyObj<ProjectsCrudService>;
    loaderService = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
  });

  beforeEach(() => {
    // Simulamos el retorno del servicio
    const mockProjects = [{ id: 1, project_name: 'Test Project' }];
    projectsCrudService.listProjects.and.returnValue(of({ body: { result: mockProjects } }));

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    // Aquí aseguramos que los valores simulados ya están listos antes de que el ciclo de vida se ejecute
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    expect(projectsCrudService.listProjects).toHaveBeenCalled();
    expect(component.projects).toEqual([{ id: 1, project_name: 'Test Project' }]);
  });

  it('should handle error on project load', () => {
    projectsCrudService.listProjects.and.returnValue(throwError('Error'));  // Simulamos un error

    component.loadProjects();

    expect(component.projects.length).toBe(0);
    expect(loaderService.showLoader).toHaveBeenCalled();
    expect(loaderService.hideLoader).toHaveBeenCalled();
  });

  it('should filter projects by search term', () => {
    component.projects = [
      { id: 1, project_name: 'Project A' },
      { id: 2, project_name: 'Project B' }
    ];
    
    component.searchTerm = 'A';
    
    const filtered = component.filteredProjects();
    
    expect(filtered.length).toBe(1);
    expect(filtered[0].project_name).toBe('Project A');
  });

  it('should display an alert with correct parameters', () => {
    component.showAlert('Title', 'Message', 'success');
    
    expect(component.alertTitle).toBe('Title');
    expect(component.alertMessage).toBe('Message');
    expect(component.alertType).toBe('alert-success');
    expect(component.alertIcon).toBe('fa-check-circle');
    expect(component.alertVisible).toBeTrue();

    jasmine.clock().install(); // Usamos el reloj simulado de Jasmine
    component.showAlert('Test', 'Test message', 'info');
    jasmine.clock().tick(7001); // Avanzamos el reloj simulado
    expect(component.alertVisible).toBeFalse();
    jasmine.clock().uninstall();
  });

  it('should open the project modal when adding a new project', () => {
    const modalSpy = spyOn(component['modalService'], 'open').and.returnValue({
      componentInstance: { projectData: {}, isEditMode: false },
      result: Promise.resolve('created')
    } as any); 

    component.addProject();

    expect(modalSpy).toHaveBeenCalledWith(ProjectsModalComponent);
    expect(modalSpy.calls.mostRecent().returnValue.componentInstance.isEditMode).toBe(false);
  });

  it('should open the project modal when editing a project', () => {
    const mockProject = { id: 1, project_name: 'Test Project' };
    const modalSpy = spyOn(component['modalService'], 'open').and.returnValue({
      componentInstance: { projectData: mockProject, isEditMode: true },
      result: Promise.resolve('updated')
    } as any); 

    component.editProject(mockProject);

    expect(modalSpy).toHaveBeenCalledWith(ProjectsModalComponent);
    expect(modalSpy.calls.mostRecent().returnValue.componentInstance.isEditMode).toBe(true);
  });

  it('should delete a project and show success alert', async () => {
    const mockProject = { id: 1, project_name: 'Test Project' };
  
    const modalSpy = spyOn(component['modalService'], 'open').and.returnValue({
      componentInstance: { message: '', projectData: {}, isEditMode: false }, // Simula el componente modal
      result: Promise.resolve('confirm')
    } as any); 
  
    projectsCrudService.deleteProject.and.returnValue(of({}));
    const alertSpy = spyOn(component, 'showAlert'); 
  
    await component.deleteProject(mockProject);
  
    expect(projectsCrudService.deleteProject).toHaveBeenCalledWith(mockProject.id);
    expect(alertSpy).toHaveBeenCalledWith('Eliminación', 'Proyecto eliminado con éxito.', 'info');
    expect(modalSpy.calls.mostRecent().returnValue.componentInstance.message).toBeDefined();
  });

  it('should show error alert if delete project fails', async () => {
    const mockProject = { id: 1, project_name: 'Test Project' };
  
    const modalSpy = spyOn(component['modalService'], 'open').and.returnValue({
      componentInstance: { message: '', projectData: {}, isEditMode: false }, // Simula el componente modal
      result: Promise.resolve('confirm')
    } as any);
  
    projectsCrudService.deleteProject.and.returnValue(throwError('Error'));
    const alertSpy = spyOn(component, 'showAlert');
  
    await component.deleteProject(mockProject);
  
    expect(projectsCrudService.deleteProject).toHaveBeenCalledWith(mockProject.id);
    expect(alertSpy).toHaveBeenCalledWith('Error', 'Error al eliminar el proyecto.', 'danger');
    expect(modalSpy.calls.mostRecent().returnValue.componentInstance.message).toBeDefined();
  });  
});
