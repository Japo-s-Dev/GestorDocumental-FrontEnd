import { TestBed } from '@angular/core/testing';
import { ParameterManagerService } from './parameter-manager.service';

describe('ParameterManagerService', () => {
  let service: ParameterManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParameterManagerService);

    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send and save parameters correctly', () => {
    const newParameters = { param1: 'value1', param2: 'value2' };
    
    // Llamar a sendParameters y verificar que los parámetros se guardan en localStorage
    service.sendParameters(newParameters);
    const storedParams = JSON.parse(localStorage.getItem('parameterList')!);

    expect(storedParams).toEqual(newParameters);

    // Verificar que el BehaviorSubject emitió los parámetros correctos
    service.parameters$.subscribe((params) => {
      expect(params).toEqual(newParameters);
    });
  });

  it('should get a specific parameter by name', () => {
    const storedParameters = { param1: 'value1', param2: 'value2' };
    localStorage.setItem('parameterList', JSON.stringify(storedParameters));

    const param = service.getParameter<string>('param1');
    expect(param).toBe('value1');
  });

  it('should return undefined for a non-existing parameter', () => {
    const param = service.getParameter<string>('nonExistingParam');
    expect(param).toBeUndefined();
  });

  it('should retrieve parameters from localStorage correctly', (done) => {
    const storedParameters = { param1: 'value1', param2: 'value2' };
    localStorage.setItem('parameterList', JSON.stringify(storedParameters));
  
    // Crear una nueva instancia del servicio para que recoja los valores iniciales de localStorage
    service = new ParameterManagerService();
  
    service.getSharedParameter().subscribe((params) => {
      expect(params).toEqual(storedParameters);
      done(); // Asegurarse de que la prueba se complete
    });
  });
  
});
