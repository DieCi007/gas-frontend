import { Component, OnInit } from '@angular/core';
import { ISelectInputData } from '../../../shared/component/select-input/select-input.component';
import { FormBuilder, FormControl } from '@angular/forms';
import { ProvinceService } from '../../service/province.service';
import { ModalService } from 'g-ui';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { Observable, throwError, combineLatest } from 'rxjs';
import { PriceService } from '../../service/price.service';
import { IAppStatsResponse } from '../../model/IAppStatsResponse';
import { CommonFuelType } from '../../../shared/model/CommonFuelType';
import { IPriceStatResponse } from '../../model/IPriceStatResponse';
import { TitleCasePipe } from '@angular/common';
import { addDays } from 'date-fns';

@Component({
  selector: 'app-gas-stats',
  templateUrl: './gas-stats.component.html',
  styleUrls: ['./gas-stats.component.scss']
})
export class GasStatsComponent implements OnInit {

  loading = false;
  provinceData: ISelectInputData<string>[];
  appStats: IAppStatsResponse;
  filterForm = this.fb.group({
    province: [null],
    date: [addDays(new Date(), -1)],
  });
  fuelTypes = Object.values(CommonFuelType).map(t => CommonFuelType[t]);

  constructor(
    private fb: FormBuilder,
    private provinceService: ProvinceService,
    private modalService: ModalService,
    private priceService: PriceService,
    private titleCase: TitleCasePipe
  ) {
  }

  ngOnInit(): void {
    this.loadFiltersAndStats();
    this.filterForm.valueChanges.pipe(
      map(v => v.province === 'null' ? {
        ...v,
        province: null
      } : v),
      tap(f => this.loadStats(f.province, f.date))
    ).subscribe();
  }

  loadFiltersAndStats(): void {
    this.loading = true;
    const province$ = this.provinceService.getAllProvinces().pipe(
      map(res => res.map(r => ({
        label: r,
        value: r
      }))),
      tap(res => this.provinceData = res));
    combineLatest([province$, this.stats$(this.province.value, this.date.value)]).pipe(
      catchError(err => {
        this.loading = false;
        this.modalService.handleError(err.error);
        return throwError(err);
      }),
      finalize(() => this.loading = false)
    ).subscribe();
  }

  loadStats(province: string, date: Date): void {
    this.loading = true;
    this.stats$(province, date).pipe(
      catchError(err => {
        this.loading = false;
        this.modalService.handleError(err.error);
        return throwError(err);
      }),
      finalize(() => this.loading = false)
    ).subscribe();
  }

  stats$(province: string, date: Date): Observable<IAppStatsResponse> {
    return this.priceService.getStats(date, province)
      .pipe(
        tap(r => this.appStats = r)
      );
  }

  get province(): FormControl {
    return this.filterForm.get('province') as FormControl;
  }

  get date(): FormControl {
    return this.filterForm.get('date') as FormControl;
  }

  get mostStationsMunicipalityLabel(): string {
    if (!this.appStats?.mostStationsMunicipality ||
      !this.appStats?.mostStationsMunicipality.municipality ||
      !this.appStats?.mostStationsMunicipality.province) {
      return '--';
    }
    return `${this.titleCase.transform(this.appStats.mostStationsMunicipality
      .municipality)} (${this.appStats.mostStationsMunicipality.province})`;
  }

  get leastStationsMunicipalityLabel(): string {
    if (!this.appStats?.leastStationsMunicipality ||
      !this.appStats?.leastStationsMunicipality.municipality ||
      !this.appStats?.leastStationsMunicipality.province) {
      return '--';
    }
    return `${this.titleCase.transform(this.appStats.leastStationsMunicipality
      .municipality)} (${this.appStats.leastStationsMunicipality.province})`;
  }

  get mostStationsProvinceLabel(): string {
    return this.appStats?.mostStationsProvince || '--';
  }

  get leastStationsProvinceLabel(): string {
    return this.appStats?.leastStationsProvince || '--';
  }

  priceStatsForFuel(fuel: CommonFuelType): IPriceStatResponse[] {
    if (!this.appStats?.priceStats) {
      return null;
    }
    const stats = this.appStats?.priceStats?.filter(p => p.fuelType === fuel);
    return stats?.length > 0 ? stats : null;
  }
}
