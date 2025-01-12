import React, { useContext, useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import troiIcon from './png/storm.gif'
import L from 'leaflet'
import { MapContext } from './MapContainer'
import icon19 from './png/rain.gif'
import sunny from './png/sunny.gif'
import rain from './png/rain.gif'
import storm from './png/storm.gif'
import night from './png/night.gif'
import rainnight from './png/rainnight.png'
import clouds from './png/clouds.gif'
import wind from './png/wind.gif'
import overcast from './png/overcast.png'
import partly_cloudy from './png/PartlyCloudy.gif'
import partlyrain from './png/party rain.gif'
import fog from './png/fog.gif'
const ClickHandler = ({ selectedFeature }) => {
  console.log(selectedFeature, selectedFeature.lon, selectedFeature.lat)

  const { geoJson } = useContext(MapContext)
  const currentHour = new Date().getHours() % 24 // Đảm bảo giá trị từ 0 đến 23

  // const hourlyData = geoJson.properties.hourlyData || []
  // const currentData = hourlyData.find((hour) => hour.hour === String(currentHour)) || {}
  const starIcon = L.divIcon({
    className: 'custom-star-icon',
    html: '<div style="color: gold; font-size: 24px;">★</div>', // Biểu tượng ngôi sao
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  })
  // Sử dụng hook useMapEvents để bắt sự kiện click
  // useMapEvents({
  //   click: (e) => {
  //     const { lat, lng } = e.latlng // Lấy tọa độ từ sự kiện click
  //     setClickedCoords({ lat, lng }) // Cập nhật tọa độ vào state
  //     console.log('Tọa độ : ' + lat + ' : ' + lng)
  //   }
  // })
  const descriptionToIconMap = {
    'Overcast ': overcast,
    'Patchy rain nearby': partlyrain,
    Fog: fog,
    'Moderate snow': clouds,
    'Patchy light rain': partlyrain,
    Cloudy: clouds,
    Clear: sunny,
    'Thundery outbreaks possible': storm,
    'Partly Cloudy': partly_cloudy,
    'Patchy light snow': clouds,
    'Patchy heavy snow': clouds,
    'Moderate or heavy rain with thunder': storm,
    'Light rain': partlyrain,
    'Light rain shower': partlyrain,
    'Patchy light rain with thunder': storm,
    'Heavy snow': clouds,
    'Patchy rain possible': partlyrain,
    'Light drizzle': rain,
    'Light sleet': rain,
    Mist: fog,
    'Light snow': clouds,
    'Moderate rain': rain,
    'Patchy moderate snow': clouds,
    Sunny: sunny,
    'Moderate rain at times': partlyrain
  }

  const descriptions = [
    'Rain',
    'Rain',
    'Sunny',
    'Clouds',
    'Storm',
    'Partly Cloudy',
    'Sunny',
    'Rain',
    'Clouds',
    'Rain',
    'Storm',
    'Partly Cloudy',
    'Rain',
    'Sunny',
    'Default'
  ]

  const weatherDescriptions = {
    Overcast: 'Trời u ám, nhiều mây.',
    'Patchy rain nearby': 'Mưa rải rác gần đây.',
    Fog: 'Sương mù, tầm nhìn hạn chế.',
    'Moderate snow': 'Tuyết rơi vừa.',
    'Patchy light rain': 'Mưa nhẹ rải rác.',
    Cloudy: 'Nhiều mây.',
    Clear: 'Trời quang đãng.',
    'Thundery outbreaks possible': 'Có khả năng sấm sét.',
    'Partly Cloudy': 'Trời ít mây.',
    'Patchy light snow': 'Tuyết nhẹ rải rác.',
    'Patchy heavy snow': 'Tuyết dày rải rác.',
    'Moderate or heavy rain with thunder': 'Mưa vừa hoặc to kèm sấm sét.',
    'Light rain': 'Mưa nhẹ.',
    'Light rain shower': 'Mưa rào nhẹ.',
    'Patchy light rain with thunder': 'Mưa nhẹ rải rác kèm sấm sét.',
    'Heavy snow': 'Tuyết dày.',
    'Patchy rain possible': 'Có thể mưa rải rác.',
    'Patchy light drizzle': 'Mưa phùn nhẹ.',
    'Light sleet': 'Mưa tuyết nhẹ.',
    Mist: 'Sương mù nhẹ.',
    'Light snow': 'Tuyết nhẹ.',
    'Moderate rain': 'Mưa vừa.',
    'Patchy moderate snow': 'Tuyết vừa rải rác.',
    Sunny: 'Trời nắng.',
    'Moderate rain at times': 'Đôi lúc có mưa vừa.'
  }

  // Hiển thị Marker khi tọa độ được chọn
  return (
    <Marker position={[selectedFeature.lat, selectedFeature.lon]} icon={starIcon}>
      <Popup>
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            color: '#fff',
            background: '#3b3f6b', // Màu nền tương tự hình ảnh
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px', // Tạo khoảng cách đều giữa các phần tử
            boxSizing: 'border-box'
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3
              style={{
                margin: '0',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Thời tiết hiện tại
            </h3>
            <h4
              style={{
                marginLeft: '10px',
                fontSize: '14px',
                fontWeight: 'normal'
              }}
            >
              {selectedFeature.name}
            </h4>
          </div>

          {/* Nhiệt độ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <img
              src={(() => {
                const currentHourData = selectedFeature.hourlyData.find((hour) => hour.hour === currentHour)
                const description = currentHourData?.description || 'Sunny'

                if (currentHour >= 18 || currentHour <= 5) {
                  if (description.toLowerCase().includes('rain')) {
                    return rainnight
                  }
                  return night
                }
                return descriptionToIconMap[description] || descriptionToIconMap['Sunny']
              })()}
              alt='Weather Icon'
              style={{
                width: '50px',
                height: '50px'
              }}
            />
            <div>
              <p
                style={{
                  margin: '0',
                  fontSize: '36px',
                  fontWeight: 'bold'
                }}
              >
                {selectedFeature.hourlyData.find((hour) => hour.hour === currentHour)?.temperature}°C
              </p>
              <p
                style={{
                  margin: '0',
                  fontSize: '17px'
                }}
              >
                {weatherDescriptions[
                  selectedFeature?.hourlyData?.find((hour) => hour.hour === currentHour)?.description
                ] || 'Không rõ thời tiết.'}
              </p>
            </div>
          </div>

          {/* Chỉ số thời tiết */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
              borderTop: '1px solid rgba(255, 255, 255, 0.5)',
              paddingTop: '10px',
              fontSize: '14px'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <strong>Gió</strong>
              <p style={{ margin: '5px 0' }}>
                {selectedFeature.hourlyData.find((hour) => hour.hour === currentHour)?.wind} km/giờ
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong>Độ ẩm</strong>
              <p style={{ margin: '5px 0' }}>
                {selectedFeature.hourlyData.find((hour) => hour.hour === currentHour)?.humidity} %
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong>Tầm nhìn</strong>
              <p style={{ margin: '5px 0' }}>
                {selectedFeature.hourlyData.find((hour) => hour.hour === currentHour)?.visibility} km
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong>Áp suất</strong>
              <p style={{ margin: '5px 0' }}>
                {selectedFeature.hourlyData.find((hour) => hour.hour === currentHour)?.pressure} mb
              </p>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

export default ClickHandler
