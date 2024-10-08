import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { Router } from '@angular/router';
import { InactivityService } from './inactivity.service';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('InactivityService', () => {
  let service: InactivityService;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    const authServiceMock = {
      logoff: jasmine.createSpy('logoff').and.returnValue(of({}))
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        InactivityService,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    service = TestBed.inject(InactivityService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    spyOn(router, 'navigate').and.stub();
    spyOn(window, 'alert');

    // Inicializa el temporizador y los listeners manualmente
    service['setupActivityListeners']();
  });

  afterEach(() => {
    // Limpiar los temporizadores pendientes
    if (service['logoutTimer']) {
      clearTimeout(service['logoutTimer']);
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should reset the logout timer on activity', fakeAsync(() => {
    spyOn(service as any, 'resetLogoutTimer').and.callThrough();
    window.dispatchEvent(new Event('mousemove'));
    tick(); // Avanza el tiempo para asegurar que el evento ha sido manejado
    expect((service as any).resetLogoutTimer).toHaveBeenCalled();
    flush(); // Asegura que se limpian los temporizadores pendientes
  }));

  it('should call logoff and redirect to login after inactivity', fakeAsync(() => {
    // Invoca el método directamente para asegurarse de que el temporizador se ejecuta
    service['resetLogoutTimer']();
    
    tick(service['INACTIVITY_LIMIT']); // Avanza el tiempo para simular inactividad
    
    expect(authService.logoff).toHaveBeenCalledWith({ logoff: true });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(window.alert).toHaveBeenCalledWith('Has sido desconectado por inactividad.');
    flush(); // Asegura que se limpian los temporizadores pendientes
  }));

  it('should handle logoff error correctly', fakeAsync(() => {
    authService.logoff = jasmine.createSpy('logoff').and.returnValue(throwError(() => new Error('Logoff failed')));
    
    // Invoca el método directamente para asegurarse de que el temporizador se ejecuta
    service['resetLogoutTimer']();
    
    tick(service['INACTIVITY_LIMIT']);
    
    expect(authService.logoff).toHaveBeenCalledWith({ logoff: true });
    expect(router.navigate).not.toHaveBeenCalled(); // No se debe redirigir en caso de error
    expect(window.alert).not.toHaveBeenCalled(); // No se debe mostrar la alerta si hay un error
    flush(); // Asegura que se limpian los temporizadores pendientes
  }));
});
