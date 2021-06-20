import { Component, OnInit } from '@angular/core';
import { Map } from 'mapbox-gl';
import { map } from '../../../utils/map-utils';
import { bindNodeCallback } from 'rxjs';
import { StationService } from '../../service/station.service';
import { tap } from 'rxjs/operators';

const ICON_WHITE = 'ICON_WHITE';
const ICON_BLACK = 'ICON_BLACK';
const STATIONS_LAYER = 'stations-layer';

@Component({
  selector: 'app-home-map',
  templateUrl: './home-map.component.html',
  styleUrls: ['./home-map.component.scss']
})
export class HomeMapComponent implements OnInit {
  map: Map;

  constructor(
    private service: StationService
  ) {
  }

  ngOnInit(): void {
    this.map = map('map');
    this.map.on('load', () => {
      this.loadStations();
    });
    this.loadLocation();
  }

  private loadStations(): void {
    const loadIcon$ = bindNodeCallback(this.map.loadImage.bind(this.map));
    if (!this.map.hasImage(ICON_WHITE)) {
      loadIcon$('../../../assets/ui/map/fuel-white.png').subscribe(image => {
        this.service.getAllStations().pipe(
          tap(() => this.map.addImage(ICON_WHITE, image as any, {pixelRatio: 1.5})),
          tap(stations => {
            this.map.addSource(STATIONS_LAYER, {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: stations.map(s => ({
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [s.longitude, s.latitude]
                  },
                  properties: {
                    id: s.id
                  }
                }))
              }
            });
            this.map.addLayer({
              id: STATIONS_LAYER,
              type: 'symbol',
              source: STATIONS_LAYER,
              layout: {
                'icon-image': ICON_WHITE,
                'icon-allow-overlap': false
              }
            });
            this.map.on('click', STATIONS_LAYER, e => {
              if (e.features[0]) {
                this.map.panTo(e.lngLat);
                const id = e.features[0].properties?.id;
                this.service.getStationById(id).subscribe(r => console.log(r));
              }
            });

            this.map.on('mouseover', STATIONS_LAYER, () => {
              this.map.getCanvas().style.cursor = 'pointer';
            });
            this.map.on('mouseleave', STATIONS_LAYER, () => {
              this.map.getCanvas().style.cursor = '';
            });
          })
        ).subscribe();
      });
    }
  }

  loadLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        this.map.flyTo({
          center: [longitude, latitude],
          speed: 0.5,
          zoom: 9
        });
      });
    } else {
      console.log('Cannot retrieve device location');
    }
  }

}
