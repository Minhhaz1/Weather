import axios from 'axios'

class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: 'https://ca47-118-71-35-77.ngrok-free.app/api/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true' // Nếu cần bỏ qua cảnh báo ngrok
      }
    })
  }
}

const http = new Http().instance

export default http
