import React, { useState, useEffect } from 'react'
import { TileLayer, GeoJSON, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet' // Import leaflet
import 'leaflet.heat' // Import heatmap layer của leaflet
import 'leaflet/dist/leaflet.css'
import MapContainer from './Map/MapContainer'
import Sidebar from './Map/Sidebar'
import Search from './Map/Search'

// Hàm để xác định màu sắc dựa trên nhiệt độ

const App = () => {
  const [displayOption, setDisplayOption] = useState('temperature')

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <Sidebar onOptionChange={(option) => setDisplayOption(option)} />
      <MapContainer displayOption={displayOption} />
    </div>
  )
}

export default App
