import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { IModalInjectionData, MODAL_DATA } from '../../../../../../gas-angular-ui/dist/g-ui';
import { OverlayRef } from '@angular/cdk/overlay';
import { StationService } from '../../service/station.service';
import { tap } from 'rxjs/operators';
import { INearestStationResponse } from '../../model/INearestStationResponse';
import { ILocation } from '../../../shared/model/ILocation';
import { IStationLocation } from '../../model/IStationLocation';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ISelectInputData } from '../../../shared/component/select-input/select-input.component';
import { CommonFuelType } from '../../../shared/model/CommonFuelType';
import { ProvinceService } from '../../../stats/service/province.service';
import { MunicipalityService } from '../../../stats/service/municipality.service';
import { LS_FILTER } from '../../../utils/constants';
import { IFilterStationRequest } from '../../model/IFilterStationRequest';

@Component({
  selector: 'app-filter-stations',
  templateUrl: './filter-stations.component.html',
  styleUrls: ['./filter-stations.component.scss', '../price-table/price-table.component.scss']
})
export class FilterStationsComponent implements OnInit {

  overlayRef: OverlayRef;
  nearestStations: INearestStationResponse[];
  rowClick = new EventEmitter<IStationLocation>();
  filter = new EventEmitter<IFilterStationRequest>();
  provinceOptions: ISelectInputData<string>[] = [];
  municipalityOptions: ISelectInputData<string>[] = [];
  fuelOptions: ISelectInputData<string>[] = Object.values(CommonFuelType).map(v => ({
    label: v,
    value: CommonFuelType[v]
  }));
  distanceOptions = [
    {label: '5', value: '5000'},
    {label: '10', value: '10000'},
    {label: '25', value: '25000'},
    {label: '50', value: '50000'},
  ];
  filterForm: FormGroup;
  savedFilter: IFilterStationRequest;

  constructor(
    @Inject(MODAL_DATA) public data: IModalInjectionData,
    private service: StationService,
    private fb: FormBuilder,
    private provinceService: ProvinceService,
    private municipalityService: MunicipalityService,
  ) {
    this.overlayRef = data?.overlayRef;
    this.savedFilter = data?.filter;
  }

  ngOnInit(): void {
    if (this.service.lastKnownLocation) {
      this.loadNearestStations(this.service.lastKnownLocation);
    }
    this.filterForm = this.fb.group({
      province: [this.savedFilter?.province ?? null],
      municipality: [this.savedFilter?.municipality ?? null],
      fuel: [this.savedFilter?.fuel ?? null],
      distance: [this.savedFilter?.distance ?? null],
      remember: [!!this.savedFilter],
    });
    this.loadProvinces();
    if (this.province.value) {
      this.loadMunicipalities(this.province.value);
    }

    this.province.valueChanges.pipe(
      tap(value => {
        if (!value) {
          this.municipalityOptions = [];
          this.municipality.setValue(null);
        } else {
          this.loadMunicipalities(value);
        }
      })
    ).subscribe();
  }

  loadNearestStations(location: ILocation): void {
    this.service.getNearestStations(location.lat, location.lon).pipe(
      tap(stations => this.nearestStations = stations)
    ).subscribe();
  }

  loadProvinces(): void {
    this.provinceService.getAllProvinces().pipe(
      tap(r => {
        this.provinceOptions = r.map(p => ({
          label: p,
          value: p
        }));
      })
    ).subscribe();
  }

  loadMunicipalities(province: string): void {
    this.municipalityService.getAllMunicipalities(province).pipe(
      tap(m => {
        this.municipalityOptions = m.map(municipality => ({
          label: municipality,
          value: municipality
        }));
      })
    ).subscribe();
  }

  onCloseClick(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }

  onRowClick(station: INearestStationResponse): void {
    this.overlayRef?.detach();
    this.rowClick.emit(station);
  }


  get province(): FormControl {
    return this.filterForm.get('province') as FormControl;
  }

  get municipality(): FormControl {
    return this.filterForm.get('municipality') as FormControl;
  }

  get fuel(): FormControl {
    return this.filterForm.get('fuel') as FormControl;
  }

  get remember(): FormControl {
    return this.filterForm.get('remember') as FormControl;
  }

  onFormSubmit(): void {
    const {remember, ...filterData} = this.filterForm.value;
    const hasTruthy = hasTruthyValues(filterData);
    if (remember && hasTruthy) {
      localStorage.setItem(LS_FILTER, JSON.stringify(filterData));
    } else if (!remember || !hasTruthy) {
      localStorage.removeItem(LS_FILTER);
    }
    this.overlayRef.detach();
    this.filter.emit(filterData);
  }

}

export const hasTruthyValues = (x: object): boolean => {
  return !!Object.keys(x).find(prop => !!x[prop]);
};
