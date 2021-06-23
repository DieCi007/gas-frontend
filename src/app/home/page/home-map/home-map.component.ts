import { Component, OnInit } from '@angular/core';
import { GeoJSONSource, Map } from 'mapbox-gl';
import { map } from '../../../utils/map-utils';
import { bindNodeCallback, combineLatest, of, Subject } from 'rxjs';
import { StationService } from '../../service/station.service';
import { debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import { StationLocation } from '../../model/station-location';

const ICON = 'icon';
const ICON_GREEN = 'icon-green';
const STATIONS_LAYER = 'stations-layer';
const SELECTED_LAYER = 'selected-layer';
const dark = 'mapbox://styles/dieci007/ckq44rcoy4h0317p8a5vojnxn?optimize=true';
const light = 'mapbox://styles/dieci007/ckq5jyzja2cem18qcz9ddfs4t?optimize=true';

@Component({
  selector: 'app-home-map',
  templateUrl: './home-map.component.html',
  styleUrls: ['./home-map.component.scss']
})
export class HomeMapComponent implements OnInit {
  map: Map;
  isDarkTheme = true;
  showDetailDialog = false;
  selectedStationId: number;

  styleChange = new Subject<string>();

  constructor(
    private service: StationService
  ) {
  }

  ngOnInit(): void {
    this.map = map('map');
    this.map.on('load', () => {
      this.loadStations();
      this.addMapClickListeners();
    });
    // this.loadLocation();
    this.styleChange.pipe(
      debounceTime(1500),
      distinctUntilChanged(),
      tap(() => {
        this.map.removeImage(ICON);
        this.map.removeImage(ICON_GREEN);
      })
    ).subscribe(style => {
      this.map.setStyle(style);
      this.loadStations();
    });
  }

  private loadStations(): void {
    const loadIcon$ = bindNodeCallback(this.map.loadImage.bind(this.map));
    const iconStyle = this.isDarkTheme ? 'white' : 'black';
    combineLatest([
      this.map.hasImage(ICON) ? of(null) : loadIcon$(`../../../assets/ui/map/fuel-${iconStyle}.png`)
        .pipe(tap(icon => this.map.addImage(ICON, icon as any))),
      this.map.hasImage(ICON_GREEN) ? of(null) : loadIcon$('../../../assets/ui/map/fuel-green.png')
        .pipe(tap(green => this.map.addImage(ICON_GREEN, green as any)))])
      .subscribe(() => {
        this.getAllStations();
      });
  }

  private getAllStations(): void {
    this.service.getAllStations().pipe(
      tap(stations => {
        this.addStationsSource(stations);
        this.addStationsLayer();
        this.addSelectedSource();
        this.addSelectedLayer();
      })
    ).subscribe();
  }

  private addStationsSource(stations: StationLocation[]): void {
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
            station: s
          }
        }))
      }
    });
  }

  private addStationsLayer(): void {
    this.map.addLayer({
      id: STATIONS_LAYER,
      type: 'symbol',
      source: STATIONS_LAYER,
      layout: {
        'icon-image': ICON,
        'icon-allow-overlap': false,
        'icon-size': .8
      }
    });
  }

  private addSelectedSource(): void {
    this.map.addSource(SELECTED_LAYER, {
      type: 'geojson',
      data: null,
    });
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

  onThemeChange(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.styleChange.next(this.isDarkTheme ? dark : light);
  }

  private addSelectedLayer(): void {
    this.map.addLayer({
      id: SELECTED_LAYER,
      type: 'symbol',
      source: SELECTED_LAYER,
      layout: {
        'icon-image': ICON_GREEN,
        'icon-size': .8
      }
    });
  }

  private addMapClickListeners(): void {
    this.map.on('click', STATIONS_LAYER, e => {
      if (e.features[0]) {
        const station = JSON.parse(e.features[0].properties?.station);
        const coordinates = [station?.longitude, station?.latitude];
        (this.map.getSource(SELECTED_LAYER) as GeoJSONSource).setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates
          },
          properties: null
        });
        this.map.panTo(e.lngLat);
        this.selectedStationId = station?.id;
        this.showDetailDialog = true;
      }
    });

    this.map.on('mouseover', STATIONS_LAYER, () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', STATIONS_LAYER, () => {
      this.map.getCanvas().style.cursor = '';
    });
  }
}
