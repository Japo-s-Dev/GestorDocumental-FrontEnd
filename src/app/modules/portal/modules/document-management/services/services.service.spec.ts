import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServicesService } from './services.service';
import { AppConstants } from '../../../../../enums/app.constants';
import { IExpedientRequest, IValueRequest } from '../interfaces/services.interface';
import { IIndexRequest } from '../../admin/modules/projects/interfaces/index.interface';

describe('ServicesService', () => {
  let service: ServicesService;
  let httpMock: HttpTestingController;
  const apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServicesService],
    });
    service = TestBed.inject(ServicesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that no outstanding requests remain
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test listArchives method
  it('should list archives', () => {
    const projectId = 1;
    const mockArchives = [{ id: 1, name: 'Archive 1' }];

    service.listArchives(projectId).subscribe((response) => {
      expect(response.body.result).toEqual(mockArchives);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: mockArchives });
  });

  // Test getArchiveById method
  it('should get archive by ID', () => {
    const archiveId = 1;
    const mockArchive = { id: 1, name: 'Archive 1' };

    service.getArchiveById(archiveId).subscribe((response) => {
      expect(response.body.result).toEqual(mockArchive);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: mockArchive });
  });

  it('should list projects', () => {
    const mockProjects = [{ id: 1, project_name: 'Test Project' }];

    service.listProjects().subscribe((response) => {
      expect(response.body.result).toEqual(mockProjects);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: mockProjects });
  });

  it('should create an archive', () => {
    const mockRequest: IExpedientRequest = {
      project_id: 1,
      tag: 'Test Tag',
    };

    service.createArchive(mockRequest).subscribe((response) => {
      expect(response.body.result).toEqual(mockRequest);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: mockRequest });
  });

  it('should update an archive', () => {
    const expedientId = 1;
    const updateData: Partial<IExpedientRequest> = { tag: 'Updated Tag' };

    service.updateArchive(expedientId, updateData).subscribe((response) => {
      expect(response.body.result).toEqual(updateData);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: updateData });
  });

  it('should delete an archive', () => {
    const expedientId = 1;

    service.deleteArchive(expedientId).subscribe((response) => {
      expect(response.body.result).toBe('Archive deleted');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: 'Archive deleted' });
  });

  it('should create an index', () => {
    const mockIndex: IIndexRequest = {
      project_id: 1,
      index_name: 'Test Index',
      datatype_id: 1,
      required: true,
    };

    service.createIndex(mockIndex).subscribe((response) => {
      expect(response.body.result).toEqual(mockIndex);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: mockIndex });
  });

  it('should list datatypes', () => {
    const mockDataTypes = [{ id: 1, datatype_name: 'String' }];

    service.listDatatypes().subscribe((response) => {
      expect(response.body.result).toEqual(mockDataTypes);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: mockDataTypes });
  });

  it('should create a value', () => {
    const mockValue: IValueRequest = {
      project_id: 1,
      index_id: 1,
      archive_id: 1,
      value: 'Test Value',
    };

    service.createValue(mockValue).subscribe((response) => {
      expect(response.body.result).toEqual(mockValue);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: mockValue });
  });

  it('should update a value', () => {
    const valueId = 1;
    const newValue = 'Updated Value';

    service.updateValue(valueId, newValue).subscribe((response) => {
      expect(response.body.result).toEqual({ value: newValue });
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: { value: newValue } });
  });

  it('should create a comment', () => {
    const archiveId = 1;
    const commentText = 'Test Comment';

    service.createComment(archiveId, commentText).subscribe((response) => {
      expect(response.body.result).toEqual({ text: commentText });
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: { text: commentText } });
  });

  it('should list events for an archive', () => {
    const archiveId = 1;
    const mockEvents = [{ id: 1, event_name: 'Test Event' }];

    service.listEvents(archiveId).subscribe((response) => {
      expect(response.body.result).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: mockEvents });
  });

  // Test listIndices method
  it('should list indices', () => {
    const projectId = 1;
    const mockIndices = [{ id: 1, index_name: 'Index 1' }];

    service.listIndices(projectId).subscribe((response) => {
      expect(response.body.result).toEqual(mockIndices);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: mockIndices });
  });

  // Test updateIndex method
  it('should update an index', () => {
    const indexId = 1;
    const mockIndexRequest: IIndexRequest = {
      project_id: 1,
      index_name: 'Updated Index',
      datatype_id: 1,
      required: true,
    };

    service.updateIndex(indexId, mockIndexRequest).subscribe((response) => {
      expect(response.body.result).toEqual(mockIndexRequest);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: mockIndexRequest });
  });

  // Test deleteIndex method
  it('should delete an index', () => {
    const indexId = 1;

    service.deleteIndex(indexId).subscribe((response) => {
      expect(response.body.result).toBe('Index deleted');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: 'Index deleted' });
  });

  // Test getValueById method
  it('should get value by ID', () => {
    const valueId = 1;
    const mockValue = { id: 1, value: 'Test Value' };

    service.getValueById(valueId).subscribe((response) => {
      expect(response.body.result).toEqual(mockValue);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: mockValue });
  });

  // Test listValues method
  it('should list values', () => {
    const mockValues = [{ id: 1, value: 'Value 1' }];

    service.listValues().subscribe((response) => {
      expect(response.body.result).toEqual(mockValues);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: mockValues });
  });

  // Test deleteValue method
  it('should delete a value', () => {
    const valueId = 1;

    service.deleteValue(valueId).subscribe((response) => {
      expect(response.body.result).toBe('Value deleted');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: 'Value deleted' });
  });

  // Test getComment method
  it('should get a comment by ID', () => {
    const commentId = 1;
    const mockComment = { id: commentId, text: 'Test comment' };

    service.getComment(commentId).subscribe((response) => {
      expect(response.body.result).toEqual(mockComment);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: mockComment });
  });

  // Test listComments method
  it('should list comments', () => {
    const mockComments = [{ id: 1, text: 'Comment 1' }];

    service.listComments().subscribe((response) => {
      expect(response.body.result).toEqual(mockComments);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: mockComments });
  });

  // Test listEvents method
  it('should list events for an archive', () => {
    const archiveId = 1;
    const mockEvents = [{ id: 1, event_name: 'Test Event' }];

    service.listEvents(archiveId).subscribe((response) => {
      expect(response.body.result).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ result: mockEvents });
  });
});
