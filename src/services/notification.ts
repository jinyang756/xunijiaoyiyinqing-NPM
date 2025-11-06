interface Notification {
  title: string
  message: string
  type?: 'success' | 'info' | 'warning' | 'error'
  duration?: number
  [key: string]: any
}

export const notify = (title: string, message: string, type: Notification['type'] = 'info') => {
  // 使用浏览器通知 API
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/favicon.ico'
    })
  }
  
  // 触发自定义事件，其他组件可以监听
  const event = new CustomEvent('simulation-notification', {
    detail: { title, message, type, timestamp: new Date().toISOString() }
  })
  window.dispatchEvent(event)
}

// 请求通知权限
export const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}