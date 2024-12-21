import React, { useContext, useState } from 'react'
import { GeoJSON, Marker, useMapEvents } from 'react-leaflet'
import { MapContext } from './MapContainer'
import L from 'leaflet'
import WeatherChart from './WeatherChart'
import WeatherForecast from './WeatherChart2'
import ClickHandler from './Click'

const GeoJSONLayer = ({ data }) => {
  const [selectedFeature, setSelectedFeature] = useState(null)
  const { weatherData, geoJson, displayOption } = useContext(MapContext)
  const [zoomLevel, setZoomLevel] = useState(5)
  const [isRegionView, setisRegionView] = useState(true)
  //  const [currentHour, setCurrentHour] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false)
  const map = useMapEvents({
    zoomend: () => {
      const currentZoom = map.getZoom() // Lấy giá trị zoom hiện tại
      setZoomLevel(currentZoom) // Cập nhật zoomLevel
      if (currentZoom <= 6) {
        setisRegionView(true) // Region View nếu zoom nhỏ hơn 6
      } else {
        setisRegionView(false) // Tắt Region View nếu zoom >= 6
      }
    }
  })
  console.log('ZoomLevel: ', zoomLevel)
  console.log('isRegionView', isRegionView)
  console.log('Feature properties:', displayOption)
  if (!geoJson || !geoJson.features || geoJson.features.length === 0) {
    console.log('GeoJSON is not ready yet')
    return null // Không render gì nếu `geoJson` chưa có dữ liệu
  }
  const currentHour = new Date().getHours() % 24 // Đảm bảo giá trị từ 0 đến 23
  console.log('Giờ: ', currentHour)
  const getRegionColor = (region) => {
    switch (region) {
      case 'Tây Bắc':
        return '#FF5733' // Màu cam đậm
      case 'Đông Bắc':
        return '#33FF57' // Màu xanh lá
      case 'Tây Nguyên':
        return '#3357FF' // Màu xanh dương
      case 'Đông Nam Bộ':
        return '#FF33FF' // Màu tím hồng
      case 'Bắc Trung Bộ':
        return '#FFBD33' // Màu vàng cam
      case 'Nam Trung Bộ':
        return '#FF3333' // Màu đỏ tươi
      case 'Đồng bằng sông Cửu Long':
        return '#33FFFF' // Màu xanh ngọc
      case 'Đồng bằng sông Hồng':
        return '#9933FF' // Màu tím đậm
      default:
        return '#CCCCCC' // Màu xám cho các vùng không xác định
    }
  }
  const regionData = [
    { name: 'Tây Bắc', lat: 21.5, lng: 103.9 },
    { name: 'Đông Bắc', lat: 22, lng: 106.5 },
    { name: 'Tây Nguyên', lat: 14.3, lng: 108.0 },
    { name: 'Đông Nam Bộ', lat: 11.2, lng: 106.8 },
    { name: 'Bắc Trung Bộ', lat: 18.5, lng: 105.7 },
    { name: 'Nam Trung Bộ', lat: 13.9, lng: 109.2 },
    { name: 'Đồng bằng sông Cửu Long', lat: 10.0, lng: 105.8 },
    { name: 'Đồng bằng sông Hồng', lat: 20.3, lng: 106.2 }
  ]
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
    fillColor: isRegionView
      ? getRegionColor(feature.properties.region) // Màu theo region
      : getColorByOption(feature), // Màu theo thuộc tính
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

      {isRegionView && (
        <>
          {regionData.map((region, index) => (
            <Marker
              key={index}
              position={[region.lat, region.lng]}
              icon={L.divIcon({
                className: 'custom-marker',
                html: `<div style="
            font-size: 10px;
            color: black;
            font-family: 'Roboto', sans-serif; /* Font đẹp */
            font-weight: bold; /* Đậm chữ */
            text-align: center;
            transform: scale(1); /* Cố định kích thước */
            pointer-events: none; /* Ngăn tương tác với icon */
            text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8); /* Hiệu ứng bóng */
          ">
            ${region.name}
          </div>`,
                iconSize: [100, 40], // Kích thước biểu tượng
                iconAnchor: [50, 20] // Tâm biểu tượng
              })}
            />
          ))}
        </>
      )}

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
