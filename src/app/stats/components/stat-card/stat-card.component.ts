import { Component, Input, OnInit } from '@angular/core';
import { IPriceStatResponse } from '../../model/IPriceStatResponse';
import { PriceStatType } from '../../../shared/model/PriceStatType';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent implements OnInit {
  @Input() title: string;
  @Input() type: 'location-stat' | 'price-stat';
  @Input() locationStat: string;
  @Input() priceStats: IPriceStatResponse[];
  @Input() color: 'primary' | 'secondary' = 'primary';

  priceStatTypes = Object.values(PriceStatType).map(p => PriceStatType[p]);

  constructor() {
  }

  ngOnInit(): void {
  }

  getPrice(type: PriceStatType): number | string {
    const priceStat = this.priceStats?.find(p => p.priceStatType === type);
    return priceStat ? Math.round((priceStat.price + Number.EPSILON) * 1000) / 1000 : '-';
  }
}
