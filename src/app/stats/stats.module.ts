import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';

import { StatsRoutingModule } from './stats-routing.module';
import { MainComponent } from './page/main/main.component';
import { StatsComponent } from './page/stats/stats.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CardModule, InputFieldModule, SpinnerModule } from 'g-ui';
import { GasStatsComponent } from './components/gas-stats/gas-stats.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';


@NgModule({
  declarations: [MainComponent, StatsComponent, GasStatsComponent, StatCardComponent],
  imports: [
    CommonModule,
    StatsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    SpinnerModule,
    InputFieldModule,
    CardModule
  ],
  providers: [TitleCasePipe]
})
export class StatsModule { }
