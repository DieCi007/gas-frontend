import { Component, OnInit } from '@angular/core';
import { StationService } from '../../../home/service/station.service';
import { Map } from 'mapbox-gl';
import { map } from '../../../utils/map-utils';
import { tap } from 'rxjs/operators';
import { StationLocation } from '../../../home/model/station-location';

const HEAT_LAYER = 'heat-layer';

@Component({
  selector: 'app-heatmap-map',
  templateUrl: './heatmap-map.component.html',
  styleUrls: ['./heatmap-map.component.scss']
})
export class HeatmapMapComponent implements OnInit {
  map: Map;

  constructor(
    private service: StationService
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
      tap(stations => {
        this.addHeatSource(stations);
        this.addHeatLayer();
      }),
    ).subscribe();
  }

  private addHeatSource(stations: StationLocation[]): void {
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
          0,
          2,
          9,
          20
        ]
      }
    });
  }
}
