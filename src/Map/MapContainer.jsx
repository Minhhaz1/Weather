import React, { useContext, useState } from 'react'
import { MapContainer as LeafletMap, Marker, Popup } from 'react-leaflet'
import TileLayer from './TileLayer'
import GeoJSONLayer from './GeoJSONLayer'
// import ClickHandler from './ClickHandler'

import { createContext } from 'react'
import weatherData from './weatherData'
import Search from './Search'
import ClickHandler from './Click'
import Chatbot from './ChatBot'

export const MapContext = createContext()

const geoJsonData = {
  type: 'FeatureCollection',
  features: weatherData.map((data) => {
    const offset = 0.25
    const polygonCoordinates = [
      [
        [data.lon - offset, data.lat - offset],
        [data.lon + offset, data.lat - offset],
        [data.lon + offset, data.lat + offset],
        [data.lon - offset, data.lat + offset],
        [data.lon - offset, data.lat - offset]
      ]
    ]
    return {
      type: 'Feature',
      properties: {
        name: data.city,
        temperature: data.temp,
        humidity: data.humidity,
        wind: data.wind
      },
      geometry: {
        type: 'Polygon',
        coordinates: polygonCoordinates
      }
    }
  })
}

const MapContainer = ({ displayOption }) => {
  const [chatbotVisible, setChatbotVisible] = useState(false)

  const toggleChatbot = () => {
    setChatbotVisible((prev) => !prev)
  }

  const vietnamBounds = [
    [8.1790665, 102.14441],
    [23.3929, 109.469]
  ]

  console.log(displayOption)
  return (
    <MapContext.Provider
      value={{
        geoJsonData,
        displayOption
      }}
    >
      <LeafletMap
        bounds={vietnamBounds}
        maxBounds={vietnamBounds}
        maxBoundsViscosity={1.0}
        minZoom={5}
        style={{ height: '90%', width: '100%' }}
      >
        <TileLayer />
        <GeoJSONLayer />
        <Search />
        <ClickHandler weatherData={geoJsonData} />
        {/* Nút bật/tắt Chatbot */}
        <button
          onClick={toggleChatbot}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {chatbotVisible ? 'Ẩn Chatbot' : 'Hiện Chatbot'}
        </button>

        {/* Chatbot Component */}
        <Chatbot isVisible={chatbotVisible} toggleVisibility={toggleChatbot} />
      </LeafletMap>
    </MapContext.Provider>
  )
}

export default MapContainer
