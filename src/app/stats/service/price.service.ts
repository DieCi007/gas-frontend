import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IAppStatsResponse } from '../model/IAppStatsResponse';
import { toIsoStringWithLocalOffset } from '../../shared/service/TimeUtils';

const CONTROLLER_PATH = '/api/v1/gas/price';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  constructor(
    private http: HttpClient
  ) {
  }

  getStats(date: Date, province?: string): Observable<IAppStatsResponse> {
    const dateParam = toIsoStringWithLocalOffset(date);
    let params = new HttpParams().set('date', dateParam);
    if (province) {
      params = params.set('province', province);
    }
    return this.http.get<IAppStatsResponse>(environment.api + CONTROLLER_PATH + '/stats', {params});
  }
}
