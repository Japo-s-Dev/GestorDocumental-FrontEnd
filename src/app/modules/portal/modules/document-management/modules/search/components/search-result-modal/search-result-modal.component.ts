import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicesService } from '../../../../services/services.service';
import { IExpedientRequest, IIndex, IValue, IValueRequest } from '../../../../interfaces/services.interface';

@Component({
  selector: 'app-search-result-modal',
  templateUrl: './search-result-modal.component.html',
  styleUrls: ['./search-result-modal.component.css']
})
export class SearchResultModalComponent implements OnInit {
  @Input() isEditMode = false;
  @Input() expedientId: number = 0;
  @Input() projectId: number = 0;
  @Input() indices: IIndex[] = [];

  expedientForm!: FormGroup;
  showWarningAlert = false;
  alertMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    if (this.isEditMode && this.expedientId) {
      this.loadExpedientData();
    }
  }

  initializeForm(): void {
    this.expedientForm = this.fb.group({
      tag: ['', Validators.required]
    });

    this.indices.forEach(index => {
      this.expedientForm.addControl(
        index.index_name,
        this.fb.control('', index.required ? Validators.required : [])
      );
    });
  }

  loadExpedientData(): void {
    // Obtener el expediente por ID
    this.servicesService.getArchiveById(this.expedientId!).subscribe(response => {
      const expedient = response.body.result;
      this.expedientForm.patchValue({ tag: expedient.tag });

      // Obtener y cargar los valores existentes
      this.servicesService.listValues().subscribe(valueResponse => {
        const values = valueResponse.body.result.filter(
          (value: any) => value.archive_id === this.expedientId
        );
        values.forEach((value: any) => {
          const index = this.indices.find(idx => idx.id === value.index_id);
          if (index) {
            this.expedientForm.patchValue({ [index.index_name]: value.value });
          }
        });
      });
    });
  }

  saveExpedient(): void {
    if (this.expedientForm.invalid) {
      this.expedientForm.markAllAsTouched();
      this.showAlert('Por favor, completa todos los campos requeridos.');
      return;
    }
    const formValue = this.expedientForm.value;
    const expedientData: IExpedientRequest = {
      project_id: Number(this.projectId),
      tag: formValue.tag
    };

    if (this.isEditMode && this.expedientId) {
      this.servicesService.updateArchive(Number(this.expedientId), { tag: expedientData.tag }).subscribe(
        () => {
          this.saveValues(this.expedientId);
          this.activeModal.close('updated');
        },
        (error) => {
          console.error('Error al actualizar el expediente', error);
        }
      );
    } else {
      // Crear un nuevo expediente
      this.servicesService.createArchive(expedientData).subscribe(
        (response) => {
          const createdExpedientId = response.body.result.id;
          this.saveValues(createdExpedientId);
          this.activeModal.close('created');
        },
        (error) => {
          console.error('Error al crear el expediente', error);
        }
      );
    }
  }

  saveValues(expedientId: number): void {
    this.servicesService.listValues().subscribe(valueResponse => {
      const existingValues: IValue[] = valueResponse.body.result.filter(
        (value: IValue) => value.archive_id === expedientId
      );

      Object.keys(this.expedientForm.controls).forEach(controlKey => {
        if (controlKey !== 'tag') {
          const index = this.indices.find(idx => idx.index_name === controlKey);
          if (index) {
            let value = this.expedientForm.get(controlKey)?.value || '';

            const existingValue = existingValues.find((val: IValue) => val.index_id === index.id);

            if (this.isEditMode && existingValue) {
              this.servicesService.updateValue(existingValue.id, value).subscribe({
                next: (res) => console.log(''),
                error: (err) => console.error('')
              });
            } else {
              const valueData: IValueRequest = {
                index_id: index.id,
                project_id: Number(this.projectId),
                archive_id: Number(expedientId),
                value: value,
              };

              this.servicesService.createValue(valueData).subscribe({
                next: (res) => console.log('Valor creado:', res),
                error: (err) => console.error('Error al crear el valor:', err)
              });
            }
          }
        }
      });
    });
  }

  getInputType(datatypeId: number): string {
    switch (datatypeId) {
      case 2:
        return 'number';
      case 3:
        return 'text';
      case 4:
        return 'number';
      case 5:
        return 'date';
      default:
        return 'text';
    }
  }

  close(): void {
    this.activeModal.dismiss();
  }

  showAlert(message: string): void {
    this.alertMessage = message;
    this.showWarningAlert = true;

    setTimeout(() => {
      this.closeAlert();
    }, 5000);
  }

  closeAlert(): void {
    this.showWarningAlert = false;
  }
}
