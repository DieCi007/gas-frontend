import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IAppStatsResponse } from '../model/IAppStatsResponse';
import { toIsoStringWithLocalOffset } from '../../shared/service/TimeUtils';
import { CommonFuelType } from '../../shared/model/CommonFuelType';
import { PriceStatType } from '../../shared/model/PriceStatType';
import { IDatePrice } from '../model/IDatePrice';
import { map } from 'rxjs/operators';
import { IFlagFuelStatResponse } from '../model/FlagFuelStatResponse';

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

  getPriceTrend(fuelType: CommonFuelType, statType: PriceStatType): Observable<IDatePrice[]> {
    const params = new HttpParams().set('fuelType', fuelType).set('statType', statType);
    return this.http.get<IDatePrice[]>(environment.api + CONTROLLER_PATH + '/stats/price-trend', {params})
      .pipe(
        map(r => r.map(d => ({
          ...d,
          date: new Date(d.date)
        })))
      );
  }

  getFlagPriceStat(): Observable<IFlagFuelStatResponse[]> {
    return this.http.get<IFlagFuelStatResponse[]>(environment.api + CONTROLLER_PATH + '/stats/fuel-flag');
  }
}
