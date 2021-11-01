import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { ModalService } from '../../../gas-angular-ui/dist/g-ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private title: Title,
    private service: ModalService
  ) {
  }

  ngOnInit(): void {
    this.title.setTitle('Gas Advisor');
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapbox.token;
    this.service.contactMail = environment.contactMail;
    console.log('%cGreat minds think alike 😁 Hai una domanda o curiosità? Contattami: ' + environment.contactMail,
      'color:#ffd54f;font-size:2rem;padding:5px;border:5px inset red');
  }

  get height(): string {
    return window.innerHeight + 'px';
  }

}
