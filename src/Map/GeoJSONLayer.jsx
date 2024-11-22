import React, { useContext } from 'react'
import { GeoJSON } from 'react-leaflet'
import { MapContext } from './MapContainer'

const GeoJSONLayer = ({ data }) => {
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
    if (feature.properties) {
      layer.bindPopup(`<b>${feature.properties.name}</b><br/>Nhiệt độ: ${feature.properties.temperature}°C`)
    }
  }

  return <GeoJSON data={geoJsonData} style={style} onEachFeature={onEachFeature} />
}

export default GeoJSONLayer
