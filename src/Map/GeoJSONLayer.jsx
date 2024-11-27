import React, { useContext, useState } from 'react'
import { GeoJSON } from 'react-leaflet'
import { MapContext } from './MapContainer'

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
  const getColorByOption = (feature) => {
    const hourlyData = feature.properties.hourlyData || []
    const currentData = hourlyData.find((hour) => hour.hour === String(currentHour)) || {}

    if (displayOption === 'temperature') {
      return currentData.temperature > 30
        ? '#FF0000' // Đỏ cho nhiệt độ cao
        : currentData.temperature < 20
          ? '#0000FF' // Xanh cho nhiệt độ thấp
          : '#FFFF00' // Vàng cho nhiệt độ trung bình
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
    weight: 1,
    opacity: 1,
    color: 'black',
    fillOpacity: 0.15
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
        {selectedFeature ? (
          <div
            style={{
              fontSize: 'clamp(10px, 1.2vw, 14px)', // Font tự động co nhỏ
              lineHeight: '1.2',
              overflowX: 'auto' // Thêm thanh cuộn ngang nếu cần
            }}
          >
            <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>
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
            </div>
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
