import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IndexService } from './index.service';
import { AppConstants } from '../../../../../../../enums/app.constants';
import { IIndexRequest } from '../interfaces/index.interface';

describe('IndexService', () => {
  let service: IndexService;
  let httpMock: HttpTestingController;

  const apiUrl = `${AppConstants.BASE_URL}/api/rpc`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IndexService],
    });
    service = TestBed.inject(IndexService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests remain
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an index', () => {
    const mockData: IIndexRequest = {
      project_id: 1,
      index_name: 'Test Index',
      datatype_id: 1,
      required: true,
    };

    service.createIndex(mockData).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();

    const payload = {
      id: 1,
      method: 'create_index',
      params: {
        data: { ...mockData },
      },
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ body: { result: mockData } });
  });

  it('should list indices', () => {
    const projectId = 1;
    const mockResponse = [{ id: 1, index_name: 'Test Index' }];
  
    service.listIndices(projectId).subscribe((response) => {
      expect(response.body.result).toEqual(mockResponse);
    });
  
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
  
    const payload = {
      id: 1,
      method: 'list_indexes',
      params: {
        filters: { project_id: projectId },
      },
    };
  
    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));
  
    expect(req.request.body.get('json')).toEqual(formData.get('json'));
  
    // Adjust the flush call
    req.flush({ result: mockResponse });
  });
  

  it('should update an index', () => {
    const indexId = 1;
    const mockData: IIndexRequest = {
      project_id: 1,
      index_name: 'Updated Index',
      datatype_id: 1,
      required: true,
    };

    service.updateIndex(indexId, mockData).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    const payload = {
      id: 1,
      method: 'update_index',
      params: {
        id: indexId,
        data: mockData,
      },
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ body: { result: mockData } });
  });

  it('should delete an index', () => {
    const indexId = 1;

    service.deleteIndex(indexId).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    const payload = {
      id: 1,
      method: 'delete_index',
      params: { id: indexId },
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));

    expect(req.request.body.get('json')).toEqual(formData.get('json'));

    req.flush({ body: { result: 'Index deleted' } });
  });

  it('should call listDatatypes and load data types', () => {
    const mockDataTypes = [{ id: 1, datatype_name: 'String' }];
  
    service.listDatatypes().subscribe((response) => {
      expect(response.body.result).toEqual(mockDataTypes);
    });
  
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
  
    const payload = {
      id: 1,
      method: 'list_datatypes',
      params: {},
    };
  
    const formData = new FormData();
    formData.append('json', JSON.stringify(payload));
  
    expect(req.request.body.get('json')).toEqual(formData.get('json'));
  
    // Adjust the flush call
    req.flush({ result: mockDataTypes });
  }); 
  
});
