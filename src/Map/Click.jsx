import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'

const ClickHandler = ({ setClickedCoords }) => {
  // Sử dụng hook useMapEvents để bắt sự kiện click
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng // Lấy tọa độ từ sự kiện click
      setClickedCoords({ lat, lng }) // Cập nhật tọa độ vào state
      console.log('Tọa độ : ' + e.latlng.lat + ' : ' + e.latlng.lng)
    }
  })
  return null
}

export default ClickHandler
