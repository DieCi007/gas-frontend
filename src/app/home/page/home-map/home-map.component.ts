import { Component, OnInit } from '@angular/core';
import { Map } from 'mapbox-gl';
import { map } from '../../../utils/map-utils';

@Component({
  selector: 'app-home-map',
  templateUrl: './home-map.component.html',
  styleUrls: ['./home-map.component.scss']
})
export class HomeMapComponent implements OnInit {
  map: Map;

  constructor() {
  }

  ngOnInit(): void {
    this.map = map('map');
    this.getLocation();
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        this.map.panTo([longitude, latitude], {duration: 1000});
        this.map.zoomTo(8, {duration: 1000});
      });
    } else {
      console.log('Cannot retrieve device location');
    }
  }

}
