import { Component, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  animations: [
    fadeInOnEnterAnimation({duration: 1000}),
    fadeOutOnLeaveAnimation({duration: 300})
  ]
})
export class StatsComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }


}


