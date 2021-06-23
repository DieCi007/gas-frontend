import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StationLocation } from '../model/station-location';
import { StationData } from '../model/station-data';
import { StationPrice } from '../model/station-price';
import { map } from 'rxjs/operators';

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

  getStationPrice(id: number): Observable<StationPrice[]> {
    return this.http.get<StationPrice[]>(`${this.BASE_URL}/${id}/today`).pipe(
      map(this.serializePrices)
    );
  }

  private serializePrices(prices: StationPrice[]): StationPrice[] {
    return prices.map(p => ({
      ...p,
      readDate: new Date(p.readDate)
    }));
  }
}
