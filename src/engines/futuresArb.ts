import { bus } from '../core/Scheduler'
import { nanoid } from 'nanoid'
import { notify } from '../services/notification'

export interface FuturesContract {
  contract_id: string
  symbol: string
  expiry_date: string
  price: number
  quantity: number
  leverage: number
  status: 'open' | 'closed'
  pnl: number
  timestamp: string
}

export class FuturesArbEngine {
  contracts: FuturesContract[] = []
  
  constructor() {
    bus.on('scheduler_start', this.onSchedulerStart)
    bus.on('tick', (now: Date) => this.onTick(now))
  }

  onSchedulerStart = () => {
    notify('期货套利引擎启动', '期货套利交易功能已启用')
  }

  onTick = (now: Date) => {
    // 更新持仓盈亏
    this.contracts.forEach(contract => {
      if (contract.status === 'open') {
        // 模拟价格波动和盈亏计算
        const priceChange = (Math.random() * 2 - 1) * 0.005 // ±0.5%波动
        const newPrice = contract.price * (1 + priceChange)
        contract.pnl = (newPrice - contract.price) * contract.quantity * contract.leverage
        contract.price = newPrice
      }
    })
  }

  openPosition(symbol: string, price: number, quantity: number, leverage: number) {
    const contract: FuturesContract = {
      contract_id: nanoid(),
      symbol: symbol,
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天后到期
      price: price,
      quantity: quantity,
      leverage: leverage,
      status: 'open',
      pnl: 0,
      timestamp: new Date().toISOString()
    }

    this.contracts.push(contract)
    notify('期货开仓', `开仓${symbol} ${quantity}手，价格${price}，杠杆${leverage}倍`)

    return contract.contract_id
  }

  closePosition(contractId: string) {
    const contract = this.contracts.find(c => c.contract_id === contractId)
    if (contract && contract.status === 'open') {
      contract.status = 'closed'
      notify('期货平仓', `平仓${contract.symbol}，盈亏¥${contract.pnl.toFixed(2)}`)
      return contract.pnl
    }
    return 0
  }

  getOpenPositions(): FuturesContract[] {
    return this.contracts.filter(c => c.status === 'open')
  }
}