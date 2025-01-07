import http from '../untils/http'

const getWeathers2 = async (dateId) => {
  try {
    const response = await http.get('mart', {
      // params: { Date: dateId }
      params: { date: dateId }
    })
    // console.log('API response:', response) // Kiểm tra toàn bộ phản hồi từ API
    return response // Trả về toàn bộ đối tượng phản hồi
  } catch (error) {
    console.error('Error fetching weather:', error.message)
    throw error
  }
}
export default getWeathers2
