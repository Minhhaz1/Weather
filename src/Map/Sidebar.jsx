import { useState } from 'react'

const Sidebar = ({ onOptionChange }) => {
  const [selectedOption, setSelectedOption] = useState('temperature')

  const handleOptionChange = (option) => {
    setSelectedOption(option)
    onOptionChange(option) // Gửi tùy chọn đến component cha
  }

  return (
    <div
      style={{
        position: 'absolute', // Sidebar đè lên bản đồ
        top: '200px', // Căn chỉnh từ trên xuống
        left: '0', // Nằm sát bên trái
        width: '120px', // Chiều rộng của Sidebar
        height: 'calc(100% - 500px)', // Chiều cao của Sidebar
        backgroundColor: '#f8f9fa', // Màu nền Sidebar
        borderRight: '1px solid #ddd', // Viền bên phải
        zIndex: 1000, // Đảm bảo Sidebar luôn nằm trên cùng
        overflowY: 'auto' // Cuộn nội dung nếu quá dài
      }}
    >
      <ul style={{ listStyleType: 'none', padding: '10px' }}>
        <li>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: selectedOption === 'temperature' ? '#d1e7dd' : '#fff'
            }}
            onClick={() => handleOptionChange('temperature')}
          >
            Nhiệt độ
          </button>
        </li>
        <li>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: selectedOption === 'wind' ? '#d1e7dd' : '#fff'
            }}
            onClick={() => handleOptionChange('wind')}
          >
            Gió
          </button>
        </li>
        <li>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: selectedOption === 'humidity' ? '#d1e7dd' : '#fff'
            }}
            onClick={() => handleOptionChange('humidity')}
          >
            Độ ẩm
          </button>
        </li>
      </ul>
    </div>
  )
}

const buttonStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
  textAlign: 'center'
}

export default Sidebar
