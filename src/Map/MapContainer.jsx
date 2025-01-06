import React, { useContext, useEffect, useState } from 'react'
import { MapContainer as LeafletMap, Marker, Popup } from 'react-leaflet'
import TileLayer from './TileLayer'
import GeoJSONLayer from './GeoJSONLayer'
import JsonData from './csvjson.json'
import chatboticon from './png/chatbo.jpg'
// import ClickHandler from './ClickHandler'
import getWeathers from './weathersApi'
import getWeathers2 from './weathersApi2'

import { createContext } from 'react'
// import weatherData from './weatherData'
import Search from './Search'
import ClickHandler from './Click'
import Chatbot from './ChatBot'
import TileLayerWithRadar from './TileLayer'
import WeatherForecast from './WeatherChart2'

export const MapContext = createContext()

// const geoJsonData = {
//   type: 'FeatureCollection',
//   features: weatherData.map((data) => {
//     const offset = 0.25
//     const polygonCoordinates = [
//       [
//         [data.lon - offset, data.lat - offset],
//         [data.lon + offset, data.lat - offset],
//         [data.lon + offset, data.lat + offset],
//         [data.lon - offset, data.lat + offset],
//         [data.lon - offset, data.lat - offset]
//       ]
//     ]
//     return {
//       type: 'Feature',
//       properties: {
//         name: data.city,
//         temperature: data.temp,
//         humidity: data.humidity,
//         wind: data.wind
//       },
//       geometry: {
//         type: 'Polygon',
//         coordinates: polygonCoordinates
//       }
//     }
//   })
// }

const MapContainer = ({ displayOption }) => {
  const [chatbotVisible, setChatbotVisible] = useState(false)
  const [weathers, setWeathers] = useState([])
  const [weathers2, setWeathers2] = useState([])
  const [geoJson, setGeoJson] = useState(null)

  const today = new Date()
  const currentDate = today.toISOString().split('T')[0]
  // Hàm tạo danh sách 5 ngày tiếp theo
  const getNextFiveDays = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      return date.toISOString().split('T')[0] // YYYY-MM-DD
    })
  }

  const nextFiveDays = getNextFiveDays()
  console.log(nextFiveDays)

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const res1 = await getWeathers('95,96') // Giả sử API yêu cầu `weatherCode`
        const weatherData = res1.data || res1

        // Gọi API thứ hai
        const res2 = await getWeathers2('2025-01-05') // Giả sử `dateId` là 2024-12-01
        const weatherData2 = res2.data || res2

        // Kiểm tra xem dữ liệu có hợp lệ không
        if (!weatherData || weatherData.length === 0) {
          console.warn('No weather data available from API 1')
        }
        if (!weatherData2 || weatherData2.length === 0) {
          console.warn('No weather data available from API 2')
        }

        setWeathers(weatherData)
        setWeathers2(weatherData2)
        // console.log(weatherData)
        // console.log(weatherData2)

        const geoJson = {
          type: 'FeatureCollection',
          features: Object.values(
            weatherData2.reduce((acc, data) => {
              const key = data.LocationID // Nhóm dữ liệu theo `location_id`
              const offset = 0.05
              const formatFullName = (ward, district, province) => {
                if (!ward && !district && !province) return 'Không xác định'
                return [ward, district, province].filter(Boolean).join(', ') // Loại bỏ giá trị null/undefined và nối chuỗi
              }
              if (!acc[key]) {
                acc[key] = {
                  type: 'Feature',
                  properties: {
                    location_id: data.LocationID, // Lưu `location_id`
                    lon: data.Longitude ?? '0',
                    lat: data.Latitude ?? '0',
                    lonstorm: weatherData?.lon ?? 'N/A', // Lấy lonstorm từ API, nếu không có thì mặc định 'N/A'
                    latstorm: weatherData?.lat ?? 'N/A', // Lấy latstorm từ API, nếu không có thì mặc định 'N/A'
                    region: data.Region,
                    name: formatFullName(data.Ward, data.District, data.Province), // Có thể thêm tên `district` nếu cần
                    hourlyData: [] // Mảng chứa dữ liệu thời tiết theo giờ
                  },
                  geometry: {
                    type: 'Polygon',
                    coordinates: [
                      [
                        [data.Longitude - offset, data.Latitude - offset],
                        [data.Longitude + offset, data.Latitude - offset],
                        [data.Longitude + offset, data.Latitude + offset],
                        [data.Longitude - offset, data.Latitude + offset],
                        [data.Longitude - offset, data.Latitude - offset]
                      ]
                    ]
                  }
                }
              }

              // Thêm dữ liệu thời tiết vào `hourlyData`
              acc[key].properties.hourlyData.push({
                hour: data.Hour,
                temperature: data.Temperature_C ?? 'N/A',
                humidity: data.Humidity ?? 'N/A',
                cloudcovevr: data.CloudCover ?? 'N/A',
                visibility: data.Visibility_km ?? 'N/A',
                maxtempc: data.maxtempc ?? 'N/A',
                mintempc: data.mintempc ?? 'N/A',
                description: data.Weather_Description ?? 'N/A',
                avgtempc: data.avgtempc ?? 'N/A',
                pressure: data.Pressure_hPa ?? 'N/A',
                wind: data.WindSpeed_kmph ?? 'N/A'
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
    [30.3929, 109.469]
  ]
  const worldBounds = [
    [-90, -180], // Tọa độ góc dưới trái (Nam Cực, Tây)
    [90, 180] // Tọa độ góc trên phải (Bắc Cực, Đông)
  ]
  console.log(displayOption)
  return (
    <MapContext.Provider
      value={{
        geoJson,
        weathers,
        // geoJsonData,
        displayOption
      }}
    >
      <LeafletMap
        bounds={vietnamBounds}
        maxBounds={worldBounds}
        maxBoundsViscosity={1.0}
        minZoom={5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer />
        {/* <TileLayer
          url='https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=4fa260aa66af6dbdda07035ef22b99c0'
          attribution="&copy; <a href='https://openweathermap.org/'>OpenWeatherMap</a>"
          opacity={0.9} // Độ trong suốt radar
        /> */}

        {geoJson && <GeoJSONLayer />}
        <Search />

        {/* Nút bật/tắt Chatbot */}
        <button
          onClick={toggleChatbot}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            backgroundColor: 'transparent', // Nền trong suốt
            border: 'none',
            padding: '0', // Loại bỏ padding
            cursor: 'pointer'
          }}
          aria-label={chatbotVisible ? 'Ẩn Chatbot' : 'Hiện Chatbot'}
        >
          <img
            src={chatbotVisible ? chatboticon : chatboticon} // Đường dẫn đến ảnh
            alt={chatbotVisible ? 'Ẩn Chatbot' : 'Hiện Chatbot'} // Alt text cho ảnh
            style={{
              width: '60px', // Kích thước ảnh
              height: '60px',
              borderRadius: '100%', // Ảnh hình tròn
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' // Hiệu ứng đổ bóng
            }}
          />
        </button>

        {/* Chatbot Component */}
        <Chatbot isVisible={chatbotVisible} toggleVisibility={toggleChatbot} />
      </LeafletMap>
    </MapContext.Provider>
  )
}

export default MapContainer
