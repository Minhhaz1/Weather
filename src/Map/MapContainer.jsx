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
  const [geoJson, setGeoJson] = useState(null)
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
        console.log(weatherData)
        // Tạo GeoJSON từ dữ liệu nhận được

        const geoJson = {
          type: 'FeatureCollection',
          features: Object.values(
            weatherData.reduce((acc, data) => {
              const key = data.location_id // Nhóm dữ liệu theo `location_id`
              const offset = 0.25
              const formatFullName = (ward, district, province) => {
                if (!ward && !district && !province) return 'Không xác định'
                return [ward, district, province].filter(Boolean).join(', ') // Loại bỏ giá trị null/undefined và nối chuỗi
              }
              if (!acc[key]) {
                acc[key] = {
                  type: 'Feature',
                  properties: {
                    location_id: data.location_id, // Lưu `location_id`
                    name: formatFullName(data.ward, data.district, data.province), // Có thể thêm tên `district` nếu cần
                    hourlyData: [] // Mảng chứa dữ liệu thời tiết theo giờ
                  },
                  geometry: {
                    type: 'Polygon',
                    coordinates: [
                      [
                        [data.longtitude - offset, data.latitude - offset],
                        [data.longtitude + offset, data.latitude - offset],
                        [data.longtitude + offset, data.latitude + offset],
                        [data.longtitude - offset, data.latitude + offset],
                        [data.longtitude - offset, data.latitude - offset]
                      ]
                    ]
                  }
                }
              }

              // Thêm dữ liệu thời tiết vào `hourlyData`
              acc[key].properties.hourlyData.push({
                hour: data.time_id,
                temperature: data.tempc ?? 'N/A',
                humidity: data.humidity ?? 'N/A',
                wind: data.windspeedkmph ?? 'N/A'
              })

              return acc
            }, {})
          ).map((feature) => {
            // Sắp xếp `hourlyData` theo `hour`
            feature.properties.hourlyData.sort((a, b) => a.hour - b.hour)
            return feature
          })
        }

        // Lưu GeoJSON vào state
        setGeoJson(geoJson)
        console.log('GeoJSON Data:', geoJson)
        console.log('GeoJsonData: ', geoJsonData)
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
        geoJson,
        weatherData,
        displayOption
      }}
    >
      <LeafletMap
        bounds={vietnamBounds}
        maxBounds={vietnamBounds}
        maxBoundsViscosity={1.0}
        minZoom={5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer />
        {geoJson && <GeoJSONLayer />}
        <Search />
        <ClickHandler weatherData={geoJson} />
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
