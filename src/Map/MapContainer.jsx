import React, { useContext, useEffect, useState } from 'react'
import { MapContainer as LeafletMap, Marker, Popup } from 'react-leaflet'
import TileLayer from './TileLayer'
import GeoJSONLayer from './GeoJSONLayer'
import JsonData from './csvjson.json'
import chatboticon from './png/chatbo.jpg'
import getWeathers from './weathersApi'
import getWeathers2 from './weathersApi2'
import { createContext } from 'react'
import Search from './Search'
import ClickHandler from './Click'
import Chatbot from './ChatBot'
import TileLayerWithRadar from './TileLayer'
import WeatherForecast from './WeatherChart2'

export const MapContext = createContext()

const MapContainer = ({ displayOption }) => {
  const [chatbotVisible, setChatbotVisible] = useState(false)
  const [weathers, setWeathers] = useState([])
  const [geoJson, setGeoJson] = useState(null)
  const [weathers2, setWeathers2] = useState([])
  const [selectedDate, setSelectedDate] = useState('')

  const today = new Date()
  const currentDate = today.toISOString().split('T')[0]

  const getNextFiveDays = () => {
    return Array.from({ length: 4 }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      return date.toISOString().split('T')[0] // YYYY-MM-DD
    })
  }

  const nextFiveDays = getNextFiveDays()

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const res1 = await getWeathers('95,96')
        const weatherData = res1.data || res1
        setWeathers(weatherData)
        if (!weatherData || weatherData.length === 0) {
          console.warn('No weather data available from API 1')
        }

        // Gọi API thứ hai
        const allWeatherPromises = nextFiveDays.map((date) => getWeathers2(date))
        const allWeatherResults = await Promise.all(allWeatherPromises)

        // Lấy dữ liệu thời tiết cho từng ngày
        const allWeatherData = allWeatherResults.map((res) => res.data || res)
        console.log('All weather data:', allWeatherData)
        setWeathers2(allWeatherData)
        if (allWeatherData[0]) {
          createGeoJson(allWeatherData[0]) // Tạo GeoJSON từ dữ liệu ngày đầu tiên
          setSelectedDate(nextFiveDays[0]) // Đặt ngày đầu tiên là mặc định
        }
        // const geoJson = {
        //   type: 'FeatureCollection',
        //   features: Object.values(
        //     weatherData4.reduce((acc, data) => {
        //       const key = data.LocationID // Nhóm dữ liệu theo `location_id`
        //       const offset = 0.05
        //       const formatFullName = (ward, district, province) => {
        //         if (!ward && !district && !province) return 'Không xác định'
        //         return [ward, district, province].filter(Boolean).join(', ') // Loại bỏ giá trị null/undefined và nối chuỗi
        //       }
        //       if (!acc[key]) {
        //         acc[key] = {
        //           type: 'Feature',
        //           properties: {
        //             location_id: data.LocationID, // Lưu `location_id`
        //             lon: data.Longitude ?? '0',
        //             lat: data.Latitude ?? '0',
        //             lonstorm: weatherData?.lon ?? 'N/A', // Lấy lonstorm từ API, nếu không có thì mặc định 'N/A'
        //             latstorm: weatherData?.lat ?? 'N/A', // Lấy latstorm từ API, nếu không có thì mặc định 'N/A'
        //             region: data.Region,
        //             name: formatFullName(data.Ward, data.District, data.Province), // Có thể thêm tên `district` nếu cần
        //             hourlyData: [] // Mảng chứa dữ liệu thời tiết theo giờ
        //           },
        //           geometry: {
        //             type: 'Polygon',
        //             coordinates: [
        //               [
        //                 [data.Longitude - offset, data.Latitude - offset],
        //                 [data.Longitude + offset, data.Latitude - offset],
        //                 [data.Longitude + offset, data.Latitude + offset],
        //                 [data.Longitude - offset, data.Latitude + offset],
        //                 [data.Longitude - offset, data.Latitude - offset]
        //               ]
        //             ]
        //           }
        //         }
        //       }

        //       // Thêm dữ liệu thời tiết vào `hourlyData`
        //       acc[key].properties.hourlyData.push({
        //         hour: data.Hour,
        //         temperature: data.Temperature_C ?? 'N/A',
        //         humidity: data.Humidity ?? 'N/A',
        //         cloudcovevr: data.CloudCover ?? 'N/A',
        //         visibility: data.Visibility_km ?? 'N/A',
        //         maxtempc: data.maxtempc ?? 'N/A',
        //         mintempc: data.mintempc ?? 'N/A',
        //         description: data.Weather_Description ?? 'N/A',
        //         avgtempc: data.avgtempc ?? 'N/A',
        //         pressure: data.Pressure_hPa ?? 'N/A',
        //         wind: data.WindSpeed_kmph ?? 'N/A'
        //       })

        //       return acc
        //     }, {})
        //   ).map((feature) => {
        //     // Sắp xếp `hourlyData` theo `hour`
        //     feature.properties.hourlyData.sort((a, b) => a.hour - b.hour)
        //     return feature
        //   })
        // }

        // // Lưu GeoJSON vào state
        // setGeoJson(geoJson)
        // console.log('GeoJSON Data:', geoJson)
      } catch (error) {
        console.error('Error fetching weather:', error.message)
      }
    }

    fetchWeatherData()
  }, [])
  // Hàm cập nhật GeoJSON
  const createGeoJson = (dayWeatherData) => {
    const geoJson = {
      type: 'FeatureCollection',
      features: Object.values(
        dayWeatherData.reduce((acc, data) => {
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
                date: data.Date ?? '',
                location_id: data.LocationID, // Lưu `location_id`
                lon: data.Longitude ?? '0',
                lat: data.Latitude ?? '0',
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
        feature.properties.hourlyData.sort((a, b) => a.hour - b.hour)
        return feature
      })
    }

    setGeoJson(geoJson)
  }

  const handleDaySelection = (index) => {
    if (weathers2[index]) {
      createGeoJson(weathers2[index])
      setSelectedDate(nextFiveDays[index])
    }
  }
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
        selectedDate,
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
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '40%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            backgroundColor: '#FFF',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          {nextFiveDays.map((date, index) => (
            <button
              key={date}
              onClick={() => handleDaySelection(index)}
              style={{
                margin: '0 5px',
                padding: '10px 15px',
                backgroundColor: selectedDate === date ? '#007BFF' : '#FFF',
                color: selectedDate === date ? '#FFF' : '#000',
                border: '1px solid #CCC',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {new Date(date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
            </button>
          ))}
        </div>

        <button
          onClick={toggleChatbot}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            backgroundColor: 'transparent',
            border: 'none',
            padding: '0',
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

        <Chatbot isVisible={chatbotVisible} toggleVisibility={toggleChatbot} />
      </LeafletMap>
    </MapContext.Provider>
  )
}

export default MapContainer
