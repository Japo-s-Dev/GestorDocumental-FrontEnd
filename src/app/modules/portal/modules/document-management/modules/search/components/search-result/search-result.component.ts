import { Component } from '@angular/core';
import { IResult } from '../../interfaces/result-page.interface';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.css'
})
export class SearchResultComponent {
  results: IResult[] = [
    { nombre: 'Aieto Energies', status: 'Approved', statusClass: 'status approved', idLiquidacion: '0957746KJLY', transaccion: 'BOM-Rizz-0523-001', fecha: '24.12.2020 11:16 AM' },
    { nombre: 'Mark Energies', status: 'Pending', statusClass: 'status pending', idLiquidacion: '0957746KJLY', transaccion: 'BOM-Rizz-0523-001', fecha: '24.12.2020 11:16 AM' },
    { nombre: 'Aieto Energies', status: 'Not Started', statusClass: 'status not-started', idLiquidacion: '0957746KJLY', transaccion: 'BOM-Rizz-0523-001', fecha: '24.12.2020 11:16 AM' },
    { nombre: 'Wells Fargo', status: 'Approved', statusClass: 'status approved', idLiquidacion: '0957746KJLY', transaccion: 'BOM-Rizz-0523-001', fecha: '24.12.2020 11:16 AM' },
    { nombre: 'Coca Cola', status: 'Pending', statusClass: 'status pending', idLiquidacion: '0957746KJLY', transaccion: 'BOM-Rizz-0523-001', fecha: '24.12.2020 11:16 AM' },
    { nombre: 'Coca Cola', status: 'Approved', statusClass: 'status approved', idLiquidacion: '0957746KJLY', transaccion: 'BOM-Rizz-0523-001', fecha: '24.12.2020 11:16 AM' },
    { nombre: 'Mark Energies', status: 'Approved', statusClass: 'status approved', idLiquidacion: '0957746KJLY', transaccion: 'BOM-Rizz-0523-001', fecha: '24.12.2020 11:16 AM' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  edit(result: IResult): void {
    console.log('Edit item', result);
  }

  view(result: IResult): void {
    console.log('View item', result);
  }

  search(): void {
    console.log('Search clicked');
  }
}
