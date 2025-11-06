// EventBus.ts - 事件总线模块
import mitt from 'mitt'

// 创建全局事件总线实例
export const eventBus = mitt()

// 导出mitt的类型
export type EventType = string | symbol
export type EventHandler<T = unknown> = (payload?: T) => void

// 默认导出事件总线
export default eventBus