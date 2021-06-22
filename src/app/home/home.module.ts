import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeMainComponent } from './page/home-main/home-main.component';
import { HomeMapComponent } from './page/home-map/home-map.component';
import { RouterModule } from '@angular/router';
import { HomeRoutingModule } from './home-routing.module';
import { SunsetComponent } from './component/sunset/sunset.component';
import { DialogComponent } from './component/dialog/dialog.component';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';


@NgModule({
  declarations: [HomeMainComponent, HomeMapComponent, SunsetComponent, DialogComponent],
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule,
    DialogModule,
    RippleModule
  ]
})
export class HomeModule {
}
