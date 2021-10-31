import { IStationLocation } from './IStationLocation';

export interface INearestStationResponse extends IStationLocation {
  address: string;
  flag: string;
  owner: string;
  distance: number;
}
