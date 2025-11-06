import { bus } from '../core/Scheduler'
import { nanoid } from 'nanoid'
import { notify } from '../services/notification'

export interface ETFProduct {
  etf_code: string
  etf_name: string
  nav: number
  components: { symbol: string; shares: number }[]
  creation_redemption_unit: number
  status: 'active' | 'suspended'
}

export interface ETFTrade {
  trade_id: string
  user_id: string
  etf_code: string
  etf_name: string
  quantity: number
  amount: number
  nav: number
  timestamp: string
  type: 'creation' | 'redemption'
  status: 'pending' | 'completed' | 'cancelled'
}

export class ETFCreationEngine {
  products: ETFProduct[] = [
    {
      etf_code: '510310',
      etf_name: '沪深300ETF',
      nav: 3.856,
      components: [
        { symbol: '600036', shares: 10 },
        { symbol: '600037', shares: 8 },
        { symbol: '600038', shares: 5 }
      ],
      creation_redemption_unit: 1000000,
      status: 'active'
    }
  ]
  
  trades: ETFTrade[] = []
  
  constructor() {
    bus.on('scheduler_start', this.onSchedulerStart)
    bus.on('tick', (now: Date) => this.onTick(now))
  }

  onSchedulerStart = () => {
    notify('ETF申赎引擎启动', 'ETF申购赎回功能已启用')
  }

  onTick = (now: Date) => {
    // 模拟ETF净值波动
    this.products.forEach(etf => {
      if (etf.status === 'active') {
        // 模拟净值波动
        const drift = 1 + (Math.random() * 2 - 1) * 0.002
        etf.nav = +(etf.nav * drift).toFixed(4)
      }
    })
  }

  createETF(userId: string, etfCode: string, quantity: number) {
    const etf = this.products.find(e => e.etf_code === etfCode)
    if (!etf || etf.status !== 'active') {
      notify('ETF申购失败', 'ETF不存在或已暂停交易')
      return null
    }

    const amount = quantity * etf.nav
    
    const trade: ETFTrade = {
      trade_id: nanoid(),
      user_id: userId,
      etf_code: etfCode,
      etf_name: etf.etf_name,
      quantity: quantity,
      amount: amount,
      nav: etf.nav,
      timestamp: new Date().toISOString(),
      type: 'creation',
      status: 'completed'
    }

    this.trades.push(trade)
    notify('ETF申购', `成功申购${etf.etf_name} ${quantity}份，金额¥${amount.toFixed(2)}`)

    return trade.trade_id
  }

  redeemETF(userId: string, etfCode: string, quantity: number) {
    const etf = this.products.find(e => e.etf_code === etfCode)
    if (!etf || etf.status !== 'active') {
      notify('ETF赎回失败', 'ETF不存在或已暂停交易')
      return null
    }

    const amount = quantity * etf.nav
    
    const trade: ETFTrade = {
      trade_id: nanoid(),
      user_id: userId,
      etf_code: etfCode,
      etf_name: etf.etf_name,
      quantity: quantity,
      amount: amount,
      nav: etf.nav,
      timestamp: new Date().toISOString(),
      type: 'redemption',
      status: 'completed'
    }

    this.trades.push(trade)
    notify('ETF赎回', `成功赎回${etf.etf_name} ${quantity}份，到账¥${amount.toFixed(2)}`)

    return trade.trade_id
  }

  getETFProducts(): ETFProduct[] {
    return this.products
  }

  getUserTrades(userId: string): ETFTrade[] {
    return this.trades.filter(trade => trade.user_id === userId)
  }
}