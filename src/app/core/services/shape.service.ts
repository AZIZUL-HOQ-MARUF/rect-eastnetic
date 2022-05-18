import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {

  constructor(private _apiService: ApiService) { }


  public getShape(): Observable<any> {
    return this._apiService.get('/size/get-shape');
  }
  
  public saveShape(shape: any): Observable<any> {
    return this._apiService.post('/size/create-shape', shape);
  }

}
