import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';

import { StatsRoutingModule } from './stats-routing.module';
import { MainComponent } from './page/main/main.component';
import { StatsComponent } from './page/stats/stats.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule, GCalendarModule, InputFieldModule, SelectInputModule, SpinnerModule } from 'g-ui';
import { GasStatsComponent } from './components/gas-stats/gas-stats.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { PriceTrendComponent } from './components/price-trend/price-trend.component';
import { FlagFuelStatsComponent } from './components/flag-fuel-stats/flag-fuel-stats.component';


@NgModule({
  declarations: [MainComponent, StatsComponent, GasStatsComponent, StatCardComponent, PriceTrendComponent, FlagFuelStatsComponent],
  imports: [
    CommonModule,
    StatsRoutingModule,
    ReactiveFormsModule,
    SpinnerModule,
    InputFieldModule,
    CardModule,
    SelectInputModule,
    GCalendarModule
  ],
  providers: [TitleCasePipe]
})
export class StatsModule { }
