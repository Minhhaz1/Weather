import React, { useState } from 'react'

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
              alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end', // Căn bên trái cho bot, bên phải cho người dùng
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
    </div>
  )
}

export default Chatbot
