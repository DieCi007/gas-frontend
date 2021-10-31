import { Component, OnInit } from '@angular/core';
import { StationService } from '../../../home/service/station.service';
import { Map } from 'mapbox-gl';
import { map } from '../../../utils/map-utils';
import { catchError, tap } from 'rxjs/operators';
import { IStationLocation } from '../../../home/model/IStationLocation';
import { throwError } from 'rxjs';
import { ModalService } from 'g-ui';

const HEAT_LAYER = 'heat-layer';

@Component({
  selector: 'app-heatmap-map',
  templateUrl: './heatmap-map.component.html',
  styleUrls: ['./heatmap-map.component.scss']
})
export class HeatmapMapComponent implements OnInit {
  map: Map;

  constructor(
    private service: StationService,
    private modalService: ModalService
  ) {
  }

  ngOnInit(): void {
    this.map = map('heatmap-map', 'light');
    this.map.on('load', this.onMapLoad);
  }

  onMapLoad = () => {
    this.loadStations();
    setTimeout(() => {
      this.map.resize();
    }, 500);
  };

  private loadStations(): void {
    this.service.getAllStations().pipe(
      catchError(err => {
        this.modalService.handleError(err.error);
        return throwError(err);
      }),
      tap(stations => {
        this.addHeatSource(stations);
        this.addHeatLayer();
      }),
    ).subscribe();
  }

  private addHeatSource(stations: IStationLocation[]): void {
    this.map.addSource(HEAT_LAYER, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: stations.map(s => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [s.longitude, s.latitude]
          },
          properties: {}
        }))
      }
    });
  }

  private addHeatLayer(): void {
    this.map.addLayer({
      id: HEAT_LAYER,
      type: 'heatmap',
      source: HEAT_LAYER,
      paint: {
        'heatmap-intensity': {
          stops: [
            [6, 1],
            [7, 2],
            [8, 3],
            [8, 4],
            [11, 6]
          ]
        },
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          1,
          0,
          0,
          2,
          1
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          1,
          1,
          10,
          12
        ]
      }
    });
  }
}
