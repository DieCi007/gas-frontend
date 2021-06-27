import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeatmapMainComponent } from './page/heatmap-main/heatmap-main.component';
import { HeatmapMapComponent } from './page/heatmap-map/heatmap-map.component';

const routes: Routes = [
  {
    path: '', component: HeatmapMainComponent, children: [
      {path: '', component: HeatmapMapComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeatmapRoutingModule {
}
