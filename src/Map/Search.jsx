import React, { useContext, useState } from 'react'
import { MapContext } from './MapContainer'
import { Marker, Popup, useMap } from 'react-leaflet'

const Search = () => {
  const { geoJson } = useContext(MapContext) // Lấy dữ liệu từ context
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCities, setFilteredCities] = useState([])
  const [selectedCity, setSelectedCity] = useState(null) // Thành phố được chọn

  const map = useMap() // Lấy bản đồ hiện tại

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    if (!value) {
      setFilteredCities([]) // Nếu không nhập từ khóa, xóa kết quả tìm kiếm
    } else {
      const filtered = geoJson.features.filter((feature) =>
        feature.properties.name.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredCities(filtered) // Cập nhật danh sách kết quả tìm kiếm
    }
  }

  const handleCityClick = (city) => {
    setSelectedCity(city) // Lưu thông tin thành phố đã chọn
    map.flyTo([city.geometry.coordinates[0][0][1], city.geometry.coordinates[0][0][0]], 10) // Zoom đến vị trí thành phố
    setSearchTerm('') // Xóa từ khóa tìm kiếm
    setFilteredCities([]) // Xóa kết quả tìm kiếm
  }

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, width: '300px' }}>
      <input
        type='text'
        placeholder='Tìm kiếm thành phố...'
        value={searchTerm}
        onChange={handleSearch}
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          marginBottom: '10px'
        }}
      />
      {filteredCities.length > 0 && (
        <ul
          style={{
            background: '#fff',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          {filteredCities.map((city, index) => (
            <li
              key={index}
              style={{
                margin: '5px 0',
                cursor: 'pointer',
                padding: '5px',
                borderRadius: '5px',
                background: '#f5f5f5',
                transition: 'background 0.3s'
              }}
              onClick={() => handleCityClick(city)}
              onMouseEnter={(e) => (e.target.style.background = '#e8e8e8')}
              onMouseLeave={(e) => (e.target.style.background = '#f5f5f5')}
            >
              {city.properties.name}
            </li>
          ))}
        </ul>
      )}
      {selectedCity && (
        <Marker position={[selectedCity.geometry.coordinates[0][0][1], selectedCity.geometry.coordinates[0][0][0]]}>
          <Popup>
            <strong>{selectedCity.properties.name}</strong>
            <br />
            Nhiệt độ: {selectedCity.properties.temperature}°C
          </Popup>
        </Marker>
      )}
    </div>
  )
}

export default Search
