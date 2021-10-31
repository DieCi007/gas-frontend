import { Component, Input } from '@angular/core';
import { IStationPrice } from '../../model/IStationPrice';

@Component({
  selector: 'app-price-table',
  templateUrl: './price-table.component.html',
  styleUrls: ['./price-table.component.scss']
})
export class PriceTableComponent {
  @Input() prices: IStationPrice[];


}
