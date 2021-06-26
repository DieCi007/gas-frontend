import { Component, Input } from '@angular/core';
import { StationPrice } from '../../model/station-price';

@Component({
  selector: 'app-price-table',
  templateUrl: './price-table.component.html',
  styleUrls: ['./price-table.component.scss']
})
export class PriceTableComponent {
  @Input() prices: StationPrice[];


}
