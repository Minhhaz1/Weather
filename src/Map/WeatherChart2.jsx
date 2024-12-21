// import React from 'react'
// import './index.css'

// const WeatherForecast = ({ weatherData }) => {
//   return (
//     <div
//       className='table-wrapper show notap svelte-d7htey'
//       style={{
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         width: '100%',
//         height: '33%',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-around'
//       }}
//     >
//       {/* Hiển thị tiêu đề các cột */}
//       <div className='legend svelte-734wky' data-date-label=''>
//         <div
//           className='legend-hour height-hour d-display-table'
//           style={{
//             height: '50px',
//             width: '100px',
//             padding: 'auto',
//             marginTop: '5px'
//           }}
//         >
//           <span className='legend-left'>Giờ</span>
//           <span data-do='metric,hour' className='legend-right'></span>
//         </div>
//         <div className='legend-temp height-temp d-display-table'>
//           <span className='legend-left'>Nhiệt độ</span>
//           <span data-do='metric,temp' className='legend-right metric-clickable'>
//             °C
//           </span>
//         </div>
//       </div>

//       Bảng hiển thị dữ liệu thời tiết
//       <table id='detail-data-table' style={{ width: '100%' }}>
//         <tbody>
//           {/* Hiển thị ngày */}
//           {weatherData.days.map((day) => (
//             <>
//               <tr className='td-days height-days' key={day.date}>
//                 <td colSpan={day.hours.length} className='sticky-title-wrapper' data-day={day.date}>
//                   <div className='sticky-title' data-daydiv={day.date}>
//                     {day.dayLabel}
//                   </div>
//                 </td>
//               </tr>

//               {/* Hiển thị giờ */}
//               <tr className='td-hour height-hour d-display-table'>
//                 {day.hours.map((hour, index) => (
//                   <td key={`${day.date}-hour-${index}`} data-ts={hour.time}>
//                     {hour.time}
//                   </td>
//                 ))}
//               </tr>

//               {/* Hiển thị icon */}
//               <tr className='td-icon height-icon d-display-table'>
//                 {day.hours.map((hour, index) => (
//                   <td key={`${day.date}-icon-${index}`}>
//                     <img
//                       src={`/img/icons7/png_25px/${hour.icon}`}
//                       srcSet={`/img/icons7/png_25@2x/${hour.icon} 2x`}
//                       alt={`Icon ${hour.icon}`}
//                     />
//                   </td>
//                 ))}
//               </tr>

//               {/* Hiển thị nhiệt độ */}
//               <tr className='td-temp height-temp d-display-table'>
//                 {day.hours.map((hour, index) => (
//                   <td key={`${day.date}-temp-${index}`}>{hour.temperature}</td>
//                 ))}
//               </tr>
//             </>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// export default WeatherForecast
import React from 'react'
import './index.css'

import icon19 from './png/rain.gif'
import sunny from './png/sunny.gif'
import rain from './png/rain.gif'
import storm from './png/storm.gif'
import clouds from './png/clouds.gif'
import wind from './png/wind.gif'
import moon_sun from './png/moon_sun.gif'

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

// Tính toán màu cho từng giá trị cụ thể
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
      {/* <div className='legend svelte-734wky' data-date-label=''>
        <div
          className='legend-hour height-hour d-display-table'
          style={{ height: '50px', width: '100px', padding: 'auto', marginTop: '5px' }}
        >
          <span className='legend-left'>Giờ</span>
          <span data-do='metric,hour' className='legend-right'></span>
        </div>
        <div className='legend-icon height-icon d-display-table'>
          <span className='legend-left'></span>
          <span data-do='metric,icon' className='legend-right'></span>
        </div>
        <div className='legend-temp height-temp d-display-table'>
          <span className='legend-left'>Nhiệt độ</span>
          <span data-do='metric,temp' className='legend-right metric-clickable'>
            °C
          </span>
        </div>
        <div className='legend-rain height-rain d-display-table'>
          <span className='legend-left'>Mưa</span>
          <span data-do='metric,rain' className='legend-right metric-clickable'>
            mm
          </span>
        </div>
        <div className='legend-wind height-wind d-display-table'>
          <span className='legend-left'>Gió</span>
          <span data-do='metric,wind' className='legend-right metric-clickable'>
            kt
          </span>
        </div>
      </div> */}
      {/* <div className='legend svelte-734wky' data-date-label=''>
        <div
          className='legend-hour height-hour d-display-table'
          style={{ height: '50px', width: '100px', padding: 'auto', marginTop: '5px' }}
        >
          <span className='legend-left'>Giờ</span>
          <span data-do='metric,hour' className='legend-right'></span>
        </div>
        <div className='legend-icon height-icon d-display-table'>
          <span className='legend-left'></span>
          <span data-do='metric,icon' className='legend-right'></span>
        </div>
        <div className='legend-temp height-temp d-display-table'>
          <span className='legend-left'>Nhiệt độ</span>
          <span data-do='metric,temp' className='legend-right metric-clickable'>
            °C
          </span>
        </div>
        <div className='legend-rain height-rain d-display-table'>
          <span className='legend-left'>Độ ẩm </span>
          <span data-do='metric,rain' className='legend-right metric-clickable'>
            mm
          </span>
        </div>
        <div className='legend-wind height-wind d-display-table'>
          <span className='legend-left'>Gió</span>
          <span data-do='metric,wind' className='legend-right metric-clickable'>
            kt
          </span>
        </div>
      </div> */}
      <table id='detail-data-table' style={{ width: '100%' }}>
        <tbody>
          {/* <tr className='td-days height-days'>
            <td colSpan='5' className='sticky-title-wrapper' data-day='2024-12-05'>
              <div className='sticky-title' data-daydiv='2024-12-05'>
                Thứ Năm 5
              </div>
            </td>
            <td colSpan='8' className='sticky-title-wrapper' data-day='2024-12-06'>
              <div className='sticky-title' data-daydiv='2024-12-06'>
                Thứ Sáu 6
              </div>
            </td>
            <td colSpan='8' className='sticky-title-wrapper' data-day='2024-12-07'>
              <div className='sticky-title' data-daydiv='2024-12-07'>
                Thứ Bảy 7
              </div>
            </td>
            <td colSpan='8' className='sticky-title-wrapper' data-day='2024-12-08'>
              <div className='sticky-title' data-daydiv='2024-12-08'>
                Chủ Nhật 8
              </div>
            </td>
            <td colSpan='8' className='sticky-title-wrapper' data-day='2024-12-09'>
              <div className='sticky-title' data-daydiv='2024-12-09'>
                Thứ Hai 9
              </div>
            </td>
            <td colSpan='8' className='sticky-title-wrapper' data-day='2024-12-10'>
              <div className='sticky-title' data-daydiv='2024-12-10'>
                Thứ Ba 10
              </div>
            </td>
          </tr> */}
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
            <td>{/* <img src={icon19} alt='Icon 19' /> */}</td>
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>{' '}
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>{' '}
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>{' '}
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>{' '}
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>{' '}
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>{' '}
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>{' '}
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>{' '}
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>{' '}
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>{' '}
            <td>
              <img src={rain} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>
            <td>
              <img src={sunny} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>
            <td>
              <img src={moon_sun} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>
            <td>
              <img src={clouds} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>
            <td>
              <img src={sunny} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>
            <td>
              <img src={storm} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>
            <td>
              <img src={icon19} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>
            <td>
              <img src={icon19} alt='Icon 19' style={{ width: '60px', height: '60px' }} />
            </td>
            {/* Thêm các ảnh khác */}
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
    </div>
  )
}

export default WeatherForecast
