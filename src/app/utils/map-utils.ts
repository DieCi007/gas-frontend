import { LngLatBounds, Map } from 'mapbox-gl';

export function map(container: string, style: 'dark' | 'light'): Map {
  const url = style === 'dark' ? 'mapbox://styles/dieci007/ckq44rcoy4h0317p8a5vojnxn?optimize=true' :
    'mapbox://styles/dieci007/ckq5jyzja2cem18qcz9ddfs4t?optimize=true';
  return new Map({
    container,
    style: url,
    center: [12.514018, 41.890565],
    zoom: 5,
    minZoom: 5,
    maxBounds: new LngLatBounds([1.633272, 30.899554], [21.971009, 50.476081]),
  });
}

//    "g-ui": "git+https://github.com/DieCi007/g-ui"
