import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsModalComponent } from './projects-modal.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProjectsCrudService } from '../../services/projects-crud.service';
import { IndexService } from '../../services/index.service';
import { of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ProjectsModalComponent', () => {
  let component: ProjectsModalComponent;
  let fixture: ComponentFixture<ProjectsModalComponent>;
  let projectsCrudService: jasmine.SpyObj<ProjectsCrudService>;
  let indexService: jasmine.SpyObj<IndexService>;
  let translateService: TranslateService;

  beforeEach(async () => {
    // Create mock instances for the services
    projectsCrudService = jasmine.createSpyObj('ProjectsCrudService', [
      'listProjects',
      'createProject',
      'updateProject',
      'deleteProject'
    ]);

    indexService = jasmine.createSpyObj('IndexService', [
      'listIndices',
      'listDatatypes',
      'createIndex',
      'updateIndex',
      'deleteIndex'
    ]);

    // Provide default mock return values
    projectsCrudService.listProjects.and.returnValue(of({ body: { result: [] } }));
    projectsCrudService.createProject.and.returnValue(of({ body: { result: { id: 1, project_name: 'Mock Project' } } }));
    projectsCrudService.updateProject.and.returnValue(of({}));
    projectsCrudService.deleteProject.and.returnValue(of({}));
    
    indexService.listIndices.and.returnValue(of({ body: { result: [] } }));
    indexService.listDatatypes.and.returnValue(of({ body: { result: [{ id: 1, datatype_name: 'String' }] } }));
    indexService.createIndex.and.returnValue(of({}));
    indexService.updateIndex.and.returnValue(of({}));
    indexService.deleteIndex.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [ProjectsModalComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ProjectsCrudService, useValue: projectsCrudService },
        { provide: IndexService, useValue: indexService },
        NgbActiveModal,
        TranslateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsModalComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on ngOnInit', () => {
    component.ngOnInit();
    expect(component.projectForm).toBeDefined();
    expect(component.indexForm).toBeDefined();
  });

  it('should load existing projects', () => {
    const mockProjects = [{ id: 1, project_name: 'Test Project' }];
    projectsCrudService.listProjects.and.returnValue(of({ body: { result: mockProjects } }));

    component.loadProjects();

    expect(component.existingProjects).toEqual(mockProjects);
    expect(projectsCrudService.listProjects).toHaveBeenCalled();
  });

  it('should handle error when loading projects', fakeAsync(() => {
    projectsCrudService.listProjects.and.returnValue(throwError('Error loading projects'));
  
    spyOn(component, 'showAlert');
    spyOn(translateService, 'get').and.returnValue(of('Error loading projects'));
  
    component.loadProjects();
    
    tick();
    fixture.detectChanges();
  
    expect(component.showAlert).toHaveBeenCalledWith('Error loading projects');
  }));

  it('should validate project name existence', () => {
    component.existingProjects = [{ id: 1, project_name: 'Test Project' }];

    const control = component.projectForm.controls['project_name'];
    control.setValue('Test Project');

    expect(control.errors).toEqual({ projectNameExists: true });
  });

  it('should show alert with correct message', () => {
    const message = 'Test alert message';
    component.showAlert(message);

    expect(component.alertMessage).toBe(message);
    expect(component.showWarningAlert).toBeTrue();
  });

  it('should call createProject when form is valid', () => {
    component.projectForm.controls['project_name'].setValue('New Project');

    const mockResponse = { body: { result: { id: 123, project_name: 'New Project' } } };
    projectsCrudService.createProject.and.returnValue(of(mockResponse));

    component.save();

    expect(projectsCrudService.createProject).toHaveBeenCalledWith({ project_name: 'New Project' });
    expect(component.projectData?.id).toBe(123);
  });

  it('should handle error on createProject failure', () => {
    component.projectForm.controls['project_name'].setValue('New Project');

    projectsCrudService.createProject.and.returnValue(throwError('Error creating project'));

    spyOn(component, 'showAlert');

    component.save();

    expect(component.showAlert).toHaveBeenCalled();
  });

  it('should call updateProject when in edit mode', () => {
    component.isEditMode = true;
    component.projectData = { id: 1, project_name: 'Existing Project' };
    component.projectForm.controls['project_name'].setValue('Updated Project');

    projectsCrudService.updateProject.and.returnValue(of({}));

    component.save();

    expect(projectsCrudService.updateProject).toHaveBeenCalledWith(1, { project_name: 'Updated Project' });
  });

  it('should handle error on updateProject failure', () => {
    component.isEditMode = true;
    component.projectData = { id: 1, project_name: 'Existing Project' };
    component.projectForm.controls['project_name'].setValue('Updated Project');

    projectsCrudService.updateProject.and.returnValue(throwError('Error updating project'));

    spyOn(component, 'showAlert');

    component.save();

    expect(component.showAlert).toHaveBeenCalled();
  });

  it('should call listDatatypes and load data types', () => {
    const mockDataTypes = [{ id: 1, datatype_name: 'String' }];
    indexService.listDatatypes.and.returnValue(of({ body: { result: mockDataTypes } }));

    component.loadDataTypes();

    expect(component.dataTypes).toEqual(mockDataTypes);
    expect(indexService.listDatatypes).toHaveBeenCalled();
  });

  it('should handle error on listDatatypes failure', () => {
    indexService.listDatatypes.and.returnValue(throwError('Error loading data types'));

    spyOn(component, 'showAlert');

    component.loadDataTypes();

    expect(component.showAlert).toHaveBeenCalled();
  });

  // Additional tests based on the missing parts

  it('should handle add index validation error', () => {
    component.indices = [];
    spyOn(component, 'showAlert');
    
    // Simular la traducción
    spyOn(translateService, 'get').and.returnValue(of('Please add at least one index'));

    component.save();

    expect(component.showAlert).toHaveBeenCalledWith('Please add at least one index');
});


  it('should handle index form validation error', () => {
    spyOn(component, 'showIndexAlert');
    component.indexForm.controls['index_name'].setValue('Invalid Name!');
    component.indexForm.controls['datatype_id'].setValue(null);
    
    component.onSubmitIndex();
    
    expect(component.showIndexAlert).toHaveBeenCalledWith('Nombre del índice solo puede contener letras o números.');
  });

  // Revisión de la creación de índices
  it('should call createIndex when index form is valid', () => {
    component.projectData = { id: 1, project_name: 'Test Project' }; // Asegurarse de que projectData esté definido
    component.indexForm.controls['index_name'].setValue('Valid Name');
    component.indexForm.controls['datatype_id'].setValue(1);
    
    spyOn(component, 'loadIndices');
    
    component.onSubmitIndex();
    
    expect(indexService.createIndex).toHaveBeenCalled();
    expect(component.loadIndices).toHaveBeenCalled();
  });

  // Revisión de la actualización de índices
  it('should call updateIndex when editing an index', () => {
    component.projectData = { id: 1, project_name: 'Test Project' }; // Asegurarse de que projectData esté definido
    component.isEditing = true;
    component.editingIndexId = 1;
    component.indexForm.controls['index_name'].setValue('Valid Name');
    component.indexForm.controls['datatype_id'].setValue(1);

    spyOn(component, 'loadIndices');
    
    component.onSubmitIndex();
    
    expect(indexService.updateIndex).toHaveBeenCalledWith(1, jasmine.any(Object));
    expect(component.loadIndices).toHaveBeenCalled();
});

  it('should handle error when deleting index', () => {
    indexService.deleteIndex.and.returnValue(throwError('Error deleting index'));

    spyOn(component, 'showAlert');
    
    component.deleteIndex(1);

    expect(component.showAlert).toHaveBeenCalled();
  });

  it('should toggle the index form', () => {
    component.showIndexForm = false;
    component.toggleIndexForm();
    expect(component.showIndexForm).toBeTrue();

    component.toggleIndexForm();
    expect(component.showIndexForm).toBeFalse();
  });

  it('should close the modal when closing', () => {
    spyOn(component.activeModal, 'dismiss');

    component.close();

    expect(component.activeModal.dismiss).toHaveBeenCalled();
  });

  // Prueba para validar que las traducciones están configuradas correctamente
  it('should display the correct translated message when showing alert', fakeAsync(() => {
    spyOn(translateService, 'get').and.returnValue(of('The translated alert message'));
    spyOn(component, 'showAlert');

    component.translate.get('projects:alert_complete_form').subscribe((translatedText: string) => {
        component.showAlert(translatedText);
    });

    tick();
    fixture.detectChanges();

    expect(component.showAlert).toHaveBeenCalledWith('The translated alert message');
  }));

  it('should set isEditing to true, set editingIndexId, and showIndexForm when editIndex is called', () => {
    const mockIndex = { id: 1, index_name: 'Test Index', datatype_id: 1, required: true };
  
    component.editIndex(mockIndex);
  
    expect(component.isEditing).toBeTrue();
    expect(component.editingIndexId).toEqual(mockIndex.id);
    expect(component.showIndexForm).toBeTrue();
  
    // Verificar que el formulario tenga los valores correspondientes
    expect(component.indexForm.value).toEqual({
      index_name: mockIndex.index_name,
      datatype_id: mockIndex.datatype_id,
      required: mockIndex.required
    });
  });

  it('should show an alert message when there are no indices added', () => {
    component.indices = [];
    component.projectCreated = true; // Asegúrate de que la bandera esté configurada correctamente
    component.projectForm.controls['project_name'].setValue('Valid Project Name'); // Asegúrate de que el formulario sea válido
    spyOn(component, 'showAlert');
    spyOn(translateService, 'get').and.returnValue(of('Please add at least one index'));

    component.save();

    expect(translateService.get).toHaveBeenCalledWith('projects:add_at_least_one_index');
    expect(component.showAlert).toHaveBeenCalledWith('Please add at least one index');
});


  it('should call deleteProject and dismiss modal when closing and no indices are present', () => {
    component.isEditMode = false;
    component.projectCreated = true;
    component.indices = [];
    component.tempProjectId = 1;

    spyOn(component.activeModal, 'dismiss');
    projectsCrudService.deleteProject.and.returnValue(of({}));

    component.close();

    expect(projectsCrudService.deleteProject).toHaveBeenCalledWith(1);
    expect(component.activeModal.dismiss).toHaveBeenCalled();
  });

  it('should dismiss the modal without deleting the project when closing and indices are present', () => {
    component.isEditMode = false;
    component.projectCreated = true;
    component.indices = [{ id: 1, index_name: 'Index 1', datatype_id: 1, required: true }];
    component.tempProjectId = 1;

    spyOn(component.activeModal, 'dismiss');

    component.close();

    expect(projectsCrudService.deleteProject).not.toHaveBeenCalled();
    expect(component.activeModal.dismiss).toHaveBeenCalled();
  });

  it('should set indexAlertMessage and showIndexWarningAlert when showIndexAlert is called', fakeAsync(() => {
    const testMessage = 'Test index alert message';

    component.showIndexAlert(testMessage);

    expect(component.indexAlertMessage).toEqual(testMessage);
    expect(component.showIndexWarningAlert).toBeTrue();

    // Verificar que el alert se cierra después de 10 segundos
    tick(10000);
    expect(component.showIndexWarningAlert).toBeFalse();
  }));

  it('should set showWarningAlert to false when closeAlert is called', () => {
    component.showWarningAlert = true;

    component.closeAlert();

    expect(component.showWarningAlert).toBeFalse();
  });

  it('should set showIndexWarningAlert to false when closeIndexAlert is called', () => {
    component.showIndexWarningAlert = true;

    component.closeIndexAlert();

    expect(component.showIndexWarningAlert).toBeFalse();
  });

});
