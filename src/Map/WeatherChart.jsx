import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Đăng ký các thành phần cần thiết
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const WeatherChart = ({ selectedFeature }) => {
  if (!selectedFeature || !selectedFeature.hourlyData) {
    return (
      <p
        style={{
          textAlign: 'center',
          color: '#888',
          fontStyle: 'italic',
          marginTop: '20px'
        }}
      >
        Bấm vào một điểm trên bản đồ để xem chi tiết thời tiết.
      </p>
    )
  }

  const labels = selectedFeature.hourlyData.map((hourData) => `${hourData.hour}:00`)
  const temperatureData = selectedFeature.hourlyData.map((hourData) => hourData.temperature ?? 0)
  const humidityData = selectedFeature.hourlyData.map((hourData) => hourData.humidity ?? 0)
  const windData = selectedFeature.hourlyData.map((hourData) => hourData.wind ?? 0)

  const data = {
    labels,
    datasets: [
      {
        label: 'Nhiệt độ (°C)',
        data: temperatureData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3
      },
      {
        label: 'Độ ẩm (%)',
        data: humidityData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.3
      },
      {
        label: 'Gió (km/h)',
        data: windData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: `Chi tiết thời tiết - ${selectedFeature.name}`
      }
    }
  }

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '20px auto',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#f4faff'
      }}
    >
      <Line data={data} options={options} />
    </div>
  )
}

export default WeatherChart
