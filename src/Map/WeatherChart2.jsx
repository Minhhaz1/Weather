import React from 'react'
import './index.css'

import icon19 from './png/rain.gif'
import sunny from './png/sunny.gif'
import rain from './png/rain.gif'
import storm from './png/storm.gif'
import clouds from './png/clouds.gif'
import wind from './png/wind.gif'
import night from './png/night.gif'
import rainnight from './png/rainnight.png'
import overcast from './png/overcast.png'
import partly_cloudy from './png/PartlyCloudy.gif'
import partlyrain from './png/party rain.gif'
import fog from './png/fog.gif'

// Dữ liệu mẫu (mock data)
const lines = [
  [0, 'Freezing'],
  [10, 'Cold'],
  [20, 'Warm'],
  [30, 'Hot'],
  [37, 'Extreme']
]

const e = {
  color: (value) => {
    if (value <= 10) return 'rgb(0, 0, 255)' // Xanh dương
    if (value <= 20) return 'rgb(0, 255, 255)' // Xanh nhạt
    if (value <= 30) return 'rgb(255, 255, 0)' // Vàng
    if (value <= 37) return 'rgb(255, 0, 0)' // Đỏ
    return 'rgb(128, 0, 0)' // Đỏ đậm
  }
}

const e1 = {
  color: (value) => {
    if (value > 90) return 'rgb(0, 0, 255)' // Xanh đậm
    if (value > 80) return 'rgb(51, 102, 255)' // Xanh đậm vừa
    if (value > 70) return 'rgb(102, 153, 255)' // Xanh vừa
    if (value > 60) return 'rgb(153, 204, 255)' // Xanh nhạt vừa
    if (value > 50) return 'rgb(204, 229, 255)' // Xanh nhạt
    return 'rgb(204, 255, 255)' // Xanh nhạt nhất
  }
}

const e2 = {
  color: (value) => {
    if (value > 40) return 'rgb(0, 128, 0)' // Xanh lá cây đậm
    if (value > 25) return 'rgb(34, 139, 34)' // Xanh lá cây đậm vừa
    if (value > 15) return 'rgb(60, 179, 113)' // Xanh lá cây vừa
    if (value > 8) return 'rgb(144, 238, 144)' // Xanh lá cây nhạt vừa
    if (value > 3) return 'rgb(152, 251, 152)' // Xanh lá cây nhạt
    return 'rgb(240, 255, 240)' // Xanh lá cây nhạt nhất
  }
}

// Hàm tính màu dựa trên một nhiệt độ cụ thể
const createGradientForTemperature = (temperature) => {
  const range = 10 // Khoảng lân cận để tính màu
  const step = 2 // Bước nhảy giữa các giá trị nhiệt độ
  const colors = []

  // Lấy các giá trị nhiệt độ trong khoảng lân cận
  for (let temp = temperature - range; temp <= temperature + range; temp += step) {
    // Đảm bảo giá trị nằm trong phạm vi hợp lệ
    const clampedTemp = Math.min(Math.max(temp, lines[0][0]), lines[lines.length - 1][0])
    const color = calculateColorForTemperature(clampedTemp)
    colors.push(color)
  }

  return `linear-gradient(to right, ${colors.join(', ')})`
}
const descriptionToIconMap = {
  'Overcast ': overcast,
  'Patchy rain nearby': partlyrain,
  Fog: fog,
  'Moderate snow': clouds,
  'Patchy light rain': partlyrain,
  'Cloudy ': clouds,
  'Clear ': sunny,
  'Thundery outbreaks possible': storm,
  'Partly Cloudy ': partly_cloudy,
  'Patchy light snow': clouds,
  'Patchy heavy snow': clouds,
  'Moderate or heavy rain with thunder': storm,
  'Light rain': partlyrain,
  'Light rain shower': partlyrain,
  'Patchy light rain with thunder': storm,
  'Heavy snow': clouds,
  'Patchy rain possible': partlyrain,
  'Light drizzle': rain,
  'Light sleet': rain,
  Mist: fog,
  'Light snow': clouds,
  'Moderate rain': rain,
  'Patchy moderate snow': clouds,
  Sunny: sunny,
  'Moderate rain at times': partlyrain
}

const calculateColorForTemperature = (temperature) => {
  for (let i = 0; i < lines.length - 1; i++) {
    const [startValue] = lines[i]
    const [endValue] = lines[i + 1]

    if (temperature >= startValue && temperature <= endValue) {
      const ratio = (temperature - startValue) / (endValue - startValue)
      const startColor = e.color(startValue).match(/\d+/g).map(Number)
      const endColor = e.color(endValue).match(/\d+/g).map(Number)

      const interpolatedColor = startColor.map((start, index) => {
        const end = endColor[index]
        return Math.round(start + ratio * (end - start))
      })

      return `rgb(${interpolatedColor.join(',')})`
    }
  }

  return temperature < lines[0][0] ? e.color(lines[0][0]) : e.color(lines[lines.length - 1][0])
}
const getTemperatureColor2 = (temperature) => {
  // Giới hạn nhiệt độ (tùy chỉnh theo thực tế)
  const minTemp = 0 // Nhiệt độ thấp nhất
  const maxTemp = 40 // Nhiệt độ cao nhất

  // Mảng màu tùy chỉnh theo yêu cầu
  const colors = [
    '#0000FF', // 0-2°C: Xanh dương
    '#0033FF', // 2-4°C
    '#0066FF', // 4-6°C
    '#0099FF', // 6-8°C
    '#00CCFF', // 8-10°C
    '#00FFFF', // 10-12°C
    '#33FFCC', // 12-14°C
    '#66FF99', // 14-16°C
    '#99FF66', // 16-18°C
    '#CCFF33', // 18-20°C
    '#FFFF33', // 20-22°C: Xanh-vàng
    '#FFFF00', // 22-24°C: Vàng nhạt
    '#FFCC00', // 24-26°C: Vàng đậm
    '#FF9900', // 26-28°C: Cam nhạt
    '#FF6600', // 28-30°C: Cam đậm
    '#FF3300', // 30-32°C: Đỏ nhạt
    '#FF0000', // 32-34°C: Đỏ
    '#CC0000', // 34-36°C: Đỏ đậm
    '#990000', // 36-38°C: Đỏ sẫm
    '#660000' // 38-40°C: Đỏ tối
  ]

  // Đảm bảo nhiệt độ nằm trong khoảng giới hạn
  const clampedTemp = Math.min(Math.max(temperature, minTemp), maxTemp)

  // Tính chỉ số của khoảng nhiệt độ
  const colorIndex = Math.floor((clampedTemp - minTemp) / 2)

  // Trả về màu tương ứng
  return colors[colorIndex]
}
const WeatherForecast = ({ selectedFeature }) => {
  console.log('Received weatherData: ', selectedFeature)
  return (
    <div
      className='table-wrapper show notap svelte-d7htey'
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        // alignItems: 'center',
        justifyContent: 'space-around',
        color: 'black'
      }}
    >
      <table id='detail-data-table' style={{ width: '100%' }}>
        <tbody>
          <tr className='td-hour height-hour d-display-table'>
            <td>
              <div className='legend-hour height-hour d-display-table'>
                <span className='legend-left'>Giờ</span>
                <span data-do='metric,hour' className='legend-right'></span>
              </div>
            </td>
            <td data-ts='1733367600000'>00:00</td>
            <td data-ts='1733367600000'>01:00</td>
            <td data-ts='1733367600000'>02:00</td>
            <td data-ts='1733367600000'>03:00</td>
            <td data-ts='1733367600000'>04:00</td>
            <td data-ts='1733367600000'>05:00</td>
            <td data-ts='1733367600000'>06:00</td>
            <td data-ts='1733367600000'>07:00</td>
            <td data-ts='1733367600000'>08:00</td>
            <td data-ts='1733367600000'>09:00</td>
            <td data-ts='1733367600000'>10:00</td>
            <td data-ts='1733367600000'>11:00</td>
            <td data-ts='1733367600000'>12:00</td>
            <td data-ts='1733378400000'>13:00</td>
            <td data-ts='1733389200000'>14:00</td>
            <td data-ts='1733400000000'>15:00</td>
            <td data-ts='1733400000000'>16:00</td>
            <td data-ts='1733400000000'>17:00</td>
            <td data-ts='1733400000000'>18:00</td>
            <td data-ts='1733367600000'>19:00</td>
            <td data-ts='1733367600000'>20:00</td>
            <td data-ts='1733400000000'>21:00</td>
            <td data-ts='1733367600000'>22:00</td>
            <td data-ts='1733367600000'>23:00</td>

            {/* Thêm các ô khác vào đây */}
          </tr>

          <tr className='td-icon height-icon d-display-table'>
            <td></td>
            {selectedFeature.hourlyData.map((hourData, index) => {
              const description = hourData.description // Lấy mô tả thời tiết từ dữ liệu
              let iconSrc
              if (hourData.hour >= 18 || hourData.hour <= 5) {
                if (description.toLowerCase().includes('rain')) {
                  iconSrc = rainnight // Nếu >=6 và description chứa "rain"
                } else {
                  iconSrc = night // Nếu chỉ >=6
                }
              } else {
                iconSrc = descriptionToIconMap[description] || descriptionToIconMap['sunny'] // Nếu không thỏa mãn điều kiện trên
              } // Sử dụng ảnh từ map hoặc ảnh mặc định
              return (
                <td key={index}>
                  <img
                    src={iconSrc}
                    alt={description}
                    title={description} // Tooltip hiển thị mô tả thời tiết
                    style={{ width: '40px', height: '40px' }}
                  />
                </td>
              )
            })}
          </tr>
          <tr className='td-temp height-temp d-display-table'>
            <td>
              <div className='legend-temp height-temp d-display-table'>
                <span className='legend-left'>Nhiệt độ </span>
                <span data-do='metric,temp' className='legend-right metric-clickable'>
                  °C
                </span>
              </div>
            </td>
            {selectedFeature.hourlyData.map((hourData, index) => {
              const currentTemp = hourData.temperature
              const nextTemp =
                index < selectedFeature.hourlyData.length - 1
                  ? selectedFeature.hourlyData[index + 1].temperature
                  : currentTemp // Giá trị tiếp theo, nếu không có thì giữ nguyên nhiệt độ cuối

              const currentColor = getTemperatureColor2(currentTemp) // Màu hiện tại
              const nextColor = getTemperatureColor2(nextTemp) // Màu tiếp theo

              // Gradient liền mạch giữa hai nhiệt độ
              const background = `linear-gradient(to right, ${currentColor}, ${nextColor})`

              return (
                <td
                  key={index}
                  style={{
                    background: background
                    // color: '#fff' // Màu chữ phù hợp
                  }}
                >
                  {currentTemp}°C
                </td>
              )
            })}

            {/* Thêm các ô nhiệt độ khác */}
          </tr>
          <tr className='td-temp height-temp d-display-table'>
            <td>
              <div className='legend-rain height-rain d-display-table'>
                <span className='legend-left'>Độ ẩm </span>
                <span data-do='metric,rain' className='legend-right metric-clickable'>
                  %
                </span>
              </div>
            </td>
            {selectedFeature.hourlyData.map((hourData, index) => (
              <td key={index}>{hourData.humidity}%</td>
            ))}

            {/* Thêm các ô nhiệt độ khác */}
          </tr>
          <tr className='td-temp height-temp d-display-table'>
            <td>
              <div className='legend-wind height-wind d-display-table'>
                <span className='legend-left'>Gió </span>
                <span data-do='metric,wind' className='legend-right metric-clickable'>
                  kt
                </span>
              </div>
            </td>
            {selectedFeature.hourlyData.map((hourData, index) => (
              <td key={index}>{hourData.wind}Kt</td>
            ))}

            {/* Thêm các ô nhiệt độ khác */}
          </tr>
        </tbody>
      </table>
      {/* <div
        style={{
          flex: '0 0 200px', // Đặt chiều rộng cố định cho thông tin địa điểm
          padding: '10px',
          backgroundColor: '#f9f9f9',
          borderLeft: '1px solid #ddd', // Đường phân cách
          overflowY: 'auto' // Cuộn dọc nếu cần
        }}
      >
        <h4 style={{ color: '#333', marginBottom: '10px' }}>Thông tin địa điểm</h4>
        <p>
          <strong>Tên:</strong>
        </p>
        <p>
          <strong>Vùng:</strong>
        </p>
        <p>
          <strong>Kinh độ:</strong>
        </p>
        <p>
          <strong>Vĩ độ:</strong>
        </p>
        {/* Thêm các thông tin khác nếu cần */}
      {/* </div> */} */
    </div>
  )
}

export default WeatherForecast
