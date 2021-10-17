import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', loadChildren: () => import('./home/home.module').then(mod => mod.HomeModule)},
  {path: 'heatmap', loadChildren: () => import('./heatmap/heatmap.module').then(mod => mod.HeatmapModule)},
  {path: 'statistics', loadChildren: () => import('./stats/stats.module').then(mod => mod.StatsModule)},
  {path: '**', redirectTo: '/home', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
