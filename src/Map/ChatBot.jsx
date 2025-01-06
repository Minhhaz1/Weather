import React, { useState, useEffect, useRef } from 'react'
import getChatbotData from './chatbotapi' // Giả sử bạn đã tạo hàm gọi API này

const Chatbot = ({ isVisible, toggleVisibility }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Tôi là trợ lý chatbot.' },
    { sender: 'bot', text: 'Bạn cần tôi hỗ trợ gì?' }
  ])
  const [userMessage, setUserMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false) // Trạng thái loading

  // Tạo ref để tham chiếu đến phần tử chứa tin nhắn
  const chatEndRef = useRef(null)

  // Hàm gửi tin nhắn
  const handleSendMessage = async () => {
    if (userMessage.trim() === '') return

    // Thêm tin nhắn của người dùng vào danh sách
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }])
    setUserMessage('') // Xóa nội dung ô nhập sau khi gửi

    setIsLoading(true) // Đặt trạng thái loading thành true khi gọi API

    try {
      // Gọi API chatbot với câu truy vấn người dùng gửi
      const response = await getChatbotData(userMessage)

      // Giả sử API trả về một trường `response` chứa câu trả lời
      const botResponse = response.response || 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn.'
      console.log(botResponse)
      // Thêm phản hồi từ chatbot vào danh sách tin nhắn
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }])
    } catch (error) {
      console.error('Error fetching chatbot response:', error.message)
    } finally {
      setIsLoading(false) // Đặt trạng thái loading thành false sau khi API trả về kết quả
    }
  }

  // Hook để cuộn xuống mỗi khi tin nhắn thay đổi
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages]) // Khi messages thay đổi, tự động cuộn xuống

  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: '50px',
        right: '10px',
        zIndex: 1000,
        width: '300px',
        height: '400px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#007bff' }}>Chatbot</h3>
        <button
          onClick={toggleVisibility}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            color: '#007bff'
          }}
        >
          ✖
        </button>
      </div>

      <div
        id='chat'
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          marginTop: '10px',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
              backgroundColor: msg.sender === 'bot' ? '#e8e8e8' : '#007bff',
              color: msg.sender === 'bot' ? '#000' : '#fff',
              padding: '10px',
              borderRadius: msg.sender === 'bot' ? '10px 10px 10px 0px' : '10px 10px 0px 10px',
              maxWidth: '70%',
              wordWrap: 'break-word'
            }}
          >
            {msg.text}
          </div>
        ))}
        {/* Thêm ref để cuộn tới cuối phần chat */}
        <div ref={chatEndRef} />
        {/* Hiển thị "Chatbot đang nhập" nếu đang loading */}
        {isLoading && <div className='loading-dot'>Chatbot đang nhập...</div>}
      </div>

      <div style={{ display: 'flex', marginTop: '10px' }}>
        <input
          type='text'
          placeholder='Nhập tin nhắn...'
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          style={{
            flexGrow: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginRight: '10px'
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Gửi
        </button>
      </div>

      {/* Thêm phần CSS cho hiệu ứng nhấp nháy */}
      <style>
        {`
          @keyframes blink {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }

          .loading-dot {
            text-align: left; /* Đặt dấu ba chấm sang trái */
            font-size: 10px;
            color: #007bff;
            animation: blink 1s step-start infinite;
            margin-top: 10px;
            margin-left: 10px;
            font-weight: bold;
          }
        `}
      </style>
    </div>
  )
}

export default Chatbot
