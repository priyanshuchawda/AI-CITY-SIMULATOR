import React from 'react';
import { KeplerGl } from 'kepler.gl';

const CityMap: React.FC = () => {
  return (
    <KeplerGl
      id="city-map"
      width={800}
      height={600}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
    />
  );
};

export default CityMap;