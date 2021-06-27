import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeatmapMainComponent } from './page/heatmap-main/heatmap-main.component';
import { HeatmapMapComponent } from './page/heatmap-map/heatmap-map.component';
import { HeatmapRoutingModule } from './heatmap-routing.module';


@NgModule({
  declarations: [HeatmapMainComponent, HeatmapMapComponent],
  imports: [
    CommonModule,
    HeatmapRoutingModule
  ]
})
export class HeatmapModule {
}
