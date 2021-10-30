import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-heatmap-main',
  templateUrl: './heatmap-main.component.html',
  styleUrls: ['./heatmap-main.component.scss']
})
export class HeatmapMainComponent implements OnInit {

  constructor(
    private title: Title
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Gas Advisor | Heatmap')
  }

}
