import { LngLatBounds, Map } from 'mapbox-gl';

export function map(container: string): Map {
  return new Map({
    container,
    style: 'mapbox://styles/dieci007/ckq44rcoy4h0317p8a5vojnxn',
    center: [12.514018, 41.890565],
    zoom: 5,
    minZoom: 5,
    maxBounds: new LngLatBounds([1.633272, 30.899554], [21.971009, 50.476081])
  });
}
