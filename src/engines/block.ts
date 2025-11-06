import { bus } from '../core/Scheduler'
import { nanoid } from 'nanoid'
import { notify } from '../services/notification'

export interface BlockTrade {
  trade_id: string
  stock_code: string
  stock_name: string
  price: number
  quantity: number
  buyer: string
  seller: string
  timestamp: string
  discount_rate: number
  status: 'pending' | 'completed' | 'cancelled'
}

export class BlockEngine {
  trades: BlockTrade[] = []
  
  constructor() {
    this.generateHistoricalBlockTrades()
    bus.on('scheduler_start', this.onSchedulerStart)
  }

  onSchedulerStart = () => {
    notify('大宗交易引擎启动', '大宗交易功能已启用')
  }

  generateHistoricalBlockTrades() {
    // 生成一些历史大宗交易数据
    const historicalTrades: BlockTrade[] = [
      {
        trade_id: nanoid(),
        stock_code: '600036',
        stock_name: '招商银行',
        price: 35.20,
        quantity: 1000000,
        buyer: '机构A',
        seller: '机构B',
        timestamp: '2025-08-10T10:30:00',
        discount_rate: 0.02,
        status: 'completed'
      }
    ]
    
    this.trades = historicalTrades
  }

  executeBlockTrade(stockCode: string, stockName: string, price: number, quantity: number, buyer: string, seller: string, discountRate: number) {
    const trade: BlockTrade = {
      trade_id: nanoid(),
      stock_code: stockCode,
      stock_name: stockName,
      price: price,
      quantity: quantity,
      buyer: buyer,
      seller: seller,
      timestamp: new Date().toISOString(),
      discount_rate: discountRate,
      status: 'completed'
    }

    this.trades.push(trade)
    notify('大宗交易', `${stockName} ${quantity}股大宗交易完成，折价率${(discountRate * 100).toFixed(2)}%`)
    
    return trade.trade_id
  }

  getBlockTrades(): BlockTrade[] {
    return this.trades
  }
}