import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'

const ClickHandler = () => {
  const [clickedCoords, setClickedCoords] = useState(null)

  // Sử dụng hook useMapEvents để bắt sự kiện click
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng // Lấy tọa độ từ sự kiện click
      setClickedCoords({ lat, lng }) // Cập nhật tọa độ vào state
      console.log('Tọa độ : ' + lat + ' : ' + lng)
    }
  })

  // Hiển thị Marker khi tọa độ được chọn
  return clickedCoords ? (
    <Marker position={[clickedCoords.lat, clickedCoords.lng]}>
      <Popup>
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            color: '#333',
            background: '#f8f9fa',
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>Tọa độ chi tiết</h3>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Lat:</strong> {clickedCoords.lat}
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            <strong>Lng:</strong> {clickedCoords.lng}
          </p>
        </div>
      </Popup>
    </Marker>
  ) : null // Trả về null nếu không có tọa độ được chọn
}

export default ClickHandler
