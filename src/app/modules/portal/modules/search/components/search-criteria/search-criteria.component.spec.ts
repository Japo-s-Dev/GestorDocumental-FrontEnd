import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { SearchCriteriaComponent } from './search-criteria.component';
import { FormConfigService } from '../../services/form-config.service';

describe('SearchCriteriaComponent', () => {
  let component: SearchCriteriaComponent;
  let fixture: ComponentFixture<SearchCriteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchCriteriaComponent ],
      imports: [
        ReactiveFormsModule, // Importa ReactiveFormsModule
        FormsModule, // Importa FormsModule para [(ngModel)]
        HttpClientTestingModule, // Importa HttpClientTestingModule
        FormlyModule.forRoot(), // Importa FormlyModule
        FormlyBootstrapModule // Importa FormlyBootstrapModule si los usas en tu componente
      ],
      providers: [FormConfigService] // Proporciona el servicio utilizado por el componente
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
