import { bus } from '../core/Scheduler'
import { nanoid } from 'nanoid'
import { notify } from '../services/notification'

export interface FundProduct {
  fund_code: string
  fund_name: string
  nav: number
  strategy: string
  volatility: number
  manager: string
  status: 'active' | 'closed'
}

export interface FundTrade {
  trade_id: string
  user_id: string
  fund_code: string
  fund_name: string
  amount: number
  shares: number
  nav: number
  timestamp: string
  type: 'subscription' | 'redemption'
  fee: number
  status: 'pending' | 'completed' | 'cancelled'
}

export class FundEngine {
  products: FundProduct[] = [
    {
      fund_code: 'JCF-CTA-001',
      fund_name: '量化CTA一号',
      nav: 1.2567,
      strategy: 'CTA',
      volatility: 0.015,
      manager: '张三',
      status: 'active'
    },
    {
      fund_code: 'JCF-QM-002',
      fund_name: '量化多因子二号',
      nav: 1.1892,
      strategy: '多因子',
      volatility: 0.012,
      manager: '李四',
      status: 'active'
    },
    {
      fund_code: 'JCF-ARBITRAGE-003',
      fund_name: '统计套利三号',
      nav: 1.3421,
      strategy: '统计套利',
      volatility: 0.008,
      manager: '王五',
      status: 'active'
    },
    {
      fund_code: 'JCF-ALPHA-004',
      fund_name: 'AI阿尔法四号',
      nav: 1.4563,
      strategy: 'AI阿尔法',
      volatility: 0.020,
      manager: '赵六',
      status: 'active'
    },
    {
      fund_code: 'JCF-BOND-005',
      fund_name: '固收增强五号',
      nav: 1.0897,
      strategy: '固收增强',
      volatility: 0.005,
      manager: '孙七',
      status: 'active'
    }
  ]
  
  trades: FundTrade[] = []
  
  constructor() {
    bus.on('scheduler_start', this.onSchedulerStart)
    bus.on('tick', (now: Date) => this.onTick(now))
  }

  onSchedulerStart = () => {
    notify('私募基金引擎启动', '私募基金交易功能已启用')
  }

  onTick = (now: Date) => {
    // 模拟基金净值波动
    this.products.forEach(product => {
      if (product.status === 'active') {
        // 模拟净值波动
        const drift = 1 + (Math.random() * 2 - 1) * product.volatility
        product.nav = +(product.nav * drift).toFixed(4)
      }
    })
  }

  subscribeFund(userId: string, fundCode: string, amount: number) {
    const fund = this.products.find(f => f.fund_code === fundCode)
    if (!fund || fund.status !== 'active') {
      notify('基金申购失败', '基金不存在或已关闭')
      return null
    }

    const shares = amount / fund.nav
    const fee = amount * 0.01 // 1%申购费
    
    const trade: FundTrade = {
      trade_id: nanoid(),
      user_id: userId,
      fund_code: fundCode,
      fund_name: fund.fund_name,
      amount: amount,
      shares: shares,
      nav: fund.nav,
      timestamp: new Date().toISOString(),
      type: 'subscription',
      fee: fee,
      status: 'completed'
    }

    this.trades.push(trade)
    notify('基金申购', `成功申购${fund.fund_name} ${shares.toFixed(2)}份，金额¥${amount}`)

    return trade.trade_id
  }

  redeemFund(userId: string, fundCode: string, shares: number) {
    const fund = this.products.find(f => f.fund_code === fundCode)
    if (!fund || fund.status !== 'active') {
      notify('基金赎回失败', '基金不存在或已关闭')
      return null
    }

    const amount = shares * fund.nav
    const fee = amount * 0.005 // 0.5%赎回费
    
    const trade: FundTrade = {
      trade_id: nanoid(),
      user_id: userId,
      fund_code: fundCode,
      fund_name: fund.fund_name,
      amount: amount,
      shares: shares,
      nav: fund.nav,
      timestamp: new Date().toISOString(),
      type: 'redemption',
      fee: fee,
      status: 'completed'
    }

    this.trades.push(trade)
    notify('基金赎回', `成功赎回${fund.fund_name} ${shares.toFixed(2)}份，到账¥${(amount - fee).toFixed(2)}`)

    return trade.trade_id
  }

  getFundProducts(): FundProduct[] {
    return this.products
  }

  getUserTrades(userId: string): FundTrade[] {
    return this.trades.filter(trade => trade.user_id === userId)
  }
}