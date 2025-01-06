import http from '../untils/http'

// Hàm gọi API lấy dữ liệu thời tiết theo `date_id`

const getChatbotData = async (query) => {
  try {
    // Gửi yêu cầu POST với dữ liệu JSON
    const response = await http.post('chatbot/query', {
      query: query, // Câu truy vấn của người dùng
      collection_name: 'data_test', // Tên collection
      chat_history: [
        { role: 'user', content: 'Thời tiết hôm qua ở Hà Nội?' },
        { role: 'assistant', content: 'Hôm qua Hà Nội trời nắng, nhiệt độ từ 20°C đến 25°C.' }
      ]
    })

    // Kiểm tra và in ra dữ liệu trả về
    console.log('Chatbot API response data:', response.data) // Dữ liệu trả về từ API

    // Trả về dữ liệu từ phản hồi
    return response.data
  } catch (error) {
    console.error('Error fetching chatbot data:', error.message)
    throw error
  }
}
export default getChatbotData
