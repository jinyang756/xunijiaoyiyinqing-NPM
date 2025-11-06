import { bus } from '../core/Scheduler'
import { nanoid } from 'nanoid'
import { notify } from '../services/notification'

export interface SeatTrade {
  trade_id: string
  user_id: string
  stock_code: string
  stock_name: string
  price: number
  quantity: number
  direction: 'buy' | 'sell'
  timestamp: string
  fee: number
  status: 'pending' | 'completed' | 'cancelled'
}

export class SeatEngine {
  trades: SeatTrade[] = []
  
  constructor() {
    bus.on('scheduler_start', this.onSchedulerStart)
  }

  onSchedulerStart = () => {
    notify('机构席位引擎启动', '机构席位交易功能已启用')
  }

  executeTrade(userId: string, stockCode: string, stockName: string, price: number, quantity: number, direction: 'buy' | 'sell') {
    const trade: SeatTrade = {
      trade_id: nanoid(),
      user_id: userId,
      stock_code: stockCode,
      stock_name: stockName,
      price: price,
      quantity: quantity,
      direction: direction,
      timestamp: new Date().toISOString(),
      fee: price * quantity * 0.0005, // 万5手续费
      status: 'completed'
    }

    this.trades.push(trade)
    notify('机构席位交易', `${direction === 'buy' ? '买入' : '卖出'} ${stockName} ${quantity}股，价格¥${price}`)
    
    return trade.trade_id
  }

  getTradeHistory(userId: string): SeatTrade[] {
    return this.trades.filter(trade => trade.user_id === userId)
  }
}