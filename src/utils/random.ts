// 随机数工具函数

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randomFloat = (min: number, max: number, decimals: number = 2): number => {
  const rand = Math.random() * (max - min) + min
  return parseFloat(rand.toFixed(decimals))
}

export const randomBoolean = (probability: number = 0.5): boolean => {
  return Math.random() < probability
}

export const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

export const randomShuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}