import React, { useContext, useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import troiIcon from './png/storm.gif'
import L from 'leaflet'
import { MapContext } from './MapContainer'
const ClickHandler = ({ selectedFeature }) => {
  console.log(selectedFeature, selectedFeature.lon, selectedFeature.lat)

  const { geoJson } = useContext(MapContext)
  const currentHour = new Date().getHours() % 24 // Đảm bảo giá trị từ 0 đến 23
  const cur = Math.floor(currentHour / 3)
  const targetHour = cur * 300

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
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Thời tiết hiện tại
            </h3>
            <h4
              style={{
                margin: '0',
                fontSize: '14px',
                fontWeight: 'normal'
              }}
            >
              Địa điểm
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
              src={troiIcon}
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
                {selectedFeature.hourlyData.find((hour) => hour.hour === targetHour)?.temperature}
              </p>
              <p
                style={{
                  margin: '0',
                  fontSize: '14px'
                }}
              >
                Trời hầu như quang mây. Nhiệt độ thấp là 16°C.
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
                {selectedFeature.hourlyData.find((hour) => hour.hour === targetHour)?.wind} km/giờ
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong>Độ ẩm</strong>
              <p style={{ margin: '5px 0' }}>
                {selectedFeature.hourlyData.find((hour) => hour.hour === targetHour)?.humidity} %
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong>Tầm nhìn</strong>
              <p style={{ margin: '5px 0' }}>
                {selectedFeature.hourlyData.find((hour) => hour.hour === targetHour)?.visibility} km
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong>Áp suất</strong>
              <p style={{ margin: '5px 0' }}>
                {selectedFeature.hourlyData.find((hour) => hour.hour === targetHour)?.pressure} mb
              </p>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  ) // Trả về null nếu không có tọa độ được chọn
}

export default ClickHandler
