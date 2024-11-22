import React, { useState } from 'react'

const Search = ({ weatherData, onSearchResult }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    // Lọc dữ liệu theo từ khóa tìm kiếm
    if (!value) {
      onSearchResult(weatherData) // Trả lại toàn bộ dữ liệu nếu từ khóa trống
    } else {
      const filteredData = weatherData.filter((data) => data.city.toLowerCase().includes(value.toLowerCase()))
      onSearchResult(filteredData)
    }
  }

  return (
    <div>
      <input
        type='text'
        placeholder='Tìm kiếm thành phố...'
        value={searchTerm}
        onChange={handleSearch}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          border: '1px solid #ddd',
          borderRadius: '5px'
        }}
      />
    </div>
  )
}

export default Search
