import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParameterManagerService {
  private parametersSubject = new BehaviorSubject<any>({});
  parameters$: Observable<any> = this.parametersSubject.asObservable();

  constructor() { }

  sendParameters(params: any): void {
    this.parametersSubject.next(params);
  }

  getParameters(): any {
    return this.parametersSubject.value;
  }
}
