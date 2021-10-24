import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {


  formValue: {
    province: string,
    municipality: string,
    date: Date
  };

  constructor() {
  }

  ngOnInit(): void {
  }


}


