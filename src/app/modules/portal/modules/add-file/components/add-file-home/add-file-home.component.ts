import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-file-home',
  templateUrl: './add-file-home.component.html',
  styleUrls: ['./add-file-home.component.css']
})
export class AddFileHomeComponent implements OnInit {
  form!: FormGroup;
  uploadedFileName: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      project: ['', Validators.required],
      idLiquidacion: ['', Validators.required],
      nombre: ['', Validators.required],
      transaccion: ['', Validators.required],
      departamento: ['', Validators.required],
      fecha: ['', Validators.required],
      status: ['', Validators.required]
    });

    // Restaurar el estado del formulario
    const savedFormState = localStorage.getItem('formState');
    if (savedFormState) {
      this.form.setValue(JSON.parse(savedFormState));
    }

    this.uploadedFileName = localStorage.getItem('uploadedFile');
  }

  onSave() {
    if (this.form.valid && this.uploadedFileName) {
      localStorage.removeItem('uploadedFile');
      localStorage.removeItem('formState');
      this.uploadedFileName = null;
      this.form = this.fb.group({
        project: [''],
        idLiquidacion: [''],
        nombre: [''],
        transaccion: [''],
        departamento: [''],
        fecha: [''],
        status: ['']
      });
      this.router.navigate(['/portal/add/file-entry']);
    } else {
      this.errorMessage = "Por favor complete todos los campos y cargue un documento antes de guardar.";
    }
  }

  navigateToUpload() {
    // Guardar el estado del formulario antes de navegar
    localStorage.setItem('formState', JSON.stringify(this.form.value));
    this.router.navigate(['/portal/add/upload-document']);
  }
}
