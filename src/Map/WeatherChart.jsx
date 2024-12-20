import React from 'react'
import { Line } from 'react-chartjs-2'

// Tùy chỉnh dữ liệu và tùy chọn biểu đồ
const ChartBackground = ({ data }) => {
  // Dữ liệu mẫu, bạn có thể thay đổi theo `selectedFeature`
  const chartData = {
    labels: data.map((d) => `${d.hour}:00`), // Trục X (giờ)
    datasets: [
      {
        label: 'Nhiệt độ (°C)',
        data: data.map((d) => d.temperature), // Dữ liệu nhiệt độ
        fill: true,
        backgroundColor: 'rgba(0, 123, 255, 0.2)', // Nền biểu đồ
        borderColor: 'rgba(0, 123, 255, 1)', // Màu viền
        pointBackgroundColor: 'rgba(0, 123, 255, 1)', // Màu điểm
        tension: 0.4 // Đường cong mềm mại
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false // Ẩn nhãn biểu đồ
      }
    },
    scales: {
      x: {
        grid: {
          display: false // Ẩn đường lưới trục X
        }
      },
      y: {
        grid: {
          display: true // Hiển thị đường lưới trục Y
        },
        beginAtZero: true
      }
    }
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '200px',
        position: 'fixed',
        bottom: '0',
        left: '0',
        width: '100%',
        zIndex: 1000,
        boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px 8px 0 0',
        padding: '10px'
      }}
    >
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}

export default ChartBackground
