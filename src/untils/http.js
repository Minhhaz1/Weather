import axios from 'axios'

class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: 'https://0eb0-58-186-77-73.ngrok-free.app/',
      timeout: 500000,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true' // Nếu cần bỏ qua cảnh báo ngrok
      }
    })
  }
}

const http = new Http().instance

export default http
