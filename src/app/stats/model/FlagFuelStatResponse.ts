import { CommonFuelType } from '../../shared/model/CommonFuelType';

export interface IFlagFuelStatResponse {
  fuelType: CommonFuelType;
  cheapestFlag: IFlagPrice;
  mostExpensiveFlag: IFlagPrice;
}

export interface IFlagPrice {
  flag: string;
  price: number;
}
