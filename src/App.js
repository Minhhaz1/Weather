import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents } from 'react-leaflet'
import { bbox, pointGrid, booleanPointInPolygon } from '@turf/turf'
import 'leaflet/dist/leaflet.css'
import * as turf from '@turf/turf'
import L from 'leaflet' // Import leaflet
import 'leaflet.heat' // Import heatmap layer của leaflet
import 'leaflet/dist/leaflet.css'
import weatherData from './weatherData'

// Dữ liệu nhiệt độ mẫu (GeoJSON)
const geoJsonData = {
  type: 'FeatureCollection',
  features: weatherData.map((data) => {
    // Tạo một hình chữ nhật xung quanh mỗi tọa độ (Polygon)
    const offset = 0.25 // Độ lệch nhỏ để tạo hình chữ nhật (5km)
    const polygonCoordinates = [
      [
        [data.lon - offset, data.lat - offset], // Bottom-left
        [data.lon + offset, data.lat - offset], // Bottom-right
        [data.lon + offset, data.lat + offset], // Top-right
        [data.lon - offset, data.lat + offset], // Top-left
        [data.lon - offset, data.lat - offset] // Đóng kín Polygon
      ]
    ]
    return {
      type: 'Feature',
      properties: {
        name: data.city,
        temperature: data.temp,
        humidity: data.humidity,
        wind: data.wind
      },
      geometry: {
        type: 'Polygon',
        coordinates: polygonCoordinates
      }
    }
  })
}

const generateHeatmapPoints = (geoJsonData) => {
  const points = []

  geoJsonData.features.forEach((feature) => {
    // Lấy nhiệt độ từ thuộc tính
    const temperature = feature.properties.temperature

    // Tạo lưới điểm bên trong Polygon
    const bbox = turf.bbox(feature) // Lấy bounding box của Polygon
    const grid = turf.pointGrid(bbox, 0.01, { units: 'degrees' }) // Tạo lưới điểm

    grid.features.forEach((point) => {
      // Kiểm tra nếu điểm nằm trong Polygon
      if (turf.booleanPointInPolygon(point, feature)) {
        const [lon, lat] = point.geometry.coordinates
        points.push([lat, lon, temperature / 40]) // Chuẩn hóa nhiệt độ
      }
    })
  })

  return points
}

// Tạo dữ liệu Heatmap từ GeoJSON
const heatmapPoints = generateHeatmapPoints(geoJsonData)

// Heatmap Layer Component
const HeatmapLayers = ({ data }) => {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    // Chuyển đổi dữ liệu weatherData thành dạng phù hợp cho Heatmap
    const heatData = data.map((point) => [point.lat, point.lon, point.temp]) // Chia nhiệt độ để giá trị nằm trong khoảng [0, 1]

    // Thêm Heatmap Layer
    const heatLayer = L.heatLayer(heatData, {
      radius: 30, // Bán kính của mỗi điểm
      blur: 1, // Độ mờ
      maxZoom: 17, // Mức zoom tối đa
      max: 40 // Cường độ tối đa
    })

    map.addLayer(heatLayer)

    return () => {
      // Loại bỏ Heatmap khi component bị hủy
      map.removeLayer(heatLayer)
    }
  }, [map, data])

  return null
}

const ClickHandler = ({ setClickedCoords }) => {
  // Sử dụng hook useMapEvents để bắt sự kiện click
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng // Lấy tọa độ từ sự kiện click
      setClickedCoords({ lat, lng }) // Cập nhật tọa độ vào state
      console.log('Toa do : ' + e.latlng.lat + ' : ' + e.latlng.lng)
    }
  })
  return null
}

const HeatmapLayerss = ({ data }) => {
  const map = useMap() // Lấy đối tượng bản đồ từ MapContainer

  useEffect(() => {
    if (!map) return

    if (data.length === 0) {
      console.warn('No valid heatmap points found!')
      return
    }

    const heatLayer = L.heatLayer(data, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      max: 40
    })

    map.addLayer(heatLayer) // Thêm Heatmap Layer vào bản đồ

    return () => {
      map.removeLayer(heatLayer) // Loại bỏ Heatmap Layer khi component bị hủy
    }
  }, [map, data])

  return null
}

// Hàm để xác định màu sắc dựa trên nhiệt độ
const getColorByTemperature = (temperature) => {
  if (temperature < 20) return '#0000FF' // Xanh cho nhiệt độ thấp
  if (temperature >= 20 && temperature <= 30) return '#FFFF00' // Vàng cho nhiệt độ trung bình
  return '#FF0000' // Đỏ cho nhiệt độ cao
}

const App = () => {
  const [mapData, setMapData] = useState(null)
  const [clickedCoords, setClickedCoords] = useState(null) // Lưu tọa độ click

  useEffect(() => {
    setMapData(geoJsonData)
  }, [])

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.bindPopup(`<b>${feature.properties.name}</b><br/>Nhiệt độ: ${feature.properties.temperature}°C`)
    }
  }

  const style = (feature) => ({
    fillColor: getColorByTemperature(feature.properties.temperature),
    weight: 0,
    opacity: 0,
    color: 'white',
    fillOpacity: 0.3
  })

  // Giới hạn phạm vi bản đồ (bounds)
  const vietnamBounds = [
    [8.1790665, 102.14441], // Góc Tây Nam
    [23.3929, 109.469] // Góc Đông Bắc
  ]

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <h1 style={{ textAlign: 'center' }}>Bản đồ nhiệt độ Việt Nam</h1>
      <MapContainer
        bounds={vietnamBounds} // Thiết lập phạm vi hiển thị
        maxBounds={vietnamBounds} // Giới hạn kéo trong phạm vi Việt Nam
        maxBoundsViscosity={1.0} // Độ cứng của giới hạn (không cho kéo ra ngoài)
        minZoom={5}
        style={{ height: '90%', width: '100%' }}
      >
        <TileLayer
          url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          attribution='&copy; <a href="https://www.carto.com/">Carto</a> contributors'
        />
        {mapData && <GeoJSON data={mapData} style={style} onEachFeature={onEachFeature} />}
        {/* HeatmapLayer */}
        {/* <HeatmapLayer
          fitBoundsOnLoad
          fitBoundsOnUpdate
          points={heatmapPoints} // Dữ liệu heatmap (tọa độ và giá trị nhiệt độ)
          longitudeExtractor={(point) => point.lng}
          latitudeExtractor={(point) => point.lat}
          intensityExtractor={(point) => point.value} // Giá trị intensity là nhiệt độ
          radius={50} // Bán kính ảnh hưởng của mỗi điểm
          blur={35} // Độ mờ của heatmap
          max={40} // Giá trị nhiệt độ lớn nhất (giá trị tối đa của intensity)
        /> */}
        {/* HeatmapLayer */}
        {/* <HeatmapLayers data={heatmapPoints} />
         */}
        {/* Heatmap Layer */}
        {/* <HeatmapLayerss data={heatmapPoints} />*/}
        <ClickHandler setClickedCoords={setClickedCoords} />
      </MapContainer>
      {clickedCoords && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <strong>Tọa độ đã click:</strong> {`Latitude: ${clickedCoords.lat}, Longitude: ${clickedCoords.lng}`}
        </div>
      )}
    </div>
  )
}

export default App
