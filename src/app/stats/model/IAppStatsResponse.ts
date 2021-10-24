import { IPriceStatResponse } from './IPriceStatResponse';
import { IMunicipalityProvince } from './IMunicipalityProvince';

export interface IAppStatsResponse {
  mostStationsMunicipality?: IMunicipalityProvince;
  mostStationsProvince?: string;
  leastStationsMunicipality?: IMunicipalityProvince;
  leastStationsProvince?: string;
  priceStats: IPriceStatResponse[];
}
