import { bus } from '../core/Scheduler'
import { nanoid } from 'nanoid'
import { notify } from '../services/notification'

export interface OptionContract {
  option_id: string
  underlying_symbol: string
  strike_price: number
  expiry_date: string
  type: 'call' | 'put'
  premium: number
  quantity: number
  status: 'open' | 'exercised' | 'expired'
  pnl: number
  timestamp: string
}

export class OptionsEngine {
  contracts: OptionContract[] = []
  
  constructor() {
    bus.on('scheduler_start', this.onSchedulerStart)
    bus.on('tick', (now: Date) => this.onTick(now))
  }

  onSchedulerStart = () => {
    notify('期权策略引擎启动', '期权交易功能已启用')
  }

  onTick = (now: Date) => {
    // 检查到期期权
    this.contracts.forEach(contract => {
      if (contract.status === 'open') {
        const expiryDate = new Date(contract.expiry_date)
        if (now >= expiryDate) {
          this.expireOption(contract)
        }
      }
    })
  }

  createOption(underlyingSymbol: string, strikePrice: number, expiryDate: string, type: 'call' | 'put', premium: number, quantity: number) {
    const contract: OptionContract = {
      option_id: nanoid(),
      underlying_symbol: underlyingSymbol,
      strike_price: strikePrice,
      expiry_date: expiryDate,
      type: type,
      premium: premium,
      quantity: quantity,
      status: 'open',
      pnl: -premium * quantity, // 初始为负的期权费
      timestamp: new Date().toISOString()
    }

    this.contracts.push(contract)
    notify('期权开仓', `开仓${type === 'call' ? '看涨' : '看跌'}期权 ${underlyingSymbol}，行权价${strikePrice}，权利金¥${premium}`)

    return contract.option_id
  }

  exerciseOption(optionId: string, underlyingPrice: number) {
    const contract = this.contracts.find(c => c.option_id === optionId)
    if (contract && contract.status === 'open') {
      let payoff = 0
      if (contract.type === 'call') {
        payoff = Math.max(0, underlyingPrice - contract.strike_price) * contract.quantity
      } else {
        payoff = Math.max(0, contract.strike_price - underlyingPrice) * contract.quantity
      }
      
      contract.pnl = payoff - (contract.premium * contract.quantity)
      contract.status = 'exercised'
      
      notify('期权行权', `${contract.type === 'call' ? '看涨' : '看跌'}期权行权，盈亏¥${contract.pnl.toFixed(2)}`)
      
      return contract.pnl
    }
    return 0
  }

  expireOption(contract: OptionContract) {
    if (contract.status === 'open') {
      // 到期时期权价值为0，盈亏就是已支付的权利金
      contract.status = 'expired'
      notify('期权到期', `${contract.underlying_symbol}期权到期，损失权利金¥${(contract.premium * contract.quantity).toFixed(2)}`)
    }
  }

  getOpenOptions(): OptionContract[] {
    return this.contracts.filter(c => c.status === 'open')
  }
}