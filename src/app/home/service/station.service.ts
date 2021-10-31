import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IStationLocation } from '../model/IStationLocation';
import { IStationData } from '../model/IStationData';
import { IStationPrice } from '../model/IStationPrice';
import { map, tap } from 'rxjs/operators';
import { INearestStationResponse } from '../model/INearestStationResponse';
import { ILocation } from '../../shared/model/ILocation';

@Injectable({
  providedIn: 'root'
})
export class StationService {
  BASE_URL = environment.api + '/api/v1/gas/station';
  private stations: IStationLocation[] = null;
  lastKnownLocation: ILocation;

  constructor(
    private http: HttpClient
  ) {
  }

  getAllStations(): Observable<IStationLocation[]> {
    // return of([]);
    return this.stations ? of(this.stations) :
           this.http.get<IStationLocation[]>(this.BASE_URL).pipe(
             tap(stations => this.stations = stations)
           );
  }

  getStationById(id: number): Observable<IStationData> {
    return this.http.get<IStationData>(`${this.BASE_URL}/${id}`);
  }

  getStationPrice(id: number): Observable<IStationPrice[]> {
    return this.http.get<IStationPrice[]>(`${this.BASE_URL}/${id}/today`).pipe(
      map(this.serializePrices)
    );
  }

  getNearestStations(lat: number, lon: number): Observable<INearestStationResponse[]> {
    const params = new HttpParams().set('latitude', String(lat)).set('longitude', String(lon));
    return this.http.get<INearestStationResponse[]>(`${this.BASE_URL}/near`, {params}).pipe(
      map(r => r.map(s => ({
        ...s,
        distance: s.distance + s.distance / 2
      })))
    );
  }

  private serializePrices(prices: IStationPrice[]): IStationPrice[] {
    return prices.map(p => ({
      ...p,
      readDate: new Date(p.readDate)
    }));
  }
}
