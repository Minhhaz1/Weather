import React from 'react'
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function TemperatureMap() {
  return (
    <MapContainer center={[22.5, 105.8]} zoom={8} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; OpenStreetMap contributors'
      />
      <GeoJSON
        data={geoJsonData}
        pointToLayer={(feature, latlng) => {
          const marker = L.circleMarker(latlng, {
            radius: 10,
            fillColor: getColorByTemperature(feature.properties.temperature),
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          })
          return marker
        }}
        onEachFeature={(feature, layer) => {
          layer.bindTooltip(`<strong>${feature.properties.name}</strong><br>${feature.properties.temperature}°C`, {
            permanent: true,
            direction: 'top',
            className: 'temp-label'
          })
        }}
      />
    </MapContainer>
  )
}

export default TemperatureMap
