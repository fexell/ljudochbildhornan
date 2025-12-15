import {useEffect, useRef} from 'react';
import {setOptions, importLibrary} from '@googlemaps/js-api-loader';

export function GoogleMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    async function initMap() {
      setOptions({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
      });

      const maps = await importLibrary('maps');

      new maps.Map(mapRef.current, {
        center: { lat: 58.994187774931035, lng: 16.204082585025173 },
        zoom: 12,
      });
    }

    initMap();
  }, []);

  return (
    <>
      <div ref={mapRef} style={{ width: '100%', height: '300px' }}></div>
    </>
  )
}