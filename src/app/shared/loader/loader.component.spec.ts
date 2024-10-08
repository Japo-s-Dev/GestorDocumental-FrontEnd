import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';
import { LoaderService } from '../../services/loader.service';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let loaderService: LoaderService;
  const loaderStateSubject = new BehaviorSubject<boolean>(false);

  beforeEach(async () => {
    const loaderServiceMock = {
      loaderState$: loaderStateSubject.asObservable(), // Simula el observable
    };

    await TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      providers: [{ provide: LoaderService, useValue: loaderServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    loaderService = TestBed.inject(LoaderService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the loader when loaderState$ emits true', () => {
    loaderStateSubject.next(true); // Cambia el estado a true
    fixture.detectChanges();

    const loaderOverlay = fixture.debugElement.query(By.css('.loader-overlay'));
    expect(loaderOverlay).not.toBeNull(); // Verifica que el loader se muestre
  });

  it('should hide the loader when loaderState$ emits false', () => {
    loaderStateSubject.next(false); // Cambia el estado a false
    fixture.detectChanges();

    const loaderOverlay = fixture.debugElement.query(By.css('.loader-overlay'));
    expect(loaderOverlay).toBeNull(); // Verifica que el loader no se muestre
  });
});
