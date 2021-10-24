import { CommonFuelType } from '../../shared/model/CommonFuelType';
import { PriceStatType } from '../../shared/model/PriceStatType';

export interface IPriceStatResponse {
  fuelType: CommonFuelType,
  price: number;
  priceStatType: PriceStatType
}
