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
import { ButtonModule, InputFieldModule, ModalModule, ModalService, SpinnerModule, SunsetModule } from 'g-ui';
import { PriceTableComponent } from './component/price-table/price-table.component';
import { TooltipModule } from 'primeng/tooltip';
import { FilterStationsComponent } from './component/filter-stations/filter-stations.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    HomeMainComponent, HomeMapComponent,
    StationDetailsComponent,
    PriceTableComponent,
    FilterStationsComponent],
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
        TooltipModule,
        SharedModule,
        ButtonModule,
    ],
  providers: []
})
export class HomeModule {
}
