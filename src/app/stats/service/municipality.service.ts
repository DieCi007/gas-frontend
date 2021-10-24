import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const CONTROLLER_PATH = '/api/v1/municipality';

@Injectable({
  providedIn: 'root'
})
export class MunicipalityService {

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * API restricted to admin
   */
  getAllMunicipalities(province: string): Observable<string[]> {
    const params = new HttpParams().set('province', province);
    return this.http.get<string[]>(environment.api + CONTROLLER_PATH, {params});
  }
}
