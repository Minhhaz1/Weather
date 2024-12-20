import React, { useContext, useState } from 'react'
import { GeoJSON, useMapEvents } from 'react-leaflet'
import { MapContext } from './MapContainer'
import WeatherChart from './WeatherChart'
import WeatherForecast from './WeatherChart2'
import ClickHandler from './Click'

const GeoJSONLayer = ({ data }) => {
  const [selectedFeature, setSelectedFeature] = useState(null)
  const { weatherData, geoJson, displayOption } = useContext(MapContext)
  const [zoomLevel, setZoomLevel] = useState(5)
  const map = useMapEvents({
    zoomend: () => {
      setZoomLevel(map.getZoom()) // Cập nhật zoom khi zoomend
    }
  })
  console.log('ZoomLevel: ', zoomLevel)
  console.log('Feature properties:', displayOption)
  if (!geoJson || !geoJson.features || geoJson.features.length === 0) {
    console.log('GeoJSON is not ready yet')
    return null // Không render gì nếu `geoJson` chưa có dữ liệu
  }
  // const currentHour = new Date().getHours() % 24 // Đảm bảo giá trị từ 0 đến 23
  const currentHour = 300
  console.log('Giờ: ', currentHour)
  const getTemperatureColor = (temperature) => {
    // Giới hạn nhiệt độ (tùy chỉnh theo thực tế)
    const minTemp = 10 // Nhiệt độ thấp nhất
    const maxTemp = 40 // Nhiệt độ cao nhất

    // Đảm bảo nhiệt độ nằm trong khoảng giới hạn
    const clampedTemp = Math.min(Math.max(temperature, minTemp), maxTemp)

    // Chia nhiệt độ thành 2 khoảng chính:
    // 0–20°C: Xanh (#0000FF) → Vàng (#FFFF00)
    // 20–40°C: Vàng (#FFFF00) → Đỏ (#FF0000)
    if (clampedTemp <= 20) {
      // Tỷ lệ cho khoảng 0–20°C
      const ratio = clampedTemp / 20
      const r = Math.floor(255 * ratio) // Tăng từ 0 -> 255
      const g = 255 // Giữ nguyên màu vàng
      const b = Math.floor(255 * (1 - ratio)) // Giảm từ 255 -> 0
      return `rgb(${r},${g},${b})`
    } else {
      // Tỷ lệ cho khoảng 20–40°C
      const ratio = (clampedTemp - 20) / 20
      const r = 255 // Giữ nguyên màu đỏ
      const g = Math.floor(255 * (1 - ratio)) // Giảm từ 255 -> 0
      const b = 0 // Không có màu xanh dương
      return `rgb(${r},${g},${b})`
    }
  }
  const getTemperatureColor2 = (temperature) => {
    // Giới hạn nhiệt độ (tùy chỉnh theo thực tế)
    const minTemp = 0 // Nhiệt độ thấp nhất
    const maxTemp = 40 // Nhiệt độ cao nhất

    // Mảng màu tùy chỉnh theo yêu cầu
    const colors = [
      '#0000FF', // 0-2°C: Xanh dương
      '#0033FF', // 2-4°C
      '#0066FF', // 4-6°C
      '#0099FF', // 6-8°C
      '#00CCFF', // 8-10°C
      '#00FFFF', // 10-12°C
      '#33FFCC', // 12-14°C
      '#66FF99', // 14-16°C
      '#99FF66', // 16-18°C
      '#CCFF33', // 18-20°C
      '#FFFF33', // 20-22°C: Xanh-vàng
      '#FFFF00', // 22-24°C: Vàng nhạt
      '#FFCC00', // 24-26°C: Vàng đậm
      '#FF9900', // 26-28°C: Cam nhạt
      '#FF6600', // 28-30°C: Cam đậm
      '#FF3300', // 30-32°C: Đỏ nhạt
      '#FF0000', // 32-34°C: Đỏ
      '#CC0000', // 34-36°C: Đỏ đậm
      '#990000', // 36-38°C: Đỏ sẫm
      '#660000' // 38-40°C: Đỏ tối
    ]

    // Đảm bảo nhiệt độ nằm trong khoảng giới hạn
    const clampedTemp = Math.min(Math.max(temperature, minTemp), maxTemp)

    // Tính chỉ số của khoảng nhiệt độ
    const colorIndex = Math.floor((clampedTemp - minTemp) / 2)

    // Trả về màu tương ứng
    return colors[colorIndex]
  }
  const getColorByOption = (feature) => {
    const hourlyData = feature.properties.hourlyData || []
    if (hourlyData.length === 0) {
      console.log('Không có dữ liệu hourlyData')
    }
    const currentData = hourlyData.find((hour) => hour.hour === currentHour) || {}
    // console.log(currentData)
    if (displayOption === 'temperature') {
      // console.log(getTemperatureColor2(currentData.temperature))
      return getTemperatureColor2(currentData.temperature)

      // return currentData.temperature > 30
      //   ? '#FF0000' // Đỏ cho nhiệt độ cao
      //   : currentData.temperature < 20
      //     ? '#0000FF' // Xanh cho nhiệt độ thấp
      //     : '#FFFF00' // Vàng cho nhiệt độ trung bình
    }
    if (displayOption === 'wind') {
      return currentData.wind > 5 ? '#FF5733' : '#33FF57' // Màu cam hoặc xanh
    }

    if (displayOption === 'humidity') {
      return currentData.humidity > 80 ? '#0033CC' : '#66CCFF' // Xanh đậm hoặc nhạt
    }

    return '#FF5733' // Mặc định
  }

  const style = (feature) => ({
    fillColor: getColorByOption(feature),
    weight: 0,
    opacity: 0,
    color: 'black',
    fillOpacity: 0.3
  })

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        setSelectedFeature(feature.properties)
      }
    })
  }

  return (
    <>
      <GeoJSON data={geoJson} style={style} onEachFeature={onEachFeature} />

      {selectedFeature && (
        <>
          {/* Gọi ClickHandler để hiển thị Marker */}
          <ClickHandler selectedFeature={selectedFeature} />

          {/* Hiển thị thông tin chi tiết bên dưới */}
          <div
            style={{
              backgroundColor: 'white',
              height: '200px',
              overflowY: 'auto',
              position: 'fixed',
              bottom: '0',
              left: '0',
              width: '100%',
              zIndex: 1000,
              boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px 8px 0 0'
            }}
          >
            <button
              onClick={() => setSelectedFeature(null)} // Đặt selectedFeature thành null khi nhấn
              style={{
                position: 'absolute',
                top: '5px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#888',
                cursor: 'pointer',
                zIndex: 1100
              }}
              aria-label='Close'
            >
              ✖
            </button>
            <div>
              <WeatherForecast selectedFeature={selectedFeature} />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default GeoJSONLayer
