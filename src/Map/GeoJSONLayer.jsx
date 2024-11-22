import React, { useContext, useState } from 'react'
import { GeoJSON } from 'react-leaflet'
import { MapContext } from './MapContainer'
import DetailWeather from './DetailWeather'

const GeoJSONLayer = ({ data }) => {
  const [selectedFeature, setSelectedFeature] = useState(null)
  const { geoJsonData, displayOption } = useContext(MapContext)
  const getColorByOption = (feature) => {
    if (displayOption === 'temperature') {
      return feature.properties.temperature > 30
        ? '#FF0000' // Đỏ cho nhiệt độ cao
        : feature.properties.temperature < 20
          ? '#0000FF' // Xanh cho nhiệt độ thấp
          : '#FFFF00' // Vàng cho nhiệt độ trung bình
    }

    if (displayOption === 'wind') {
      return feature.properties.wind > 5 ? '#FF5733' : '#33FF57' // Màu cam hoặc xanh
    }

    if (displayOption === 'humidity') {
      return feature.properties.humidity > 80 ? '#0033CC' : '#66CCFF' // Xanh đậm hoặc nhạt
    }

    return '#FFFFFF' // Mặc định
  }

  const style = (feature) => ({
    fillColor: getColorByOption(feature),
    weight: 0,
    opacity: 0,
    color: 'white',
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
      <GeoJSON data={geoJsonData} style={style} onEachFeature={onEachFeature} />
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderTop: '1px solid #ddd',
          maxHeight: '200px',
          overflowY: 'auto'
        }}
      >
        {selectedFeature ? (
          <div
            style={{
              position: 'absolute', // Sidebar đè lên bản đồ
              bottom: '0px', // Căn chỉnh từ trên xuống
              left: '0', // Nằm sát bên trái
              width: '1600px', // Chiều rộng của Sidebar
              height: 'calc(100% - 500px)', // Chiều cao của Sidebar
              backgroundColor: '#f8f9fa', // Màu nền Sidebar
              borderRight: '1px solid #ddd', // Viền bên phải
              zIndex: 1000, // Đảm bảo Sidebar luôn nằm trên cùng
              overflowY: 'auto', // Cuộn nội dung nếu quá dài
              padding: '10px' // Khoảng cách bên trong
            }}
          >
            <h4>Thông tin chi tiết</h4>
            <p>
              <strong>Địa điểm:</strong> {selectedFeature.name}
            </p>
            <p>
              <strong>Nhiệt độ:</strong> {selectedFeature.temperature}°C
            </p>
            <p>
              <strong>Gió:</strong> {selectedFeature.wind} km/h
            </p>
            <p>
              <strong>Độ ẩm:</strong> {selectedFeature.humidity}%
            </p>
          </div>
        ) : (
          <p>Bấm vào một điểm trên bản đồ để xem chi tiết thời tiết.</p>
        )}
      </div>
    </>
  )
}

export default GeoJSONLayer
