import axios from 'axios'

class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: 'https://f042-2401-d800-91c1-ecf7-953c-cf76-868c-452a.ngrok-free.app/',
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
