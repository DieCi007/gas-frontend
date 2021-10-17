import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatsRoutingModule } from './stats-routing.module';
import { MainComponent } from './page/main/main.component';
import { StatsComponent } from './page/stats/stats.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { InputFieldModule, SpinnerModule } from '../../../../gas-angular-ui/dist/g-ui';


@NgModule({
  declarations: [MainComponent, StatsComponent],
  imports: [
    CommonModule,
    StatsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    SpinnerModule,
    InputFieldModule
  ]
})
export class StatsModule { }
