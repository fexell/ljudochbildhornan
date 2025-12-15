import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function FreeMap() {
  const mapRef = useRef(null);
  const [L, setL] = useState(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    })
  }, [])

  useEffect(() => {
    if(!L || !mapRef.current || typeof window === "undefined") return;

    // Prevent re-initialization if map already exists
    if (mapRef.current._leaflet_id) return;

    // Initialize the map
    const map = L.map(mapRef.current).setView([58.994187774931035, 16.204082585025173], 18);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add a marker with a popup
    L.marker([58.994187774931035, 16.204082585025173])
      .addTo(map)
      .bindPopup("Här är vi lokaliserade!")
      .openPopup();
  }, [L]);

  if(typeof window === "undefined") return null;

  return <div ref={mapRef} style={{ width: "100%", height: "300px", zIndex: 0 }} />;
}
