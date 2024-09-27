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

    const titleElement = fixture.debugElement.query(By.css('.alert-title'));
    const messageElement = fixture.debugElement.query(By.css('.alert-message'));

    expect(titleElement.nativeElement.textContent).toContain('Test Title');
    expect(messageElement.nativeElement.textContent).toContain('Test Message');
  });

  it('should apply the correct alert type and icon type', () => {
    component.alertType = 'alert-success';
    component.iconType = 'icon-success';
    fixture.detectChanges();

    const alertElement = fixture.debugElement.query(By.css('.alert-container'));

    expect(alertElement.nativeElement.classList).toContain('alert-success');
    expect(alertElement.nativeElement.classList).toContain('icon-success');
  });

  it('should emit the closed event when close is called', () => {
    spyOn(component.closed, 'emit');

    component.close();

    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should emit the closed event when the close button is clicked', () => {
    spyOn(component.closed, 'emit');

    const closeButton = fixture.debugElement.query(By.css('.close-button'));
    closeButton.triggerEventHandler('click', null);

    expect(component.closed.emit).toHaveBeenCalled();
  });
});
