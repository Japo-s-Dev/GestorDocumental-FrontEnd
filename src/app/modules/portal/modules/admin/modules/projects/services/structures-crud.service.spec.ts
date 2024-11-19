import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectsCrudService } from './projects-crud.service';
import { AppConstants } from '../../../../../../../enums/app.constants';

describe('ProjectsCrudService', () => {
  let service: ProjectsCrudService;
  let httpMock: HttpTestingController;
  
  const apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectsCrudService],
    });
    service = TestBed.inject(ProjectsCrudService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list projects', () => {
    const mockProjects = [{ id: 1, project_name: 'Test Project' }];

    service.listProjects().subscribe((response) => {
      expect(response.body.result).toEqual(mockProjects);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    const payload = {
      id: 1,
      method: 'list_projects',
      params: {},
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ result: mockProjects });
  });

  it('should create a project', () => {
    const projectData = { project_name: 'New Project' };
    const mockResponse = { id: 1, project_name: 'New Project' };

    service.createProject(projectData).subscribe((response) => {
      expect(response.body.result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    const payload = {
      id: 1,
      method: 'create_project',
      params: { data: projectData },
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ result: mockResponse });
  });

  it('should update a project', () => {
    const projectId = 1;
    const projectData = { project_name: 'Updated Project' };

    service.updateProject(projectId, projectData).subscribe((response) => {
      expect(response.body.result).toEqual(projectData);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    const payload = {
      id: 1,
      method: 'update_project',
      params: { id: projectId, data: projectData },
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ result: projectData });
  });

  it('should delete a project', () => {
    const projectId = 1;

    service.deleteProject(projectId).subscribe((response) => {
      expect(response.body.result).toEqual('Project deleted');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    const payload = {
      id: 1,
      method: 'delete_project',
      params: { id: projectId },
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ result: 'Project deleted' });
  });

  it('should get a project by id', () => {
    const projectId = 1;
    const mockProject = { id: 1, project_name: 'Test Project' };

    service.getProjectById(projectId).subscribe((response) => {
      expect(response.body.result).toEqual(mockProject);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    const payload = {
      id: 1,
      method: 'get_project',
      params: { id: projectId },
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ result: mockProject });
  });
});
