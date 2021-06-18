import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  routes = {
    home: {
      url: '/home',
      img: 'assets/ui/navbar/map.svg',
      imgActive: 'assets/ui/navbar/map-active.svg'
    },
  };

}
