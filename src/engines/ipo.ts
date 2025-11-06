import { bus } from '../core/Scheduler'
import { nanoid } from 'nanoid'
import { useSimulationStore } from '../store/simulationStore'
import { notify } from '../services/notification'

export interface IpoStock {
  stock_id: string
  stock_code: string
  stock_name: string
  issue_price: number
  market_price: number
  subscription_quota: number
  subscribed_shares: number
  win_rate: number
  status: 'upcoming' | 'subscription' | 'allocated' | 'trading'
  listing_date: string
}

export class IpoEngine {
  stocks: IpoStock[] = []
  
  constructor() {
    this.generateHistoricalIpos()
    bus.on('tick', (now: Date) => this.onTick(now))
    bus.on('scheduler_start', this.onSchedulerStart)
  }

  onSchedulerStart = () => {
    notify('新股申购引擎启动', '新股申购功能已启用')
  }

  generateHistoricalIpos() {
    // 生成一些历史新股数据
    const historicalIpos: IpoStock[] = [
      {
        stock_id: nanoid(),
        stock_code: '600100',
        stock_name: '同方股份',
        issue_price: 6.28,
        market_price: 8.50,
        subscription_quota: 10000,
        subscribed_shares: 0,
        win_rate: 0.005,
        status: 'trading',
        listing_date: '2025-08-15'
      },
      {
        stock_id: nanoid(),
        stock_code: '600111',
        stock_name: '北方稀土',
        issue_price: 12.65,
        market_price: 15.20,
        subscription_quota: 8000,
        subscribed_shares: 0,
        win_rate: 0.003,
        status: 'trading',
        listing_date: '2025-08-22'
      }
    ]
    
    this.stocks = historicalIpos
  }

  onTick = (now: Date) => {
    // 模拟新股申购流程
    this.stocks.forEach(stock => {
      if (stock.status === 'subscription') {
        // 模拟申购过程
        if (Math.random() < 0.1) {
          this.processSubscription(stock)
        }
      }
    })
  }

  processSubscription(stock: IpoStock) {
    // 模拟申购结果
    const win = Math.random() < stock.win_rate
    if (win) {
      stock.subscribed_shares = Math.floor(Math.random() * 1000) + 100
      stock.status = 'allocated'
      notify('新股申购成功', `${stock.stock_name} 申购成功，获得 ${stock.subscribed_shares} 股`)
    } else {
      stock.status = 'allocated' // 即使未中签也标记为已处理
      notify('新股申购结果', `${stock.stock_name} 申购未中签`)
    }
  }

  subscribeToIpo(stockId: string, shares: number) {
    const stock = this.stocks.find(s => s.stock_id === stockId)
    if (stock && stock.status === 'subscription') {
      // 这里可以添加申购逻辑
      notify('申购提交', `已提交 ${stock.stock_name} 的申购请求`)
      return true
    }
    return false
  }
}