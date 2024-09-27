import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { By } from '@angular/platform-browser';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title and message', () => {
    component.title = 'Test Title';
    component.message = 'Test Message';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('strong'));
    const messageElement = fixture.debugElement.query(By.css('div div'));

    expect(titleElement).not.toBeNull(); // Verifica que el título exista
    expect(messageElement).not.toBeNull(); // Verifica que el mensaje exista

    if (titleElement) {
      expect(titleElement.nativeElement.textContent).toContain('Test Title');
    }
    if (messageElement) {
      expect(messageElement.nativeElement.textContent).toContain('Test Message');
    }
  });

  it('should apply the correct alert type and icon type', () => {
    component.alertType = 'alert-success';
    component.iconType = 'icon-success';
    fixture.detectChanges();

    const alertElement = fixture.debugElement.query(By.css('.alert-box'));
    const iconElement = fixture.debugElement.query(By.css('.alert-icon'));

    expect(alertElement).not.toBeNull(); // Verifica que el contenedor de alerta exista
    expect(iconElement).not.toBeNull(); // Verifica que el icono exista

    if (alertElement) {
      expect(alertElement.nativeElement.classList).toContain('alert-success');
    }
    if (iconElement) {
      expect(iconElement.nativeElement.classList).toContain('icon-success');
    }
  });

  it('should emit the closed event when close is called', () => {
    spyOn(component.closed, 'emit');

    component.close();

    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should emit the closed event when the close button is clicked', () => {
    spyOn(component.closed, 'emit');

    const closeButton = fixture.debugElement.query(By.css('.alert-close'));
    
    expect(closeButton).not.toBeNull(); // Verifica que el botón de cierre exista
    if (closeButton) {
      closeButton.triggerEventHandler('click', null);
      expect(component.closed.emit).toHaveBeenCalled();
    }
  });
});
