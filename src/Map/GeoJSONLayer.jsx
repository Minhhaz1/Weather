import React, { useContext, useEffect, useState } from 'react'
import { GeoJSON, Marker, useMapEvents } from 'react-leaflet'
import { MapContext } from './MapContainer'
import L from 'leaflet'
import WeatherChart from './WeatherChart'
import iconStorm from './png/icons-thunder.png'
import WeatherForecast from './WeatherChart2'
import ClickHandler from './Click'
import DynamicLegend from './DynamicLegend'

const GeoJSONLayer = ({ data }) => {
  const [selectedFeature, setSelectedFeature] = useState(null)
  const { weathers, geoJson, selectedDate, displayOption } = useContext(MapContext)
  const [zoomLevel, setZoomLevel] = useState(5)
  const [isRegionView, setisRegionView] = useState(true)
  const [currentHour, setCurrentHour] = useState(new Date().getHours())
  const [isPlaying, setIsPlaying] = useState(false)
  console.log('geoJson layer', geoJson)
  console.log('selectedDater', selectedDate)
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
  useEffect(() => {
    let timer
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentHour((prevHour) => (prevHour + 1 > 23 ? new Date().getHours() : prevHour + 1))
      }, 1000) // Increment every second
    }
    return () => clearInterval(timer)
  }, [isPlaying])

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
  }
  // useEffect(() => {
  //   setSelectedFeature(null)
  // }, [selectedDate])
  useEffect(() => {
    if (geoJson && geoJson.features && geoJson.features.length > 0) {
      let matchingFeature

      // Nếu đã có selectedFeature, tìm feature dựa trên location_id
      if (selectedFeature && selectedFeature.location_id) {
        matchingFeature = geoJson.features.find(
          (feature) =>
            feature.properties.location_id === selectedFeature.location_id && feature.properties.date === selectedDate
        )
      }

      // Nếu không tìm thấy matchingFeature, tìm feature chỉ dựa trên date
      if (!matchingFeature) {
        matchingFeature = geoJson.features.find((feature) => feature.properties.date === selectedDate)
      }

      setSelectedFeature(matchingFeature ? matchingFeature.properties : null)
    }
  }, [selectedDate, geoJson, selectedFeature])

  const handleTimeChange = (hour) => {
    setCurrentHour(hour)
    setIsPlaying(false) // Stop playing when manually selecting a time
  }
  // console.log('ZoomLevel: ', zoomLevel)
  // console.log('isRegionView', isRegionView)
  // console.log('Feature properties:', displayOption)
  if (!geoJson || !geoJson.features || geoJson.features.length === 0) {
    console.log('GeoJSON is not ready yet')
    return null // Không render gì nếu `geoJson` chưa có dữ liệu
  }
  // const currentHour = new Date().getHours() % 24 // Đảm bảo giá trị từ 0 đến 23
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
    { name: 'Đông Bắc', lat: 22, lng: 106 },
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
  const getColorWind = (windSpeed) => {
    // Giới hạn tốc độ gió
    const minWind = 0 // Tốc độ gió thấp nhất
    const maxWind = 40 // Tốc độ gió cao nhất (50 km/h)

    // Mảng màu tùy chỉnh
    const colors = [
      '#66ff66', // 6-9 km/h: Xanh rất nhạt
      '#33ff33', // 9-12 km/h: Xanh nhạt
      '#00cc44', // 12-15 km/h: Xanh lá nhạt
      '#009933', // 15-18 km/h: Xanh tươi
      '#008000', // 18-21 km/h: Xanh vừa
      '#006600', // 21-24 km/h: Xanh đậm
      '#004d00', // 24-27 km/h: Xanh đậm hơn
      '#003300' // 27-30 km/h: Xanh đậm nhất (mạnh nhất)
    ]

    // Đảm bảo tốc độ gió nằm trong khoảng giới hạn
    const clampedWind = Math.min(Math.max(windSpeed, minWind), maxWind)

    // Tính chỉ số của khoảng tốc độ gió
    const colorIndex = Math.floor((clampedWind / maxWind) * (colors.length - 1))

    // Trả về màu tương ứng
    return colors[colorIndex]
  }

  // Hàm xử lý màu theo độ ẩm
  const getColorHumidity = (humidity) => {
    // Giới hạn độ ẩm
    const minHumidity = 50 // Độ ẩm thấp nhất (0%)
    const maxHumidity = 100 // Độ ẩm cao nhất (100%)

    // Mảng màu tùy chỉnh
    const colors = ['#A2D4F3', '#95CEF1', '#88C8EF', '#7BC2ED', '#6EBCEA', '#61B6E8', '#54B0E6', '#47AAE4']

    // Đảm bảo độ ẩm nằm trong khoảng giới hạn
    const clampedHumidity = Math.min(Math.max(humidity, minHumidity), maxHumidity)

    // Tính chỉ số của khoảng độ ẩm
    const colorIndex = Math.floor((clampedHumidity / maxHumidity) * (colors.length - 1))

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
    if (displayOption === 'temperature' || displayOption === 'storm') {
      // console.log(getTemperatureColor2(currentData.temperature))
      return getTemperatureColor2(currentData.temperature)
    }
    if (displayOption === 'wind' || displayOption === 'storm') {
      return getColorWind(currentData.wind) // Màu cam hoặc xanh
    }

    if (displayOption === 'humidity' || displayOption === 'storm') {
      return getColorHumidity(currentData.humidity) // Xanh đậm hoặc nhạt
    }

    return '#FF5733' // Mặc định
  }

  const style = (feature) => ({
    fillColor: isRegionView
      ? getRegionColor(feature.properties.region) // Màu theo region
      : getColorByOption(feature), // Màu theo thuộc tính
    weight: 0,
    opacity: 0,
    color: 'transparent', // Ẩn viền của ô
    fillOpacity: 0.2, // Điều chỉnh độ mờ,
    filter: 'blur(2px)' // Làm mờ các đường ranh giới giữa các ô
  })

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        setSelectedFeature(feature.properties)
      }
    })
  }
  const renderStormMarkers = () => {
    return weathers.map((data, index) => {
      const lon = data.lon
      const lat = data.lat

      return (
        <Marker
          key={index}
          position={[lat, lon]} // Vị trí của chấm sét
          icon={L.icon({
            iconUrl: iconStorm, // Sử dụng ảnh GIF
            iconSize: [20, 20], // Kích thước của marker
            iconAnchor: [16, 16], // Căn giữa marker
            popupAnchor: [0, -16] // Căn popup khi click vào marker
          })}
        />
      )
    })
  }

  return (
    <>
      <GeoJSON key={selectedDate} data={geoJson} style={style} onEachFeature={onEachFeature} />
      {displayOption === 'storm' && renderStormMarkers()}
      {!isRegionView && <DynamicLegend displayOption={displayOption} />}
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

          {/* Container cuộn ngang */}
          <div
            style={{
              display: 'flex',
              overflowX: 'auto', // Kích hoạt cuộn ngang
              height: '200px',
              backgroundColor: 'white',
              position: 'fixed',
              bottom: '0',
              left: '0',
              width: '100%',
              zIndex: 1000,
              boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px 8px 0 0'
            }}
          >
            {/* Nút đóng */}
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
            {/* Phần thông tin thời tiết */}
            <div
              style={{
                flex: '1',
                padding: '10px',
                width: '100%', // Chiếm đủ màn hình ban đầu
                overflowY: 'auto' // Thanh cuộn dọc nếu nội dung dài
              }}
            >
              <WeatherForecast key={selectedFeature.date} selectedFeature={selectedFeature} />
            </div>
          </div>
        </>
      )}
      <div
        style={{
          position: 'fixed',
          bottom: selectedFeature ? '200px' : '20px', // Push the controls above the div
          left: '47%',
          transform: 'translateX(-50%)',
          width: '90%',
          display: 'flex',
          alignItems: 'center', // Align items along the center vertically
          zIndex: 1101 // Higher zIndex to ensure it appears above the other content
        }}
      >
        {/* Play Button on the Left */}
        <button
          onClick={togglePlay}
          style={{
            marginRight: '15px', // Add spacing between button and other elements
            padding: '10px 20px',
            backgroundColor: isPlaying ? '#FF0000' : '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        {/* Time Slider and Markers */}
        <div style={{ flex: 1 }}>
          {/* Time Markers */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {[...Array(24 - new Date().getHours())].map((_, i) => {
              const hour = i + new Date().getHours()
              const isSelected = hour === currentHour

              return (
                <span
                  key={hour}
                  style={{
                    fontSize: '12px',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    backgroundColor: isSelected ? '#007BFF' : '#FFF',
                    color: isSelected ? '#FFF' : '#000',
                    border: '1px solid #CCC',
                    borderRadius: '4px',
                    boxShadow: isSelected ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none',
                    transition: 'background-color 0.3s, color 0.3s'
                  }}
                  onClick={() => handleTimeChange(hour)}
                >
                  {hour}:00
                </span>
              )
            })}
          </div>

          {/* Time Slider */}
          <input
            type='range'
            min={new Date().getHours()}
            max='23'
            value={currentHour}
            onChange={(e) => handleTimeChange(Number(e.target.value))}
            style={{ width: '100%', margin: '10px 0' }}
          />
        </div>
      </div>
    </>
  )
}

export default GeoJSONLayer
