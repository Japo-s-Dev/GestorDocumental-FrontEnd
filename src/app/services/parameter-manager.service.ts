import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParameterManagerService {
  private parametersSource = new BehaviorSubject<any>({});
  parameters$ = this.parametersSource.asObservable();

  constructor() { }

  // Obtiene parámetros compartidos como un observable
  getSharedParameter() {
    return this.parameters$;
  }

  // Envía y guarda los parámetros en localStorage
  sendParameters(newParameters: any): void {
    let parameterListStorage = this.getStoredParameters();
    for (const key in newParameters) {
      parameterListStorage[key] = newParameters[key];
    }
    this.saveParameters(parameterListStorage);
    this.parametersSource.next(parameterListStorage);
  }

  // Obtiene un parámetro específico por nombre
  getParameter<T = any>(nameParameter: string): T | undefined {
    const parameterListStorage = this.getStoredParameters();
    return parameterListStorage[nameParameter] ? parameterListStorage[nameParameter] : undefined;
  }

  // Obtiene los parámetros almacenados del localStorage
  private getStoredParameters(): any {
    const storedParams = localStorage.getItem('parameterList');
    return storedParams ? JSON.parse(storedParams) : {};
  }

  // Guarda los parámetros en localStorage
  private saveParameters(params: any): void {
    localStorage.setItem('parameterList', JSON.stringify(params));
  }
}
