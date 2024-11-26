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
        width: '60px', // Chiều rộng của Sidebar
        height: '230px', // Chiều cao cố định (đủ để hiển thị 3 nút)
        backgroundColor: 'rgba(255, 255, 255, 0)', // Nền trong suốt 70%
        // borderRight: '1px solid #ddd', // Viền bên phải
        zIndex: 1000, // Đảm bảo Sidebar luôn nằm trên cùng
        overflowY: 'auto', // Cuộn dọc nếu nội dung quá dài
        padding: '10px' // Khoảng cách trong sidebar
      }}
    >
      <ul style={{ listStyleType: 'none', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <link href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css' rel='stylesheet' />
        <link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet' />
        <li>
          <button
            style={{
              ...circleButtonStyle,
              backgroundColor: selectedOption === 'temperature' ? '#d1e7dd' : '#fff'
            }}
            onClick={() => handleOptionChange('temperature')}
          >
            <i className='fas fa-thermometer-half' style={iconStyle}></i>
          </button>
        </li>
        <li>
          <button
            style={{
              ...circleButtonStyle,
              backgroundColor: selectedOption === 'wind' ? '#d1e7dd' : '#fff'
            }}
            onClick={() => handleOptionChange('wind')}
          >
            <i className='fas fa-wind' style={iconStyle}></i>
          </button>
        </li>
        <li>
          <button
            style={{
              ...circleButtonStyle,
              backgroundColor: selectedOption === 'humidity' ? '#d1e7dd' : '#fff'
            }}
            onClick={() => handleOptionChange('humidity')}
          >
            <i className='fas fa-tint' style={iconStyle}></i>
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

const circleButtonStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '50%', // Tạo hình tròn
  border: '1px solid #ccc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '18px', // Kích thước biểu tượng
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Hiệu ứng bóng
  transition: 'background-color 0.3s ease' // Hiệu ứng màu nền
}

const iconStyle = {
  color: '#007bff' // Màu của biểu tượng
}

export default Sidebar
