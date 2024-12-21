import React, { useContext, useState } from 'react'
import { MapContext } from './MapContainer'
import troiIcon from '../access/troi.png'
import { Marker, Popup, useMap } from 'react-leaflet'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import L from 'leaflet'
// import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import IconVitri from '../access/vitri.jpg'
import ClickHandler from './Click'

const Search = () => {
  const { geoJson } = useContext(MapContext) // Lấy dữ liệu từ context
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCities, setFilteredCities] = useState([])
  const [selectedCity, setSelectedCity] = useState(null) // Thành phố được chọn
  const [location, setLocation] = useState([0, 0])
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const starIcon = L.divIcon({
    className: 'custom-star-icon',
    html: '<div style="color: gold; font-size: 24px;">★</div>', // Biểu tượng ngôi sao
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  })
  const map = useMap() // Lấy bản đồ hiện tại

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    console.log(geoJson)
    if (!value) {
      setFilteredCities([]) // Nếu không nhập từ khóa, xóa kết quả tìm kiếm
    } else {
      // const seenNames = new Set()
      // const filtered = geoJsonData.features.filter((feature) => {
      //   const name = feature?.properties?.name?.toLowerCase()
      //   if (name && !seenNames.has(name) && name.includes(value.toLowerCase())) {
      //     seenNames.add(name)
      //     return true
      //   }
      //   return false
      // })

      // setFilteredCities(filtered)
      const filtered = geoJson.features.filter((feature) =>
        feature.properties.name.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredCities(filtered) // Cập nhật danh sách kết quả tìm kiếm
    }
  }

  const handleButtonClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          map.flyTo([latitude, longitude], 15) // Zoom đến vị trí thành phố
          setLocation([latitude, longitude])
          setIsPopupVisible(true)
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`)
          // Thực hiện logic tiếp theo, ví dụ: gọi API dựa trên vị trí hiện tại
        },
        (error) => {
          console.error('Lỗi khi lấy vị trí:', error.message)
          alert('Không thể lấy vị trí của bạn. Vui lòng kiểm tra cài đặt trình duyệt.')
        }
      )
    } else {
      alert('Trình duyệt của bạn không hỗ trợ Geolocation.')
    }
  }

  const handleCityClick = (city) => {
    setSelectedCity(city) // Lưu thông tin thành phố đã chọn
    map.flyTo([city.geometry.coordinates[0][0][1], city.geometry.coordinates[0][0][0]], 10) // Zoom đến vị trí thành phố
    setSearchTerm('') // Xóa từ khóa tìm kiếm
    setFilteredCities([]) // Xóa kết quả tìm kiếm
  }
  const currentHour = new Date().getHours() % 24
  // const currentData = hourlyData.find((hour) => hour.hour === String(currentHour)) || {}
  // Tìm thông tin từ hourlyData theo giờ hiện tại
  const currentData = selectedCity?.properties?.hourlyData.find((data) => data.hour === currentHour) || null
  console.log(currentData)
  return (
    <div style={{ position: 'relative', zIndex: 1000, width: '300px', margin: '10px', marginLeft: '50px' }}>
      <input
        type='text'
        placeholder='Tìm kiếm thành phố...'
        value={searchTerm}
        onChange={handleSearch}
        style={{
          width: '90%',
          padding: '10px', // Dành chỗ cho icon ở bên phải
          border: '1px solid #ddd',
          borderRadius: '5px',
          marginBottom: '10px'
        }}
      />
      <button
        onClick={handleButtonClick}
        style={{
          position: 'absolute',
          top: '50%',
          left: 'calc(100% + 10px)',
          transform: 'translateY(-50%)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '5px'
        }}
      >
        <img
          src={IconVitri} // Thay bằng đường dẫn đến icon
          alt='Location Icon'
          style={{
            width: '30px',
            height: '30px'
          }}
        />
      </button>
      {filteredCities.length > 0 && (
        <ul
          style={{
            background: '#fff',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 6px rgb(253, 140, 1)'
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
                color: 'black', // Chữ màu đen
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
      {selectedCity && <ClickHandler selectedFeature={selectedCity.properties} />}
      {isPopupVisible && (
        <Marker position={location} icon={starIcon}>
          <Popup>
            {currentData ? (
              <div
                style={{
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  fontSize: '14px',
                  color: '#333',
                  textAlign: 'left'
                }}
              >
                <h4
                  style={{
                    marginBottom: '8px',
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}
                >
                  Thời tiết hiện tại
                </h4>
                <p style={{ margin: '4px 0' }}>
                  <strong style={{ color: '#555' }}>Nhiệt độ:</strong>{' '}
                  <span style={{ color: '#FF6600' }}>{currentData.temperature}°C</span>
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong style={{ color: '#555' }}>Độ ẩm:</strong>{' '}
                  <span style={{ color: '#007BFF' }}>{currentData.humidity}%</span>
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong style={{ color: '#555' }}>Tốc độ gió:</strong>{' '}
                  <span style={{ color: '#2ECC71' }}>{currentData.wind} km/h</span>
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong style={{ color: '#555' }}>Áp suất:</strong>{' '}
                  <span style={{ color: '#FF3366' }}>{currentData.pressure} mb</span>
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong style={{ color: '#555' }}>Điểm sương:</strong>{' '}
                  <span style={{ color: '#9B59B6' }}>{currentData.visibility}°C</span>
                </p>
              </div>
            ) : (
              <span>Không có dữ liệu thời tiết cho giờ hiện tại</span>
            )}
          </Popup>
        </Marker>
      )}
    </div>
  )
}

export default Search
