import io from 'socket.io-client'

let socket: any = null

export const initWebSocket = () => {
  // 这里可以连接到真实的WebSocket服务器
  // 暂时使用本地事件总线模拟
  console.log('🔌 WebSocket initialized')
  
  // 监听全局事件并转发到WebSocket
  window.addEventListener('simulation-notification', (event: any) => {
    // 在实际项目中，这里会发送到WebSocket服务器
    console.log('📡 WebSocket send:', event.detail)
  })
}

export const getSocket = () => socket

export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}