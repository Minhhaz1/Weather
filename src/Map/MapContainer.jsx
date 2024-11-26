import React, { useContext, useEffect, useState } from 'react'
import { MapContainer as LeafletMap, Marker, Popup } from 'react-leaflet'
import TileLayer from './TileLayer'
import GeoJSONLayer from './GeoJSONLayer'
// import ClickHandler from './ClickHandler'
import getWeathers from './weathersApi'

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
  const [weathers, setWeathers] = useState([])
  const [geoJsonData, setGeoJsonData] = useState(null)
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const res = await getWeathers('20241011')
        const weatherData = res.data || res // Xử lý dữ liệu nhận được
        if (!weatherData || weatherData.length === 0) {
          console.warn('No weather data available from API')
          return
        }

        setWeathers(weatherData)
        console.log(weathers)
        // Tạo GeoJSON từ dữ liệu nhận được
        const geoJson = {
          type: 'FeatureCollection',
          features: weatherData.map((data) => {
            const offset = 0.25

            // Kiểm tra giá trị null hoặc undefined và cung cấp giá trị mặc định
            const lon = data.longitude ?? 0 // Mặc định là 0 nếu `longitude` null
            const lat = data.latitude ?? 0 // Mặc định là 0 nếu `latitude` null
            const name = data.district ?? 'Unknown' // Tên mặc định
            const temperature = data.temperature ?? 'N/A'
            const humidity = data.humidity ?? 'N/A'
            const wind = data.wind_speed ?? 'N/A'

            const polygonCoordinates = [
              [
                [lon - offset, lat - offset],
                [lon + offset, lat - offset],
                [lon + offset, lat + offset],
                [lon - offset, lat + offset],
                [lon - offset, lat - offset]
              ]
            ]

            return {
              type: 'Feature',
              properties: {
                name,
                temperature,
                humidity,
                wind
              },
              geometry: {
                type: 'Polygon',
                coordinates: polygonCoordinates
              }
            }
          })
        }

        // Lưu GeoJSON vào state
        setGeoJsonData(geoJson)
        console.log('GeoJSON Data:', geoJson)
      } catch (error) {
        console.error('Error fetching weather:', error.message)
      }
    }

    fetchWeatherData()
  }, [])
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
