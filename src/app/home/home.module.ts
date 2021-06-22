import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeMainComponent } from './page/home-main/home-main.component';
import { HomeMapComponent } from './page/home-map/home-map.component';
import { RouterModule } from '@angular/router';
import { HomeRoutingModule } from './home-routing.module';
import { SunsetComponent } from './component/sunset/sunset.component';



@NgModule({
  declarations: [HomeMainComponent, HomeMapComponent, SunsetComponent],
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
