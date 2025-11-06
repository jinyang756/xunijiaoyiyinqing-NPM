// 核心调度器
export * from './core/Scheduler'
export * from './core/EventBus'

// 业务引擎
export * from './engines/ipo'
export * from './engines/seat'
export * from './engines/block'
export * from './engines/fund'
export * from './engines/fundContract'
export * from './engines/futuresArb' // 新增期货套利
export * from './engines/etfCreation' // 新增ETF申赎
export * from './engines/options' // 新增期权策略

// 状态管理
export * from './store/simulationStore'
export * from './store/accountStore'

// 工具函数
export * from './utils/random'
export * from './utils/time'
export * from './utils/export'
export * from './utils/websocket'

// 服务
export * from './services/supabase'
export * from './services/notification'

// 初始化函数
import { Scheduler } from './core/Scheduler'
import { IpoEngine } from './engines/ipo'
import { SeatEngine } from './engines/seat'
import { BlockEngine } from './engines/block'
import { FundEngine } from './engines/fund'
import { FundContractEngine } from './engines/fundContract'
import { FuturesArbEngine } from './engines/futuresArb'
import { ETFCreationEngine } from './engines/etfCreation'
import { OptionsEngine } from './engines/options'

interface InitOptions {
  seed?: number
  speed?: number              // 加速倍率
  startAt?: Date
  enableFundContract?: boolean
  enableFutures?: boolean
  enableETF?: boolean
  enableOptions?: boolean
  enableSupabase?: boolean
  enableWebSocket?: boolean
  demoAccount?: boolean       // 是否启用模拟账户
}

export const initSimulation = (opts?: InitOptions) => {
  // 1) 调度器
  const scheduler = new Scheduler(opts?.startAt, { speed: opts?.speed || 60 })
  
  // 2) 业务引擎
  const engines: any[] = [
    new IpoEngine(),
    new SeatEngine(),
    new BlockEngine(),
    new FundEngine(),
    new FundContractEngine(),
  ]

  // 可选引擎
  if (opts?.enableFutures !== false) engines.push(new FuturesArbEngine())
  if (opts?.enableETF !== false) engines.push(new ETFCreationEngine())
  if (opts?.enableOptions !== false) engines.push(new OptionsEngine())

  // 3) 初始化服务
  if (opts?.enableSupabase) {
    const { initSupabase } = require('./services/supabase')
    initSupabase()
  }

  if (opts?.enableWebSocket) {
    const { initWebSocket } = require('./utils/websocket')
    initWebSocket()
  }

  if (opts?.demoAccount) {
    const { initDemoAccount } = require('./store/accountStore')
    initDemoAccount()
  }
  
  // 4) 启动
  scheduler.start()
  return scheduler
}