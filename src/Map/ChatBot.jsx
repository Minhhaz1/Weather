import React, { useState, useEffect } from 'react'

const Chatbot = ({ isVisible, toggleVisibility }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Tôi là trợ lý chatbot.' },
    { sender: 'bot', text: 'Bạn cần tôi hỗ trợ gì?' }
  ])
  const [userMessage, setUserMessage] = useState('')

  const handleSendMessage = () => {
    if (userMessage.trim() === '') return

    // Thêm tin nhắn của người dùng vào danh sách
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }])
    setUserMessage('') // Xóa nội dung ô nhập sau khi gửi

    // Mô phỏng phản hồi từ chatbot
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage)
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }])
    }, 1000)
  }

  const generateBotResponse = (message) => {
    // Logic xử lý câu hỏi và trả lời
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes('hello') || lowerMessage.includes('xin chào')) {
      return 'Xin chào! Tôi có thể giúp gì cho bạn?'
    } else if (lowerMessage.includes('thời tiết')) {
      return 'Thời tiết hôm nay rất đẹp!'
    } else if (lowerMessage.includes('giờ') || lowerMessage.includes('time')) {
      return `Hiện tại là ${new Date().toLocaleTimeString()}.`
    } else {
      return 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi lại không?'
    }
  }

  if (!isVisible) return null // Không render nếu không hiển thị

  return (
    <div
      style={{
        position: 'absolute',
        top: '50px',
        right: '10px',
        zIndex: 1000,
        width: '300px',
        height: '400px',
        backgroundColor: '#f1f1f1',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Chatbot</h3>
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
        style={{
          flexGrow: 1,
          overflowY: 'scroll',
          marginBottom: '10px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          padding: '5px'
        }}
      >
        {messages.map((msg, index) => (
          <p
            key={index}
            style={{
              textAlign: msg.sender === 'bot' ? 'left' : 'right',
              margin: '5px 0',
              color: msg.sender === 'bot' ? '#000' : '#007bff'
            }}
          >
            {msg.text}
          </p>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type='text'
          placeholder='Nhập tin nhắn...'
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          style={{
            flexGrow: 1,
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginRight: '10px'
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} // Gửi khi nhấn Enter
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: '8px 15px',
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
    </div>
  )
}

export default Chatbot
