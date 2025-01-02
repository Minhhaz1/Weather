import React from 'react'

const DynamicLegend = ({ displayOption }) => {
  const legends = {
    temperature: {
      gradient:
        'linear-gradient(to right, #0000FF, #0033FF, #0066FF, #0099FF, #00CCFF, #00FFFF, #33FFCC, #66FF99, #99FF66, #CCFF33, #FFFF33, #FFFF00, #FFCC00, #FF9900, #FF6600, #FF3300, #FF0000, #CC0000, #990000, #660000)',
      labels: ['0°C', '10°C', '20°C', '30°C', '40°C']
    },
    wind: {
      gradient:
        'linear-gradient(to right, #003300, #005900, #008000, #00a600, #00cc00, #00cc44, #33ff33, #66ff66, #99ff99, #ccffcc)',
      labels: ['40 kt', '30 kt', '20 kt', '10 kt', '0 kt']
    },
    humidity: {
      gradient:
        'linear-gradient(to right, #0000FF, #0033FF, #0066FF, #0099FF, #00CCFF, #00FFFF, #33CCFF, #3399FF, #3366FF, #3333FF)',
      labels: ['40%', '60%', '80%', '100%']
    }
  }

  const legendData = legends[displayOption]

  if (!legendData) {
    return null // Không hiển thị nếu không có dữ liệu
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '300px',
        backgroundColor: 'white',
        backgroundColor: 'rgba(28, 183, 230, 0.19)', // Nền trong suốt 70%
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1100,
        width: '200px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h4 style={{ fontSize: '14px', margin: '0 0 10px', color: 'black', textAlign: 'center' }}>
        {displayOption === 'temperature'
          ? 'Dải màu Nhiệt độ'
          : displayOption === 'wind'
            ? 'Dải màu Gió'
            : displayOption === 'humidity'
              ? 'Dải màu Độ ẩm'
              : 'Chú giải'}
      </h4>
      <div style={{ position: 'relative', height: '20px', marginBottom: '10px' }}>
        {/* Dải màu gradient */}
        <div
          style={{
            height: '100%',
            background: legendData.gradient,
            borderRadius: '5px'
          }}
        ></div>

        {/* Các nhãn chia mốc */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'absolute',
            top: '22px',
            left: '0',
            width: '100%',
            fontSize: '10px',
            color: '#555'
          }}
        >
          {legendData.labels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DynamicLegend
