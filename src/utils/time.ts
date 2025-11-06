// 时间工具函数

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const formatTime = (date: Date): string => {
  return date.toISOString().split('T')[1].split('.')[0]
}

export const formatDateTime = (date: Date): string => {
  return date.toISOString().replace('T', ' ').split('.')[0]
}

export const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000)
}

export const addHours = (date: Date, hours: number): Date => {
  return new Date(date.getTime() + hours * 3600000)
}

export const addDays = (date: Date, days: number): Date => {
  return new Date(date.getTime() + days * 86400000)
}

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay()
  return day === 0 || day === 6
}

export const isWorkday = (date: Date): boolean => {
  return !isWeekend(date)
}