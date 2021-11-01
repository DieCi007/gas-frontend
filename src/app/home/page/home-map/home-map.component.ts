import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeoJSONSource, GeolocateControl, Map } from 'mapbox-gl';
import { getStyle, map } from '../../../utils/map-utils';
import { bindNodeCallback, combineLatest, Observable, of, Subject, Subscription, throwError } from 'rxjs';
import { StationService } from '../../service/station.service';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { IStationLocation } from '../../model/IStationLocation';
import { ModalService } from 'g-ui';
import { FilterStationsComponent, hasTruthyValues } from '../../component/filter-stations/filter-stations.component';
import { LS_FILTER, LS_MAP_THEME } from '../../../utils/constants';
import { IFilterStationRequest } from '../../model/IFilterStationRequest';

const ICON = 'icon';
const ICON_DARK = 'icon_dark';
const ICON_GREEN = 'icon-green';
const STATIONS_LAYER = 'stations-layer';
const SELECTED_LAYER = 'selected-layer';

@Component({
  selector: 'app-home-map',
  templateUrl: './home-map.component.html',
  styleUrls: ['./home-map.component.scss']
})
export class HomeMapComponent implements OnInit, OnDestroy {
  map: Map;
  savedStyle = localStorage.getItem(LS_MAP_THEME);
  defaultStyle: 'dark' | 'light' = !this.savedStyle ? 'dark' : this.savedStyle === 'light' ? 'light' : 'dark';
  isDarkTheme = this.defaultStyle === 'dark';
  showDetailDialog = false;
  selectedStation: IStationLocation;
  watchLocationId: number;
  styleChange = new Subject<'dark' | 'light'>();
  control = new GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
    showUserLocation: true,
  });
  nearestTableClickSubscription: Subscription;
  filterSubscription: Subscription;
  private stations: IStationLocation[];

  constructor(
    private service: StationService,
    private modalService: ModalService
  ) {
  }

  ngOnInit(): void {
    if (navigator.geolocation) {
      this.watchLocationId = navigator.geolocation.watchPosition(location => {
        this.service.lastKnownLocation = {
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        };
      });
    }
    this.map = map('home-map', this.defaultStyle);
    this.map.addControl(this.control, 'bottom-right');
    this.map.on('load', this.onMapLoad);
    this.styleChange.pipe(
      debounceTime(1500),
      distinctUntilChanged(),
    ).subscribe(s => {
      localStorage.setItem(LS_MAP_THEME, s);
      this.map.setStyle(getStyle(s));
      this.map.once('styledata', this.onStyleChange);
    });
  }

  onStyleChange = () => {
    if (this.map.getLayer(STATIONS_LAYER)) {
      this.map.removeLayer(STATIONS_LAYER);
    }
    if (this.map.getLayer(SELECTED_LAYER)) {
      this.map.removeLayer(SELECTED_LAYER);
    }
    if (this.map.getSource(STATIONS_LAYER)) {
      this.map.removeSource(STATIONS_LAYER);
    }
    if (this.map.getSource(SELECTED_LAYER)) {
      this.map.removeSource(SELECTED_LAYER);
    }
    if (this.map.hasImage(ICON)) {
      this.map.removeImage(ICON);
    }
    if (this.map.hasImage(ICON_DARK)) {
      this.map.removeImage(ICON_DARK);
    }
    if (this.map.hasImage(ICON_GREEN)) {
      this.map.removeImage(ICON_GREEN);
    }
    this.loadStations();
  };

  onMapLoad = () => {
    this.loadStations();
    this.addMapClickListeners();
    this.loadLocation();
    setTimeout(() => {
      this.map.resize();
    }, 500);
  };

  private loadStations(): void {
    const loadIcon$ = bindNodeCallback(this.map.loadImage.bind(this.map));
    combineLatest([
      loadIcon$(`../../../assets/ui/map/fuel-white.png`)
        .pipe(tap(icon => this.map.addImage(ICON, icon as any))),
      loadIcon$(`../../../assets/ui/map/fuel-black.png`)
        .pipe(tap(icon => this.map.addImage(ICON_DARK, icon as any))),
      loadIcon$('../../../assets/ui/map/fuel-green.png')
        .pipe(tap(green => this.map.addImage(ICON_GREEN, green as any)))])
      .subscribe(() => {
        this.getAllStations();
      });
  }

  private getAllStations(): void {
    const savedFilter = getSavedFilter();
    let stations$: Observable<IStationLocation[]>;
    if (this.stations) {
      stations$ = of(this.stations);
    } else if (savedFilter && !savedFilter.province && !savedFilter.municipality &&
      !savedFilter.fuel && savedFilter.distance && !this.service.lastKnownLocation) {
      stations$ = this.service.getAllStations();
    } else if (savedFilter) {
      stations$ = this.service.filterStations(savedFilter as IFilterStationRequest);
    } else {
      stations$ = this.service.getAllStations();
    }
    stations$.pipe(
      catchError(err => {
        this.modalService.handleError(err.error);
        return throwError(err);
      }),
      tap(stations => {
        this.addStationsSource(stations);
        this.addStationsLayer();
        this.addSelectedSource();
        this.addSelectedLayer();
      })
    ).subscribe();
  }

  private addStationsSource(stations: IStationLocation[]): void {
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

  updateStationsSource(res: IStationLocation[]): void {
    const source = this.map.getSource(STATIONS_LAYER);
    if (source) {
      (source as GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: res.map(s => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [s.longitude, s.latitude]
          },
          properties: {
            station: s
          }
        }))
      });
    }
  }

  private addStationsLayer(): void {
    const icon = this.isDarkTheme ? ICON : ICON_DARK;
    this.map.addLayer({
      id: STATIONS_LAYER,
      type: 'symbol',
      source: STATIONS_LAYER,
      layout: {
        'icon-image': icon,
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

  loadLocation(): void {
    setTimeout(() => {
      if (this.control) {
        this.control.trigger();
      }
    }, 2000);
  }

  onThemeChange(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.styleChange.next(this.isDarkTheme ? 'dark' : 'light');
  }

  private addMapClickListeners(): void {
    this.map.on('click', STATIONS_LAYER, e => {
      if (e.features[0]) {
        const station = JSON.parse(e.features[0].properties?.station);
        this.updateSelectedStation(station);
      }
    });

    this.map.on('click', SELECTED_LAYER, e => {
      const station = JSON.parse(e.features[0].properties?.station);
      this.map.panTo(e.lngLat);
      this.selectedStation = station;
      this.showDetailDialog = true;
    });

    this.map.on('mouseover', STATIONS_LAYER, () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', STATIONS_LAYER, () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  updateSelectedStation(station: IStationLocation): void {
    const coordinates = [station?.longitude, station?.latitude];
    (this.map.getSource(SELECTED_LAYER) as GeoJSONSource).setData({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates
      },
      properties: {
        station
      }
    });
    this.map.panTo({lat: station?.latitude, lon: station?.longitude});
    this.selectedStation = station;
    this.showDetailDialog = true;
  }

  onSearchClick(): void {
    const ref = this.modalService.createFromComponent(FilterStationsComponent, {filter: getSavedFilter()});
    const component = ref.componentRef;
    this.nearestTableClickSubscription = component.instance.rowClick.pipe(
      tap(s => this.updateSelectedStation(s))
    ).subscribe();
    this.filterSubscription = component.instance.filter.pipe(
      tap(this.updateStationsFromFilter)
    ).subscribe();
  }

  updateStationsFromFilter = (filter: IFilterStationRequest) => {
    let request$: Observable<IStationLocation[]>;
    if (hasTruthyValues(filter)) {
      request$ = this.service.filterStations(filter);
    } else {
      request$ = this.service.getAllStations();
    }
    request$.pipe(
      catchError(err => {
        this.modalService.handleError(err.error);
        return throwError(err);
      }),
      tap(res => {
        this.stations = res;
        this.updateStationsSource(res);
      })
    ).subscribe();
  };

  ngOnDestroy(): void {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchLocationId);
    }
    if (this.nearestTableClickSubscription) {
      this.nearestTableClickSubscription.unsubscribe();
    }
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

}

const getSavedFilter = (): IFilterStationRequest => {
  try {
    const savedFilter = JSON.parse(localStorage.getItem(LS_FILTER) || '{}');
    const hasCorrectFilter = (!!savedFilter.province ||
      !!savedFilter.fuel || !!savedFilter.distance || !!savedFilter.municipality);
    return hasCorrectFilter ? savedFilter : null;
  } catch (err) {
    localStorage.removeItem(LS_FILTER);
    console.log('-_-');
    return null;
  }
};
