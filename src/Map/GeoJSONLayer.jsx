import React, { useContext, useState } from 'react'
import { GeoJSON } from 'react-leaflet'
import { MapContext } from './MapContainer'
import WeatherChart from './WeatherChart'

const GeoJSONLayer = ({ data }) => {
  const [selectedFeature, setSelectedFeature] = useState(null)
  const { weatherData, geoJson, displayOption } = useContext(MapContext)
  console.log('Feature properties:', displayOption)
  if (!geoJson || !geoJson.features || geoJson.features.length === 0) {
    console.log('GeoJSON is not ready yet')
    return null // Không render gì nếu `geoJson` chưa có dữ liệu
  }
  const currentHour = new Date().getHours() % 24 // Đảm bảo giá trị từ 0 đến 23
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
    const currentData = hourlyData.find((hour) => hour.hour === String(currentHour)) || {}

    if (displayOption === 'temperature') {
      console.log(getTemperatureColor2(currentData.temperature))
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
    fillOpacity: 0.2
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

      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '10px',
          borderTop: '1px solid #ddd',
          maxHeight: '25vh', // Chiếm 25% chiều cao màn hình
          overflowY: 'hidden', // Không thêm thanh cuộn dọc
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
        {selectedFeature ? (
          <div
            style={{
              fontSize: 'clamp(10px, 1.2vw, 14px)', // Font tự động co nhỏ
              lineHeight: '1.2',
              overflowX: 'auto' // Thêm thanh cuộn ngang nếu cần
            }}
          >
            <WeatherChart selectedFeature={selectedFeature} />
            {/* <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>
              <strong>Địa điểm:</strong> {selectedFeature.name}
            </p>
          

            <div
              style={{
                overflowX: 'auto' // Thêm thanh cuộn ngang nếu bảng rộng hơn
              }}
            >
              <table
                style={{
                  width: '99%',
                  borderCollapse: 'collapse',
                  marginTop: '10px',
                  fontSize: 'inherit' // Phụ thuộc vào kích thước chữ của container
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#f1f1f1', color: '#333' }}>
                    <th
                      style={{
                        border: '1px solid #ddd',
                        padding: '8px',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      Giờ
                    </th>
                    {selectedFeature.hourlyData?.map((hourData, index) => (
                      <th
                        key={index}
                        style={{
                          border: '1px solid #ddd',
                          padding: '8px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                      >
                        {hourData.hour}:00
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: '#f9f9f9' }}>
                    <td
                      style={{
                        border: '1px solid #ddd',
                        padding: '8px',
                        fontWeight: 'bold',
                        color: '#333',
                        textAlign: 'center'
                      }}
                    >
                      Nhiệt độ (°C)
                    </td>
                    {selectedFeature.hourlyData?.map((hourData, index) => (
                      <td
                        key={index}
                        style={{
                          border: '1px solid #ddd',
                          padding: '8px',
                          textAlign: 'center'
                        }}
                      >
                        {hourData.temperature ?? 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: '1px solid #ddd',
                        padding: '8px',
                        fontWeight: 'bold',
                        color: '#333',
                        textAlign: 'center'
                      }}
                    >
                      Độ ẩm (%)
                    </td>
                    {selectedFeature.hourlyData?.map((hourData, index) => (
                      <td
                        key={index}
                        style={{
                          border: '1px solid #ddd',
                          padding: '8px',
                          textAlign: 'center'
                        }}
                      >
                        {hourData.humidity ?? 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr style={{ backgroundColor: '#f9f9f9' }}>
                    <td
                      style={{
                        border: '1px solid #ddd',
                        padding: '8px',
                        fontWeight: 'bold',
                        color: '#333',
                        textAlign: 'center'
                      }}
                    >
                      Gió (km/h)
                    </td>
                    {selectedFeature.hourlyData?.map((hourData, index) => (
                      <td
                        key={index}
                        style={{
                          border: '1px solid #ddd',
                          padding: '8px',
                          textAlign: 'center'
                        }}
                      >
                        {hourData.wind ?? 'N/A'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div> */}
          </div>
        ) : (
          <p
            style={{
              textAlign: 'center',
              color: '#888',
              fontStyle: 'italic',
              marginTop: '20px'
            }}
          >
            Bấm vào một điểm trên bản đồ để xem chi tiết thời tiết.
          </p>
        )}
      </div>
    </>
  )
}

export default GeoJSONLayer
