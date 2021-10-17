import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const CONTROLLER_PATH = '/api/v1/province';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  constructor(
    private http: HttpClient
  ) {
  }

  getAllProvinces(): Observable<string[]> {
    return this.http.get<string[]>(environment.api + CONTROLLER_PATH);
  }
}
