import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StationLocation } from '../model/station-location';
import { StationData } from '../model/station-data';

@Injectable({
  providedIn: 'root'
})
export class StationService {
  BASE_URL = environment.api + '/api/v1/gas/station';

  constructor(
    private http: HttpClient
  ) {
  }

  getAllStations(): Observable<StationLocation[]> {
    return this.http.get<StationLocation[]>(this.BASE_URL);
  }

  getStationById(id: number): Observable<StationData> {
    return this.http.get<StationData>(`${this.BASE_URL}/${id}`);
  }

}
