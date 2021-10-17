import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() routeChange = new EventEmitter<void>();
  routes = {
    home: {
      url: '/home',
      img: 'assets/ui/navbar/map.svg',
      imgActive: 'assets/ui/navbar/map-active.svg'
    },
    heatmap: {
      url: '/heatmap',
      img: 'assets/ui/navbar/heatmap.svg',
      imgActive: 'assets/ui/navbar/heatmap-active.svg'
    },
    statistics: {
      url: '/statistics',
      img: 'assets/ui/navbar/chart.svg',
      imgActive: 'assets/ui/navbar/chart-active.svg'
    },
  };

  onRouteChange(): void {
    this.routeChange.emit();
  }
}
