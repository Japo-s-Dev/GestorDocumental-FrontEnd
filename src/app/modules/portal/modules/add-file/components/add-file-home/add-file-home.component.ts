import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-file-home',
  templateUrl: './add-file-home.component.html',
  styleUrls: ['./add-file-home.component.css']
})
export class AddFileHomeComponent implements OnInit {
  form!: FormGroup;
  uploadedFileName: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      project: [''],
      idLiquidacion: [''],
      nombre: [''],
      transaccion: [''],
      fecha: [''],
      status: ['']
    });
    this.uploadedFileName = localStorage.getItem('uploadedFile');
  }

  onSave() {
    // Add save logic here
  }

  navigateToUpload() {
    this.router.navigate(['/portal/add/upload-document']);
  }
}
