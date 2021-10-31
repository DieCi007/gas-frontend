import { LngLatBounds, Map } from 'mapbox-gl';

export function map(container: string, style: 'dark' | 'light' | 'satellite'): Map {
  const url = style === 'dark' ? 'mapbox://styles/dieci007/ckq44rcoy4h0317p8a5vojnxn' :
              style === 'light' ? 'mapbox://styles/dieci007/ckq5jyzja2cem18qcz9ddfs4t' :
              'mapbox://styles/dieci007/ckqezlvw92nss18o47cq1orho';

  return new Map({
    container,
    style: url,
    center: [12.514018, 41.890565],
    zoom: 5.5,
    minZoom: 4,
    maxBounds: new LngLatBounds([-2.833272, 31.099554], [27.191009, 50.776081]),
  });
}

//    "g-ui": "git+https://github.com/DieCi007/g-ui"
