import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsComponent } from './projects.component';
import { ProjectsCrudService } from '../../services/projects-crud.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../../../../../../services/loader.service';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let projectsCrudService: jasmine.SpyObj<ProjectsCrudService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let loaderService: jasmine.SpyObj<LoaderService>;
  let translateService: TranslateService;

  beforeEach(async () => {
    // Crear mocks para los servicios
    projectsCrudService = jasmine.createSpyObj('ProjectsCrudService', ['listProjects', 'deleteProject']);
    modalService = jasmine.createSpyObj('NgbModal', ['open']);
    loaderService = jasmine.createSpyObj('LoaderService', ['showLoader', 'hideLoader']);

    // Configurar respuestas simuladas para los servicios
    projectsCrudService.listProjects.and.returnValue(of({ body: { result: [{ id: 1, project_name: 'Test Project' }] } }));
    projectsCrudService.deleteProject.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [ProjectsComponent],
      imports: [
        TranslateModule.forRoot(),
        FormsModule
      ],
      providers: [
        { provide: ProjectsCrudService, useValue: projectsCrudService },
        { provide: NgbModal, useValue: modalService },
        { provide: LoaderService, useValue: loaderService },
        TranslateService
      ]
    }).compileComponents();
    
    translateService = TestBed.inject(TranslateService);

    // Mockear las funciones de traducción necesarias para evitar el error de subscribe
    spyOn(translateService, 'get').and.callFake((key: string, interpolateParams?: any) => {
      // Definir todas las posibles traducciones que se utilizan en el componente
      const translations: { [key: string]: string } = {
        'projects:title': 'Projects',
        'projects:add_project': 'Add Project',
        'projects:search_project': 'Search projects',
        'projects:title_project': 'Project name',
        'projects:actions': 'Actions',
        'projects:error_deleting_title': 'Error deleting project',
        'projects:confirm_delete': `Are you sure you want to delete the project "${interpolateParams?.projectName}"?`
      };
    
      // Devolver la traducción esperada si existe
      if (translations[key]) {
        return of(translations[key]);
      }
    
      // Si no se encuentra la traducción, retornar la clave como predeterminado
      return of(key);
    });
    
    spyOn(translateService, 'instant').and.callFake((key: string) => key);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    expect(projectsCrudService.listProjects).toHaveBeenCalled();
    expect(component.projects.length).toBeGreaterThan(0);
  });

  it('should handle error on project load', () => {
    projectsCrudService.listProjects.and.returnValue(throwError('Error loading projects'));
    component.loadProjects();
    expect(translateService.get).toHaveBeenCalledWith('projects:error_loading_title');
    expect(component.alertVisible).toBeTrue();
    expect(component.alertType).toBe('alert-danger');
  });

  it('should open the project modal when adding a new project', () => {
    const modalRefMock = {
      componentInstance: {
        projectData: {}, // Mockear la propiedad projectData
        isEditMode: false // Mockear la propiedad isEditMode
      },
      result: Promise.resolve('created')
    } as NgbModalRef;
    
    modalService.open.and.returnValue(modalRefMock);
    
    component.addProject();
    expect(modalService.open).toHaveBeenCalled();
  });
  
  it('should open the project modal when editing a project', () => {
    const mockProject = { id: 1, project_name: 'Test Project' };
    const modalRefMock = {
      componentInstance: {
        projectData: {}, // Mockear la propiedad projectData
        isEditMode: true // Mockear la propiedad isEditMode
      },
      result: Promise.resolve('updated')
    } as NgbModalRef;
    
    modalService.open.and.returnValue(modalRefMock);
    
    component.editProject(mockProject);
    expect(modalService.open).toHaveBeenCalled();
  });
  

  it('should delete a project and show success alert', (done) => {
    spyOn(component, 'loadProjects'); // Espiar para verificar que loadProjects sea llamado después de la eliminación
  
    const mockProject = { id: 1, project_name: 'Test Project' };
    const modalRefMock = {
      componentInstance: {
        message: '', // Añadir propiedades necesarias
      },
      result: Promise.resolve('confirm')
    } as NgbModalRef;
    
    modalService.open.and.returnValue(modalRefMock);
  
    component.deleteProject(mockProject);
    
    setTimeout(() => {
      expect(projectsCrudService.deleteProject).toHaveBeenCalledWith(mockProject.id);
      expect(component.loadProjects).toHaveBeenCalled();
      expect(component.alertVisible).toBeTrue();
      expect(component.alertType).toBe('alert-info');
      done();
    }, 100);
  });

  /** 
  it('should show error alert if delete project fails', (done) => {
    spyOn(component, 'loadProjects');

    const mockProject = { id: 1, project_name: 'Test Project' };
    projectsCrudService.deleteProject.and.returnValue(throwError('Error deleting project'));
    const modalRefMock = {
      result: Promise.resolve('confirm')
    } as NgbModalRef;
    modalService.open.and.returnValue(modalRefMock);

    component.deleteProject(mockProject);

    setTimeout(() => {
      expect(translateService.get).toHaveBeenCalledWith('projects:error_deleting_title');
      expect(component.alertVisible).toBeTrue();
      expect(component.alertType).toBe('alert-danger');
      done();
    }, 100);
  });
  */

  it('should filter projects by search term', () => {
    component.projects = [
      { id: 1, project_name: 'Test Project 1' },
      { id: 2, project_name: 'Another Project' },
    ];
    component.searchTerm = 'Test';
    const filteredProjects = component.filteredProjects();
    expect(filteredProjects.length).toBe(1);
    expect(filteredProjects[0].project_name).toBe('Test Project 1');
  });

  it('should display an alert with correct parameters', () => {
    const alertText = { title: 'Title', message: 'Message' };
    component.showAlert(alertText, 'info');
    expect(component.alertTitle).toBe(alertText.title);
    expect(component.alertMessage).toBe(alertText.message);
    expect(component.alertType).toBe('alert-info');
    expect(component.alertVisible).toBeTrue();
  });
});
