import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeMainComponent } from './page/home-main/home-main.component';
import { HomeMapComponent } from './page/home-map/home-map.component';
import { RouterModule } from '@angular/router';
import { HomeRoutingModule } from './home-routing.module';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { StationDetailsComponent } from './component/station-details/station-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputFieldModule, ModalModule, SpinnerModule, SunsetModule } from 'g-ui';
import { PriceTableComponent } from './component/price-table/price-table.component';
import { DividerModule } from 'primeng/divider';

@NgModule({
  declarations: [
    HomeMainComponent, HomeMapComponent,
    StationDetailsComponent,
    PriceTableComponent],
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule,
    DialogModule,
    RippleModule,
    ReactiveFormsModule,
    ModalModule,
    SpinnerModule,
    SunsetModule,
    InputFieldModule,
    DividerModule
  ]
})
export class HomeModule {
}
