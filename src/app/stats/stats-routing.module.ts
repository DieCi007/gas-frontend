import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './page/main/main.component';
import { StatsComponent } from './page/stats/stats.component';

const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      {path: '', component: StatsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatsRoutingModule {
}
