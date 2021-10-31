import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { IModalInjectionData, MODAL_DATA } from '../../../../../../gas-angular-ui/dist/g-ui';
import { OverlayRef } from '@angular/cdk/overlay';
import { StationService } from '../../service/station.service';
import { tap } from 'rxjs/operators';
import { INearestStationResponse } from '../../model/INearestStationResponse';
import { ILocation } from '../../../shared/model/ILocation';
import { IStationLocation } from '../../model/IStationLocation';

@Component({
  selector: 'app-filter-stations',
  templateUrl: './filter-stations.component.html',
  styleUrls: ['./filter-stations.component.scss', '../price-table/price-table.component.scss']
})
export class FilterStationsComponent implements OnInit {

  overlayRef: OverlayRef;
  nearestStations: INearestStationResponse[];
  rowClick = new EventEmitter<IStationLocation>();

  constructor(
    @Inject(MODAL_DATA) public data: IModalInjectionData,
    private service: StationService
  ) {
    this.overlayRef = data?.overlayRef;
  }

  ngOnInit(): void {
    if (this.service.lastKnownLocation) {
      this.loadNearestStations(this.service.lastKnownLocation);
    }
  }

  loadNearestStations(location: ILocation): void {
    this.service.getNearestStations(location.lat, location.lon).pipe(
      tap(stations => this.nearestStations = stations)
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
}
