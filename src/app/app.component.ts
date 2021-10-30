import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private title: Title
  ) {
  }

  ngOnInit(): void {
    this.title.setTitle('Gas Advisor');
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapbox.token;
  }

  get height(): string {
    return window.innerHeight + 'px';
  }

}
