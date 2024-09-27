import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit true when showLoader is called', (done) => {
    service.loaderState$.subscribe((state) => {
      expect(state).toBeTrue();
      done(); // Completa la prueba cuando se reciba el valor
    });

    service.showLoader();
  });

  it('should emit false when hideLoader is called', (done) => {
    service.loaderState$.subscribe((state) => {
      expect(state).toBeFalse();
      done(); // Completa la prueba cuando se reciba el valor
    });

    service.hideLoader();
  });
});
