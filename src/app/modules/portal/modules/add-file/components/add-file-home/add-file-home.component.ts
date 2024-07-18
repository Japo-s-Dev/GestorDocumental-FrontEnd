import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-file-home',
  templateUrl: './add-file-home.component.html',
  styleUrls: ['./add-file-home.component.css']
})
export class AddFileHomeComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      project: [''],
      idLiquidacion: [''],
      nombre: [''],
      transaccion: [''],
      fecha: [''],
      status: ['']
    });
  }

  onSave() {
    // Add save logic here
  }
}
