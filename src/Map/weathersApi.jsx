import http from '../untils/http'

// Hàm gọi API lấy dữ liệu thời tiết theo `date_id`
const getWeathers = async (dateId) => {
  try {
    const response = await http.get('storm', {
      // params: { Date: dateId }
      params: { weatherCode: dateId }
    })
    // console.log('API response:', response) // Kiểm tra toàn bộ phản hồi từ API
    return response // Trả về toàn bộ đối tượng phản hồi
  } catch (error) {
    console.error('Error fetching weather:', error.message)
    throw error
  }
}

const getWeathers2 = async (dateId) => {
  try {
    const response = await http.get('mart', {
      // params: { Date: dateId }
      params: { date: dateId }
    })
    console.log('API response:', response) // Kiểm tra toàn bộ phản hồi từ API
    return response // Trả về toàn bộ đối tượng phản hồi
  } catch (error) {
    console.error('Error fetching weather:', error.message)
    throw error
  }
}
export default getWeathers
